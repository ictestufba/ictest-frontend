import axios from "axios";
import { getToken, removeToken, setToken } from "./auth";

type Session = {
  token: string;
};

const refreshTokenFn = async () => {
  const currentToken = getToken();

  if (!currentToken) return;

  try {
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
    removeToken();
  }
};

const api = axios.create({
  baseURL: "https://ictest-backend.fly.dev/",
  headers: {
    "content-type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  config.headers.authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;

    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;

      const token = await refreshTokenFn();

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
