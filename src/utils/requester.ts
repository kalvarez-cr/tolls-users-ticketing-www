import axios from 'axios';

export const requester = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL,
  withCredentials: true,
  headers: {
    // 'content-type': 'application-json',
  },
});
