'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

// api.interceptors.response.use(
//   (response) => response,
//   (err) => {
//     if (err.response?.status === 401) {
//       Cookies.remove('jwt');
//       Cookies.remove('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );

export default api;
