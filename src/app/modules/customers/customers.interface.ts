export type CustomerType = "RETAIL" | "WHOLESALE" | "CORPORATE";

export interface ICustomer {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  customerType: CustomerType;
  notes?: string;
  status: "ACTIVE" | "INACTIVE";
}
