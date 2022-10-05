import axios from 'axios';

export const requester = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL,
  withCredentials: true,
  headers: {
    // 'content-type': 'application-json',
  },
});

export function GreetingByTime() {
  const today = new Date()
  const hour = today.getHours()

  return hour < 12 ? 'Buenos días' : (hour < 18 ? 'Buenas tardes' : 'Buenas noches')
}
