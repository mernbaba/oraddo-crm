import api from '../api';

export interface EmpNote {
  id: number;
  title: string | null;
  notes: string;
  tags: string[];
  color: string | null;
  isedited?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNotePayload {
  title: string | null;
  notes: string;
  tags?: string[];
  color?: string | null;
  isedited?: boolean;
  // The server's notesService.createEmpNote reads `employeeId` from the
  // payload to seed a SharedNotes row. We forward it so the note is properly
  // owned by / shared with the current employee when available.
  employeeId?: number;
  sharedByEmployeeId?: number;
}

export const notesService = {
  // Create a new employee note
  createNote: (payload: CreateNotePayload) => {
    return api.post('/api/empNotes', payload);
  },

  // Get all employee notes
  getAllNotes: (page?: number, limit?: number) => {
    const params: Record<string, string | number> = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    return api.get('/api/empNotes', { params });
  },

  // Get notes for a specific employee (the server filters by employeeId)
  getNotesByEmployee: (employeeId: number) => {
    return api.get(`/api/empNotes/${employeeId}`);
  },

  // Update an existing note
  updateNote: (id: number, payload: Partial<CreateNotePayload>) => {
    return api.put(`/api/empNotes/${id}`, { ...payload, isedited: true });
  },

  // Delete a note
  deleteNote: (id: number) => {
    return api.delete(`/api/empNotes/${id}`);
  },
};
