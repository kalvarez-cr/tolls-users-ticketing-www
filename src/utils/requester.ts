import axios from 'axios';

const baseUrl = 'http://api.user-toll-qa.local:10088/api/';

export const requester = axios.create({
  withCredentials: true,
  baseURL: baseUrl,
  headers: {
    // 'content-type': 'aplication-json',
  },
});
