import { BranchInventoryModel, SerialNumberModel } from "./inventory.model.js";

const getInventory = async (query: Record<string, any>) => {
  const { branch, product, lowStock, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (branch) filter.branch = branch;
  if (product) filter.product = product;

  if (lowStock === "true") {
    filter.$expr = { $lte: ["$availableQuantity", "$reorderLevel"] };
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [inventory, total] = await Promise.all([
    BranchInventoryModel.find(filter)
      .populate("product")
      .populate("branch", "branchName branchCode")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    BranchInventoryModel.countDocuments(filter),
  ]);

  return {
    inventory,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getInventoryById = async (id: string) => {
  return BranchInventoryModel.findById(id)
    .populate("product")
    .populate("branch", "branchName branchCode");
};

const updateInventory = async (id: string, payload: Record<string, any>) => {
  return BranchInventoryModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate("product")
    .populate("branch", "branchName branchCode");
};

const getSerialNumbers = async (query: Record<string, any>) => {
  const { serialNumber, product, branch, status, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (serialNumber) filter.serialNumber = { $regex: serialNumber, $options: "i" };
  if (product) filter.product = product;
  if (branch) filter.branch = branch;
  if (status) filter.status = status;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [serials, total] = await Promise.all([
    SerialNumberModel.find(filter)
      .populate("product", "title sku imageUrl basePrice")
      .populate("branch", "branchName branchCode")
      .populate("purchase", "purchaseNumber purchaseDate")
      .populate("sale", "invoiceNumber saleDate")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    SerialNumberModel.countDocuments(filter),
  ]);

  return {
    serials,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getSerialNumberByCode = async (code: string) => {
  return SerialNumberModel.findOne({ serialNumber: code.toUpperCase() })
    .populate("product")
    .populate("branch", "branchName branchCode")
    .populate("purchase")
    .populate("sale");
};

export const InventoryServices = {
  getInventory,
  getInventoryById,
  updateInventory,
  getSerialNumbers,
  getSerialNumberByCode,
};
