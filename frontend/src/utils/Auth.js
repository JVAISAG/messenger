'use client';

import { useContext, createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';
import Cookie from 'js-cookie';
import socket from './socket';
import { getPrivateKey } from '@/utils/db';
import { decryptWithPassword } from '@/utils/encryption';
// import api from '@/utils/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken_] = useState('');
  const [error, setError] = useState({});
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState({});
  // const [privateKey, setPrivateKey] = useState('');
  const [keys, setKeys] = useState('');

  const router = useRouter();

  const setToken = (token) => {
    try {
      console.log('set Token');
      localStorage.setItem('jwt', token);
      setToken_(token);
    } catch (err) {
      console.error(err);
    }
  };

  const signUp = async (userData) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/user/signup',
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log(res);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      return res;
    } catch (err) {
      console.log(err);
      return err;
    }
  };
  const checkAuth = async () => {
    try {
      const res = await api.get('/user/checkauth');
      console.log('res:', res);
      if (res.status === 401) {
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      setError(err);
    }
  };

  const login = async (values) => {
    try {
      const data = { ...values };

      const res = await api.post('/user/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const currentUser = res.data.data.user;
      // socket.emit('login-public-key', { encodedPublicKey });

      setUser(res.data.data.user);
      setToken(res.data.accessToken);

      const response = await api.get(`message/publickey/${currentUser._id}`);
      const key = response.data.key;
      setKeys(key);
      // console.log('keys:', key);

      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      setIsAuthed(true);

      return res;
    } catch (err) {
      console.log(err);
      setError(err);
    }
  };

  const logout = async () => {
    try {
      await checkAuth();

      localStorage.removeItem('jwt');
      localStorage.removeItem('user');

      Cookie.remove('jwt');
      setIsAuthed(false);

      router.push('/login');
    } catch (err) {
      setIsAuthed(false);
      setError(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        setToken_,
        isAuthed: isAuthed,
        login: login,
        logout: logout,
        error: error,
        checkAuth,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
