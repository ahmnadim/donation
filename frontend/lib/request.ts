import { useSession } from "next-auth/react";

// utils/fetchClient.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const customFetch = async (url: string, options: any = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${options.token || ""}`,
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

const fetchClient = {
  get: (url: string, options = {}) =>
    customFetch(url, { method: "GET", ...options }),
  post: (url: string, body: any, options = {}) =>
    customFetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),
  put: (url: string, body: any, options = {}) =>
    customFetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),
  delete: (url: string, options = {}) =>
    customFetch(url, { method: "DELETE", ...options }),
};

export default fetchClient;
