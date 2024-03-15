"use client";

const JWT = "jwt";

export const setToken = (token: string) => {
  sessionStorage.setItem(JWT, token);
};
export const getToken = () =>{
  return sessionStorage.getItem(JWT);
};
export const removeToken = () => sessionStorage.removeItem(JWT);
export const isLoggedIn = () => !!getToken();
