import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { BranchModel } from "../app/modules/branches/branches.model.js";
import { BrandModel } from "../app/modules/brands/brands.model.js";
import { CategoryModel } from "../app/modules/categories/categories.model.js";
import { BranchInventoryModel, SerialNumberModel } from "../app/modules/inventory/inventory.model.js";
import { ProductModel } from "../app/modules/products/products.model.js";
import { PurchaseModel } from "../app/modules/purchases/purchases.model.js";
import { RMAModel } from "../app/modules/rma/rma.model.js";
import { SaleModel } from "../app/modules/sales/sales.model.js";
import { SupplierModel } from "../app/modules/suppliers/suppliers.model.js";
import { UserModel } from "../app/modules/users/users.model.js";

dotenv.config();

const mongodbUri =
  process.env.MONGODB_URL ||
  "mongodb+srv://TechBasket:DGSiflfSApQP7zPw@cluster0.3kbubif.mongodb.net/?appName=Cluster0";

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(mongodbUri);
    console.log("Connected to MongoDB successfully!");

    // Clear existing collections
    console.log("Clearing existing data...");
    await Promise.all([
      BranchModel.deleteMany({}),
      UserModel.deleteMany({}),
      BrandModel.deleteMany({}),
      CategoryModel.deleteMany({}),
      SupplierModel.deleteMany({}),
      ProductModel.deleteMany({}),
      BranchInventoryModel.deleteMany({}),
      SerialNumberModel.deleteMany({}),
      PurchaseModel.deleteMany({}),
      SaleModel.deleteMany({}),
      RMAModel.deleteMany({}),
    ]);

    // 1. Create Branches
    console.log("Seeding Branches...");
    const branches = await BranchModel.create([
      {
        branchName: "Dhaka Central Hub",
        branchCode: "BR-DHK-01",
        address: {
          street: "Road 11, Block D, Banani",
          city: "Dhaka",
          state: "Dhaka Division",
          zip: "1213",
        },
        phone: "+880 1711-000001",
        status: "ACTIVE",
      },
      {
        branchName: "Chattogram Port Branch",
        branchCode: "BR-CTG-01",
        address: {
          street: "Agrabad Commercial Area",
          city: "Chattogram",
          state: "Chattogram Division",
          zip: "4100",
        },
        phone: "+880 1811-000002",
        status: "ACTIVE",
      },
    ]);

    const dhakaBranch = branches[0]!;
    const ctgBranch = branches[1]!;

    // 2. Create Users
    console.log("Seeding Users...");
    const defaultPassword = "Admin123!";
    const users = await UserModel.create([
      {
        name: "Ashikur Rahman (System Admin)",
        email: "admin@techbasket.com",
        password: defaultPassword,
        role: "ADMIN",
        branch: dhakaBranch._id,
        phone: "+880 1700-111222",
        status: "ACTIVE",
      },
      {
        name: "Rafiqul Islam",
        email: "manager.dhaka@techbasket.com",
        password: defaultPassword,
        role: "MANAGER",
        branch: dhakaBranch._id,
        phone: "+880 1700-333444",
        status: "ACTIVE",
      },
      {
        name: "Kamrul Hasan",
        email: "sales.dhaka@techbasket.com",
        password: defaultPassword,
        role: "SALES",
        branch: dhakaBranch._id,
        phone: "+880 1700-555666",
        status: "ACTIVE",
      },
      {
        name: "Nusrat Jahan",
        email: "support@techbasket.com",
        password: defaultPassword,
        role: "SUPPORT",
        branch: dhakaBranch._id,
        phone: "+880 1700-777888",
        status: "ACTIVE",
      },
    ]);

    const adminUser = users[0]!;
    const salesUser = users[2]!;
    const supportUser = users[3]!;

    // Link managers to branches
    await BranchModel.findByIdAndUpdate(dhakaBranch._id, { manager: users[1]!._id });

    // 3. Create Brands
    console.log("Seeding Brands...");
    const brands = await BrandModel.create([
      {
        name: "Apple",
        logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=128",
        description: "Premium consumer electronics and computers",
        status: "ACTIVE",
      },
      {
        name: "Dell Technologies",
        logo: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=128",
        description: "Enterprise workstations and XPS laptops",
        status: "ACTIVE",
      },
      {
        name: "ASUS ROG",
        logo: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=128",
        description: "Republic of Gamers top-tier hardware",
        status: "ACTIVE",
      },
      {
        name: "Logitech",
        logo: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=128",
        description: "High performance peripherals and accessories",
        status: "ACTIVE",
      },
    ]);

    // 4. Create Categories
    console.log("Seeding Categories...");
    const categories = await CategoryModel.create([
      { name: "Laptops & Notebooks", description: "Ultrabooks, workstations and gaming laptops", status: "ACTIVE" },
      { name: "Smartphones & Tablets", description: "iOS and Android mobile devices", status: "ACTIVE" },
      { name: "Computer Peripherals", description: "Mice, keyboards, headsets, monitors", status: "ACTIVE" },
      { name: "Networking Equipment", description: "Routers, access points, switches", status: "ACTIVE" },
    ]);

    // 5. Create Suppliers
    console.log("Seeding Suppliers...");
    const suppliers = await SupplierModel.create([
      {
        name: "Global Tech Imports Ltd",
        contactPerson: "Mr. Zahid Hossain",
        email: "supply@globaltech.com.bd",
        phone: "+880 1911-998877",
        address: "Motijheel C/A, Dhaka",
        status: "ACTIVE",
      },
      {
        name: "Silicon Matrix International",
        contactPerson: "Sarah Jenkins",
        email: "orders@siliconmatrix.sg",
        phone: "+65 6789-0123",
        address: "Jurong East, Singapore",
        status: "ACTIVE",
      },
    ]);

    // 6. Create Products
    console.log("Seeding Products...");
    const products = await ProductModel.create([
      {
        sku: "MBP16-M3M-01",
        title: "Apple MacBook Pro 16\" (M3 Max, 36GB, 1TB SSD) - Space Black",
        brand: brands[0]!._id,
        category: categories[0]!._id,
        basePrice: 3499,
        costPrice: 2850,
        warrantyMonths: 24,
        hasSerialNumber: true,
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
        description: "Liquid Retina XDR display, M3 Max chip with 14-core CPU and 30-core GPU.",
        status: "ACTIVE",
      },
      {
        sku: "DELL-XPS15-9530",
        title: "Dell XPS 15 9530 (Intel Core i9-13900H, RTX 4070, 32GB, 1TB)",
        brand: brands[1]!._id,
        category: categories[0]!._id,
        basePrice: 2399,
        costPrice: 1900,
        warrantyMonths: 24,
        hasSerialNumber: true,
        imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
        description: "3.5K OLED touchscreen with CNC machined aluminum and carbon fiber palm rest.",
        status: "ACTIVE",
      },
      {
        sku: "ROG-G16-2024",
        title: "ASUS ROG Zephyrus G16 OLED (Core Ultra 9, RTX 4080, 32GB)",
        brand: brands[2]!._id,
        category: categories[0]!._id,
        basePrice: 2699,
        costPrice: 2150,
        warrantyMonths: 24,
        hasSerialNumber: true,
        imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
        description: "2.5K 240Hz ROG Nebula OLED display with CNC aluminum unibody.",
        status: "ACTIVE",
      },
      {
        sku: "IPH15PM-256-NT",
        title: "Apple iPhone 15 Pro Max 256GB - Natural Titanium",
        brand: brands[0]!._id,
        category: categories[1]!._id,
        basePrice: 1199,
        costPrice: 950,
        warrantyMonths: 12,
        hasSerialNumber: true,
        imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
        description: "A17 Pro chip, Titanium design, 5x Telephoto camera, Action button.",
        status: "ACTIVE",
      },
      {
        sku: "LOGI-MXM3S-GR",
        title: "Logitech MX Master 3S Wireless Performance Mouse - Graphite",
        brand: brands[3]!._id,
        category: categories[2]!._id,
        basePrice: 99,
        costPrice: 65,
        warrantyMonths: 12,
        hasSerialNumber: true,
        imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800",
        description: "8K DPI track-on-glass sensor, Quiet Clicks, MagSpeed electromagnetic scroll.",
        status: "ACTIVE",
      },
    ]);

    const macbook = products[0]!;
    const dellXps = products[1]!;
    const iphone = products[3]!;
    const mouse = products[4]!;

    // 7. Seed Purchases (Inflow from Suppliers)
    console.log("Seeding Purchases & Stock Inflow...");
    const macbookSerials = ["SN-MBP-9001", "SN-MBP-9002", "SN-MBP-9003", "SN-MBP-9004", "SN-MBP-9005"];
    const dellSerials = ["SN-XPS-8001", "SN-XPS-8002", "SN-XPS-8003", "SN-XPS-8004"];
    const iphoneSerials = ["SN-IPH-7001", "SN-IPH-7002", "SN-IPH-7003", "SN-IPH-7004", "SN-IPH-7005", "SN-IPH-7006"];

    const purchase1 = await PurchaseModel.create({
      purchaseNumber: "PO-20260901-0001",
      supplier: suppliers[0]!._id,
      branch: dhakaBranch._id,
      items: [
        {
          product: macbook._id,
          quantity: 5,
          unitCost: macbook.costPrice || 2850,
          serialNumbers: macbookSerials,
          subtotal: 5 * (macbook.costPrice || 2850),
        },
        {
          product: dellXps._id,
          quantity: 4,
          unitCost: dellXps.costPrice || 1900,
          serialNumbers: dellSerials,
          subtotal: 4 * (dellXps.costPrice || 1900),
        },
      ],
      totalAmount: 5 * (macbook.costPrice || 2850) + 4 * (dellXps.costPrice || 1900),
      paymentStatus: "PAID",
      receivedBy: adminUser._id,
      purchaseDate: new Date("2026-09-01"),
      status: "RECEIVED",
    });

    const purchase2 = await PurchaseModel.create({
      purchaseNumber: "PO-20260905-0002",
      supplier: suppliers[1]!._id,
      branch: dhakaBranch._id,
      items: [
        {
          product: iphone._id,
          quantity: 6,
          unitCost: iphone.costPrice || 950,
          serialNumbers: iphoneSerials,
          subtotal: 6 * (iphone.costPrice || 950),
        },
        {
          product: mouse._id,
          quantity: 20,
          unitCost: mouse.costPrice || 65,
          subtotal: 20 * (mouse.costPrice || 65),
        },
      ],
      totalAmount: 6 * (iphone.costPrice || 950) + 20 * (mouse.costPrice || 65),
      paymentStatus: "PAID",
      receivedBy: adminUser._id,
      purchaseDate: new Date("2026-09-05"),
      status: "RECEIVED",
    });

    // 8. Seed Branch Inventory records
    console.log("Seeding Branch Inventories...");
    await BranchInventoryModel.create([
      {
        product: macbook._id,
        branch: dhakaBranch._id,
        quantity: 5,
        availableQuantity: 4, // 1 sold
        reservedQuantity: 0,
        damagedQuantity: 0,
        reorderLevel: 2,
      },
      {
        product: dellXps._id,
        branch: dhakaBranch._id,
        quantity: 4,
        availableQuantity: 4,
        reservedQuantity: 0,
        damagedQuantity: 0,
        reorderLevel: 2,
      },
      {
        product: iphone._id,
        branch: dhakaBranch._id,
        quantity: 6,
        availableQuantity: 5, // 1 sold
        reservedQuantity: 0,
        damagedQuantity: 0,
        reorderLevel: 3,
      },
      {
        product: mouse._id,
        branch: dhakaBranch._id,
        quantity: 20,
        availableQuantity: 18, // 2 sold
        reservedQuantity: 0,
        damagedQuantity: 0,
        reorderLevel: 5,
      },
    ]);

    // 9. Seed Serial Numbers
    console.log("Seeding Serial Numbers...");
    const serialDocs = [
      ...macbookSerials.map((s, idx) => ({
        serialNumber: s,
        product: macbook._id,
        branch: dhakaBranch._id,
        purchase: purchase1._id,
        status: idx === 0 ? ("RMA" as const) : ("AVAILABLE" as const),
      })),
      ...dellSerials.map((s) => ({
        serialNumber: s,
        product: dellXps._id,
        branch: dhakaBranch._id,
        purchase: purchase1._id,
        status: "AVAILABLE" as const,
      })),
      ...iphoneSerials.map((s, idx) => ({
        serialNumber: s,
        product: iphone._id,
        branch: dhakaBranch._id,
        purchase: purchase2._id,
        status: idx === 0 ? ("SOLD" as const) : ("AVAILABLE" as const),
      })),
    ];
    await SerialNumberModel.insertMany(serialDocs);

    // 10. Seed Sales Transactions
    console.log("Seeding Sales...");
    const sale1 = await SaleModel.create({
      invoiceNumber: "INV-20260907-00001",
      branch: dhakaBranch._id,
      customer: {
        name: "Tanvir Ahmed",
        phone: "+880 1712-345678",
        email: "tanvir.ahmed@example.com",
        address: "Dhanmondi 27, Dhaka",
      },
      items: [
        {
          product: macbook._id,
          serialNumber: "SN-MBP-9001",
          quantity: 1,
          unitPrice: 3499,
          discount: 100,
          total: 3399,
        },
      ],
      subtotal: 3499,
      discount: 100,
      tax: 0,
      total: 3399,
      paymentMethod: "CARD",
      paymentStatus: "PAID",
      soldBy: salesUser._id,
      saleDate: new Date("2026-09-07"),
      status: "COMPLETED",
    });

    // Update serial for sale 1
    await SerialNumberModel.findOneAndUpdate({ serialNumber: "SN-MBP-9001" }, { sale: sale1._id });

    const sale2 = await SaleModel.create({
      invoiceNumber: "INV-20260909-00002",
      branch: dhakaBranch._id,
      customer: {
        name: "Sadia Sultana",
        phone: "+880 1819-876543",
        email: "sadia.s@example.com",
        address: "Gulshan 1, Dhaka",
      },
      items: [
        {
          product: iphone._id,
          serialNumber: "SN-IPH-7001",
          quantity: 1,
          unitPrice: 1199,
          discount: 0,
          total: 1199,
        },
        {
          product: mouse._id,
          quantity: 2,
          unitPrice: 99,
          discount: 10,
          total: 188,
        },
      ],
      subtotal: 1397,
      discount: 10,
      tax: 0,
      total: 1387,
      paymentMethod: "MFS",
      paymentStatus: "PAID",
      soldBy: salesUser._id,
      saleDate: new Date("2026-09-09"),
      status: "COMPLETED",
    });

    await SerialNumberModel.findOneAndUpdate({ serialNumber: "SN-IPH-7001" }, { sale: sale2._id });

    // 11. Seed RMA Ticket originating from Sale 1
    console.log("Seeding RMA Tickets...");
    await RMAModel.create({
      rmaNumber: "RMA-20260910-0001",
      sale: sale1._id,
      branch: dhakaBranch._id,
      product: macbook._id,
      serialNumber: "SN-MBP-9001",
      customer: {
        name: "Tanvir Ahmed",
        phone: "+880 1712-345678",
        email: "tanvir.ahmed@example.com",
      },
      issue: "Display flickering intermittently under heavy GPU load",
      description: "Customer reports screen blackouts during video rendering tasks in Final Cut Pro.",
      receivedDate: new Date("2026-09-10"),
      status: "DIAGNOSING",
      technician: supportUser._id,
      diagnosis: "Testing display ribbon cable and GPU thermal throttling under benchmarking.",
    });

    console.log("==================================================");
    console.log("DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("Default Seed Users:");
    console.log(" - Admin: admin@techbasket.com (Password: Admin123!)");
    console.log(" - Manager: manager.dhaka@techbasket.com (Password: Admin123!)");
    console.log(" - Sales: sales.dhaka@techbasket.com (Password: Admin123!)");
    console.log(" - Support: support@techbasket.com (Password: Admin123!)");
    console.log("==================================================");

    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
