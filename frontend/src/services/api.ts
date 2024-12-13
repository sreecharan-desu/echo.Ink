import axios from 'axios';

const BASE_URL = 'https://echoink-api.vercel.app/';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  signin: async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post('/signin', { username, password });
      return response.data;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  },

  signup: async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post('/signup', { username, password });
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  createPost: async (token: string, title: string, data: string, tags: string[]) => {
    try {
      const response = await axiosInstance.post('/post', 
        { title, data, tags },
        { headers: { Authorization: token } }
      );
      return response.data;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  },

  getUserProfile: async () => {
    try {
      const response = await axiosInstance.get(`/me`, { headers: { Authorization: localStorage.getItem('token')} });
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      return {
        success: false, 
        error: 'Failed to fetch user profile'
      };
    }
  },

  getUserPosts: async (username: string, token?: string) => {
    try {
      const headers = token ? { Authorization: token } : {};
      const response = await axiosInstance.post('/posts', { username }, { headers });
      return response.data;
    } catch (error) {
      console.error('Get user posts error:', error);
      return {
        success: false,
        posts: []
      };
    }
  },

  getPosts: async (token?: string) => {
    try {
      const headers = token ? { Authorization: token } : {};
      const response = await axiosInstance.get('/posts', { headers });
      return response.data;
    } catch (error) {
      console.error('Get posts error:', error);
      throw error;
    }
  },

  getPost: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/post/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get post error:', error);
      throw error;
    }
  },

  updatePost: async (id: string, token: string, title: string, data: string) => {
    try {
      const response = await axiosInstance.put(
        `/post/${id}`,
        { title, data },
        { headers: { Authorization: token } }
      );
      return response.data;
    } catch (error) {
      console.error('Update post error:', error);
      throw error;
    }
  },

  deletePost: async (id: string, token: string) => {
    try {
      const response = await axiosInstance.delete(
        `/post/${id}`,
        { headers: { Authorization: token } }
      );
      return response.data;
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  },  

  getAuthorProfile: async (username: string) => {
    try {
      const response = await axiosInstance.post(`/profile/${username}`, { username });
      return response.data;
    } catch (error) {
      console.error('Get author profile error:', error);
      return {
        success: false,
        error: 'Failed to fetch author profile'
      };
    }
  }
};



