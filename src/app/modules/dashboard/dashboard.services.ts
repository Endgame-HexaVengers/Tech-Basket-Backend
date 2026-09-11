import { BranchModel } from "../branches/branches.model.js";
import { BranchInventoryModel } from "../inventory/inventory.model.js";
import { ProductModel } from "../products/products.model.js";
import { RMAModel } from "../rma/rma.model.js";
import { SaleModel } from "../sales/sales.model.js";
import { UserModel } from "../users/users.model.js";

const getDashboardStats = async (branchId?: string) => {
  const branchFilter: Record<string, any> = branchId ? { branch: branchId } : {};

  // Time boundaries
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Parallel aggregations
  const [
    totalProducts,
    totalUsers,
    totalBranches,
    salesAggregation,
    todaySalesAggregation,
    monthSalesAggregation,
    rmaStats,
    lowStockCount,
    recentSales,
    recentRMAs,
  ] = await Promise.all([
    ProductModel.countDocuments({ status: "ACTIVE" }),
    UserModel.countDocuments({ status: "ACTIVE" }),
    BranchModel.countDocuments({ status: "ACTIVE" }),

    // Lifetime Sales & Revenue
    SaleModel.aggregate([
      { $match: { ...branchFilter, status: "COMPLETED" } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$total" },
        },
      },
    ]),

    // Today's Sales
    SaleModel.aggregate([
      {
        $match: {
          ...branchFilter,
          status: "COMPLETED",
          saleDate: { $gte: todayStart },
        },
      },
      {
        $group: {
          _id: null,
          todaySales: { $sum: 1 },
          todayRevenue: { $sum: "$total" },
        },
      },
    ]),

    // Monthly Sales
    SaleModel.aggregate([
      {
        $match: {
          ...branchFilter,
          status: "COMPLETED",
          saleDate: { $gte: monthStart },
        },
      },
      {
        $group: {
          _id: null,
          monthSales: { $sum: 1 },
          monthRevenue: { $sum: "$total" },
        },
      },
    ]),

    // RMA counts
    RMAModel.aggregate([
      { $match: branchFilter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),

    // Low stock count
    BranchInventoryModel.countDocuments({
      ...branchFilter,
      $expr: { $lte: ["$availableQuantity", "$reorderLevel"] },
    }),

    // Recent 5 sales
    SaleModel.find(branchFilter)
      .populate("branch", "branchName branchCode")
      .populate("soldBy", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    // Recent 5 RMAs
    RMAModel.find(branchFilter)
      .populate("product", "title sku")
      .populate("branch", "branchName")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const lifetime = salesAggregation[0] || { totalSales: 0, totalRevenue: 0 };
  const today = todaySalesAggregation[0] || { todaySales: 0, todayRevenue: 0 };
  const month = monthSalesAggregation[0] || { monthSales: 0, monthRevenue: 0 };

  const rmaSummary = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  };

  for (const item of rmaStats) {
    rmaSummary.total += item.count;
    if (["REQUESTED", "RECEIVED"].includes(item._id)) {
      rmaSummary.pending += item.count;
    } else if (["DIAGNOSING", "REPAIRING", "READY"].includes(item._id)) {
      rmaSummary.inProgress += item.count;
    } else if (item._id === "COMPLETED") {
      rmaSummary.completed += item.count;
    }
  }

  return {
    overview: {
      totalProducts,
      totalUsers,
      totalBranches,
      totalSales: lifetime.totalSales,
      totalRevenue: lifetime.totalRevenue,
      todaySales: today.todaySales,
      todayRevenue: today.todayRevenue,
      monthSales: month.monthSales,
      monthRevenue: month.monthRevenue,
      lowStockCount,
      rmaSummary,
    },
    recentSales,
    recentRMAs,
  };
};

export const DashboardServices = {
  getDashboardStats,
};
