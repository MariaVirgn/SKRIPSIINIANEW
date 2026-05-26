const BASE_URL = "http://localhost:5000";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  console.log(res);

  if(res.status == 401){
    localStorage.removeItem("token");
    throw new Error("Unauthorized");
  }

  return res.json();
};