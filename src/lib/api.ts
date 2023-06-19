import axios from "axios";
import { getToken, removeToken, setToken } from "./auth";
import { Session } from "@/types/models";

const refreshTokenFn = async () => {
  const currentToken = getToken();

  if (!currentToken) {
    window.location.href = "/login";
    return;
  }

  try {
    console.log("try");

    const response = await api.post<Session>("/user/refresh", {
      refreshToken: currentToken,
    });

    const { token } = response.data;

    if (!token) {
      removeToken();
    }

    setToken(token);

    return token;
  } catch (error) {
    console.error(error);
    removeToken();
  }
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "content-type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  config.headers.authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;

    console.log({ error, status: error?.response?.status });

    if (error?.response?.status === 401) {
      // config.sent = true;
      // config.sent = false;

      console.log("a");

      const token = await refreshTokenFn();

      console.log({ token });

      if (token) {
        config.headers = {
          ...config.headers,
          authorization: `Bearer ${token}`,
        };
      }

      return axios(config);
    }
    return Promise.reject(error);
  }
);

export { api };
