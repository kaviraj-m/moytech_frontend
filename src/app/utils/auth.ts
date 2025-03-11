import { deleteCookie, getCookie, setCookie } from 'cookies-next';

export interface User {
  id: number;
  username: string;
  name: string;
}

export const login = async (username: string, password: string): Promise<User> => {
  const response = await fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const user = await response.json();
  
  // Store user in localStorage and cookies
  localStorage.setItem('user', JSON.stringify(user));
  setCookie('user', JSON.stringify(user), {
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  return user;
};

export const logout = () => {
  localStorage.removeItem('user');
  deleteCookie('user');
  window.location.href = '/login';
};

export const getUser = (): User | null => {
  try {
    const userCookie = getCookie('user');
    if (!userCookie) return null;
    return JSON.parse(userCookie as string);
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getUser();
};