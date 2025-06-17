'use client';

import { useContext, createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken_] = useState('');
  const [error, setError] = useState({});
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState({});

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

  const checkAuth = async () => {
    try {
      const res = await axios.get('http://localhost:5000/checkauth', {
        withCredentials: true,
      });
    } catch (err) {
      setError(err);
    }
  };

  const login = async (values) => {
    try {
      const data = { ...values };
      console.log('auth: ', data);

      const res = await axios.post('http://localhost:5000/user/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('this is after res');
      setUser(res.data.data.user);
      setToken(res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      setIsAuthed(true);

      return res;
    } catch (err) {
      setError(err);
    }
  };

  const logout = async () => {
    try {
      await checkAuth();
      localStorage.removeItem('jwt');
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
