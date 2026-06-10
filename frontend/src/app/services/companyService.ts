import api from "../api";

// Real PostgreSQL model: Organization (served by /api/companies/*).
// This is the tenant company itself (logo, address, bank details) — distinct
// from orgService.ts, which manages signup/lead records (/api/orgRegister).
export interface ApiCompany {
  id: number;
  companyName: string;
  companyLogo?: string | null;
  companyAddress?: string;
  phoneNumber?: string;
  email?: string;
  companyWebsite?: string;
  GSTIN?: string;
  accountNumber?: string;
  bankName?: string;
  IFSC_Code?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export const companyService = {
  getById: (id: number) => api.get<ApiCompany>(`/api/companies/${id}`),

  // Multipart update. The backend (PUT /api/companies/:id) parses files with
  // formidable and only applies the update when a file is present, so callers
  // must send a FormData that includes the logo file (any field name works;
  // we use `companyLogo`). The multipart header matches the rest of the app
  // (chatService) — axios resets it so the browser adds the boundary.
  update: (id: number, form: FormData) =>
    api.put<ApiCompany>(`/api/companies/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
