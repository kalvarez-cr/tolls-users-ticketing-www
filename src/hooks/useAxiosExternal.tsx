import axios from 'axios';

// const baseUrl = 'http://api.user-toll-qa.local:10088/api/';

export const useAxiosExternal = () => {
  const requester = axios.create({
    baseURL: '',
    withCredentials: true,
    headers: {
      'content-type': 'application/json',
      Authorization: 'Basic NzI4ODIzNTA6MTIzNDU2Nzg=',
      username: '72721675',
      password: 'vpDkn9T1',
    },
  });

  return { requester };
};
