export interface User {
  id: string;
  username: string;
  email?: string;
  created_at?: string;
}

export interface Post {
  id: string;
  title: string;
  data: string;
  posted_on: string;
  author?: User;
  tags?: string[];
}

export interface AuthResponse {
  token: string;
  success: boolean;
} 