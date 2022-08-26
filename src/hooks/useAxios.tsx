import axios from 'axios';

const baseUrl = 'http://api.user-toll-qa.local:10088/api/';

export const useAxios = () => {
  const requester = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
      'content-type': 'application/json',
    },
  });

  return { requester };
};
