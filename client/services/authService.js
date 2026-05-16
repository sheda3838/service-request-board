import API from "@/lib/api";

export const registerUser = (userData) =>
  API.post("/auth/register", userData);

export const loginUser = (credentials) =>
  API.post("/auth/login", credentials);
