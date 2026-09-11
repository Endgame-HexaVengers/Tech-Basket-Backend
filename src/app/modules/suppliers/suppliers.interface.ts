export interface ISupplier {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  status: "ACTIVE" | "INACTIVE";
}
