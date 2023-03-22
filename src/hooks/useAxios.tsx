import axios from 'axios';


// Config timeout
let timeout = Number.parseInt(process.env.NEXT_PUBLIC_APP_AXIOS_TIMEOUT)
if (!Number.isInteger(timeout)) {
  timeout = 5000
}

export const useAxios = () => {
  const requester = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL,
    withCredentials: true,
    headers: {
      'content-type': 'application/json',
    },
    timeout
  });

  return { requester };
};
