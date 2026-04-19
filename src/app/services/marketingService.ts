import api from "../api";

export interface MarketingEvent {
  id: number;
  title: string;
  description?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  occasion: "Meeting" | "Event" | "Campaign" | "Post";
  status?: string;
  location?: string;
  meetingType?: "In-Person" | "Virtual" | "Hybrid";
  attendees?: string; // Stored as comma-separated or string in backend
  organizer?: string;
  organizationID?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarketingStrategy {
  id: number;
  strategy: string;      // maps to UI 'title'
  explanation: string;   // maps to UI 'description'
  work_progress: string; // maps to UI 'progress' (percentage string/number)
  status: string;        // maps to UI 'status' (Active/Planning/Completed)
  requirements?: string; // maps to UI 'objectives'
  date?: string;         // maps to UI 'startDate'
  module?: string;
  task_assignment?: string;
  organizationID?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogData {
  id: number;
  title: string;
  description: string;   // maps to UI 'excerpt' and 'content'
  publishDate: string;   // maps to UI 'date'
  imageUrl?: string;
  name?: string;         // maps to UI 'author'
  CompanyName?: string;  // maps to UI 'category'
  Email?: string;
  Phone?: string;
  comments?: string;
  views?: number;
  status?: string;
  organizationID?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const marketingService = {
  // Get all marketing meetings/events for an organization
  getByOrg: (orgId: number) => {
    return api.get<MarketingEvent[]>(`/api/marketingMeetingbyorganization/${orgId}`);
  },

  // Get single event
  getById: (id: number) => {
    return api.get<MarketingEvent>(`/api/marketingMeeting/${id}`);
  },

  // Create new event
  create: (data: Partial<MarketingEvent>) => {
    return api.post<MarketingEvent>("/api/createMarketingMeetings", data);
  },

  // Update event
  update: (id: number, data: Partial<MarketingEvent>) => {
    return api.put<MarketingEvent>(`/api/marketingMeeting/${id}`, data);
  },

  // Delete event
  delete: (id: number) => {
    return api.delete(`/api/marketingMeeting/${id}`);
  },

  // --- Marketing Strategies ---

  // Get all strategies for an organization
  getStrategies: (orgId: number, page: number = 0, pageSize: number = 20) => {
    return api.get<{ strategy: MarketingStrategy[], totalStrategies: number }>(
      `/api/marketing-strategiesbyorganization/${orgId}`, 
      { params: { page, pageSize } }
    );
  },

  // Create new strategy
  createStrategy: (data: Partial<MarketingStrategy>) => {
    return api.post<MarketingStrategy>("/api/marketing-strategies", data);
  },

  // Update strategy
  updateStrategy: (id: number, data: Partial<MarketingStrategy>) => {
    return api.put<MarketingStrategy>(`/api/marketing-strategies/${id}`, data);
  },

  // Delete strategy
  deleteStrategy: (id: number) => {
    return api.delete(`/api/marketing-strategies/${id}`);
  },

  // --- Blogs ---

  // Get blogs for organization
  getBlogs: (orgId: number) => {
    return api.get<BlogData[]>(`/api/blogsCreationByorganisation/${orgId}`);
  },

  // Create blog
  createBlog: (data: Partial<BlogData>) => {
    return api.post<BlogData>("/api/blogsCreation", data);
  },

  // Update blog
  updateBlog: (id: number, data: Partial<BlogData>) => {
    return api.put<BlogData>(`/api/updateBlogData/${id}`, data);
  },

  // Delete blog
  deleteBlog: (id: number) => {
    return api.delete(`/api/blogDelete/${id}`);
  },

  // Increment view
  incrementBlogViews: (id: number) => {
    return api.post(`/api/postView/${id}`);
  }
};
