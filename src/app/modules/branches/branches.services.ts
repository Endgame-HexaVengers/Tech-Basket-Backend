import type { IBranch } from "./branches.interface.js";
import { BranchModel } from "./branches.model.js";

const createBranch = async (payload: IBranch) => {
  return BranchModel.create(payload);
};

const getBranches = async (query: Record<string, any>) => {
  const { search, status, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { branchName: { $regex: search, $options: "i" } },
      { branchCode: { $regex: search, $options: "i" } },
      { "address.city": { $regex: search, $options: "i" } },
    ];
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [branches, total] = await Promise.all([
    BranchModel.find(filter)
      .populate("manager", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    BranchModel.countDocuments(filter),
  ]);

  return {
    branches,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getBranchById = async (id: string) => {
  return BranchModel.findById(id).populate("manager", "name email role");
};

const updateBranch = async (id: string, payload: Partial<IBranch>) => {
  return BranchModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("manager", "name email role");
};

const deleteBranch = async (id: string) => {
  return BranchModel.findByIdAndDelete(id);
};

export const BranchServices = {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
};
