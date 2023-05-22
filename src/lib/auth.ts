const JWT = "jwt";

export const setToken = (token: string) => {
  sessionStorage.setItem(JWT, token);
};
export const getToken = () => sessionStorage.getItem(JWT);
export const removeToken = () => sessionStorage.removeItem(JWT);
export const isLoggedIn = () => !!getToken();
