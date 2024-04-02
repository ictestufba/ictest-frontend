"use client";

const JWT = "jwt";

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    return sessionStorage.setItem(JWT, token);
  }
};
export const getToken = () =>{
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(JWT);
  }
};
export const removeToken = () => sessionStorage.removeItem(JWT);
export const isLoggedIn = () => !!getToken();
