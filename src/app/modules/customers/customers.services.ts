import type { ICustomer } from "./customers.interface.js";
import { CustomerModel } from "./customers.model.js";

const createCustomer = async (payload: ICustomer) => {
  return CustomerModel.create(payload);
};

const getCustomers = async (query: Record<string, any>) => {
  const { search, customerType, status, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (customerType) filter.customerType = customerType;
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [customers, total] = await Promise.all([
    CustomerModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    CustomerModel.countDocuments(filter),
  ]);

  return {
    customers,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getCustomerById = async (id: string) => {
  return CustomerModel.findById(id);
};

const getCustomerByPhone = async (phone: string) => {
  return CustomerModel.findOne({ phone });
};

const updateCustomer = async (id: string, payload: Partial<ICustomer>) => {
  return CustomerModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteCustomer = async (id: string) => {
  return CustomerModel.findByIdAndDelete(id);
};

export const CustomerServices = {
  createCustomer,
  getCustomers,
  getCustomerById,
  getCustomerByPhone,
  updateCustomer,
  deleteCustomer,
};
