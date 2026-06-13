import api from '../api';

export interface Candidate {
  id: number;
  candidate_name: string;
  phone_number?: string;
  email_address?: string;
  college_name?: string;
  job_type?: 'Technical' | 'NonTechnical';
  marks?: number;
  status?: 'Qualified' | 'DisQualified' | null;
  taskLink?: string;
  techround?: 'Pending' | 'Qualified' | 'DisQualified' | null;
  finalround?: 'Pending' | 'Qualified' | 'DisQualified' | null;
  createdAt?: string;
}

export const candidateService = {
  getAll: () => api.get<Candidate[]>('/api/createCandidate'),
};
