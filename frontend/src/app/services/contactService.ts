import api from "../api";

// Real PostgreSQL model: ContactDetails
// Fields: Name, Email, Phone, Message, CompanyName (capitalised), status ENUM
export interface ApiContact {
  id: number;
  Name?: string;
  Email?: string;
  Phone?: string;
  Message?: string;
  CompanyName?: string;
  status?: "Converted" | "Dead" | "Processing";
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export const contactService = {
  getAll: () => api.get<ApiContact[]>("/api/ContactForm"),
  getById: (id: number) => api.get<ApiContact>(`/api/ContactForm/${id}`),
  update: (id: number, data: Partial<ApiContact>) =>
    api.put<ApiContact>(`/api/ContactForm/${id}`, data),
  delete: (id: number) => api.delete(`/api/ContactForm/${id}`),
};
