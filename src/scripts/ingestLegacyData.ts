import dotenv from "dotenv";
import mongoose from "mongoose";
import { BrandModel } from "../app/modules/brands/brands.model.js";
import { CategoryModel } from "../app/modules/categories/categories.model.js";
import { ProductModel } from "../app/modules/products/products.model.js";

dotenv.config();

const mongodbUri =
  process.env.MONGODB_URL ||
  "mongodb+srv://TechBasket:DGSiflfSApQP7zPw@cluster0.3kbubif.mongodb.net/TechBasket?appName=Cluster0";

const ingestLegacyData = async () => {
  try {
    console.log("Connecting to MongoDB for legacy ingestion...");
    await mongoose.connect(mongodbUri);
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Failed to access database");
    }

    console.log("Connected to MongoDB successfully!");

    // 1. Ingest catalog_items (Brands and Categories)
    const catalogItems = await db.collection("catalog_items").find().toArray();
    console.log(`Found ${catalogItems.length} items in 'catalog_items'. Ingesting...`);

    const brandMap = new Map<string, mongoose.Types.ObjectId>();
    const categoryMap = new Map<string, mongoose.Types.ObjectId>();

    for (const item of catalogItems) {
      const name = (item.name || item.normalizedName || "").trim();
      if (!name) continue;

      if (item.type === "brand") {
        const brand = await BrandModel.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${name}$`, "i") } },
          { $setOnInsert: { name, status: "ACTIVE" } },
          { upsert: true, new: true }
        );
        brandMap.set(name.toLowerCase(), brand._id as mongoose.Types.ObjectId);
        if (item.normalizedName) {
          brandMap.set(item.normalizedName.toLowerCase(), brand._id as mongoose.Types.ObjectId);
        }
      } else if (item.type === "category") {
        const category = await CategoryModel.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${name}$`, "i") } },
          { $setOnInsert: { name, status: "ACTIVE" } },
          { upsert: true, new: true }
        );
        categoryMap.set(name.toLowerCase(), category._id as mongoose.Types.ObjectId);
        if (item.normalizedName) {
          categoryMap.set(item.normalizedName.toLowerCase(), category._id as mongoose.Types.ObjectId);
        }
      }
    }

    // Default fallback brand & category if missing
    let defaultBrand = await BrandModel.findOne({ name: "Generic" });
    if (!defaultBrand) {
      defaultBrand = await BrandModel.create({ name: "Generic", status: "ACTIVE" });
    }
    let defaultCategory = await CategoryModel.findOne({ name: "General Electronics" });
    if (!defaultCategory) {
      defaultCategory = await CategoryModel.create({ name: "General Electronics", status: "ACTIVE" });
    }

    // 2. Ingest 92 products from 'TechBasket_all data'
    const legacyProducts = await db.collection("TechBasket_all data").find().toArray();
    console.log(`Found ${legacyProducts.length} items in 'TechBasket_all data'. Ingesting...`);

    let importedCount = 0;
    for (const item of legacyProducts) {
      const title = (item.productTitle || item.title || "Untitled Product").trim();
      const rawSku = (item.sku || `SKU-${item._id}`).trim();

      // Brand mapping
      let brandId: mongoose.Types.ObjectId | undefined;
      const brandKey = (item.brand || item.brandId || "").toLowerCase();
      if (brandMap.has(brandKey)) {
        brandId = brandMap.get(brandKey);
      } else if (item.brand) {
        const newBrand = await BrandModel.findOneAndUpdate(
          { name: item.brand.trim() },
          { $setOnInsert: { name: item.brand.trim(), status: "ACTIVE" } },
          { upsert: true, new: true }
        );
        brandId = newBrand._id as mongoose.Types.ObjectId;
        brandMap.set(brandKey, brandId);
      } else {
        brandId = defaultBrand._id as mongoose.Types.ObjectId;
      }

      // Category mapping
      let categoryId: mongoose.Types.ObjectId | undefined;
      const catKey = (item.category || item.categoryId || "").toLowerCase();
      if (categoryMap.has(catKey)) {
        categoryId = categoryMap.get(catKey);
      } else if (item.category) {
        const newCat = await CategoryModel.findOneAndUpdate(
          { name: item.category.trim() },
          { $setOnInsert: { name: item.category.trim(), status: "ACTIVE" } },
          { upsert: true, new: true }
        );
        categoryId = newCat._id as mongoose.Types.ObjectId;
        categoryMap.set(catKey, categoryId);
      } else {
        categoryId = defaultCategory._id as mongoose.Types.ObjectId;
      }

      // Warranty calculation
      let warrantyMonths = 12;
      if (item.warrantyPeriod) {
        const period = Number(item.warrantyPeriod);
        const unit = (item.warrantyUnit || "").toUpperCase();
        if (unit.includes("YEAR")) {
          warrantyMonths = period * 12;
        } else if (unit.includes("DAY")) {
          warrantyMonths = Math.round(period / 30);
        } else {
          warrantyMonths = period;
        }
      }

      // Upsert product
      await ProductModel.findOneAndUpdate(
        { sku: rawSku.toUpperCase() },
        {
          $set: {
            title,
            brand: brandId,
            category: categoryId,
            basePrice: item.basePrice || 100,
            costPrice: item.costPrice || 75,
            warrantyMonths,
            hasSerialNumber: true,
            description: item.description || (item.color ? `Color: ${item.color}` : undefined),
            status: item.status === "ACTIVE" ? "ACTIVE" : "DISCONTINUED",
          },
        },
        { upsert: true, new: true }
      );

      importedCount++;
    }

    console.log("==================================================");
    console.log(`LEGACY INGESTION FINISHED! Successfully processed ${importedCount} products into the catalog.`);
    console.log("==================================================");
    process.exit(0);
  } catch (error) {
    console.error("Ingestion failed:", error);
    process.exit(1);
  }
};

ingestLegacyData();
