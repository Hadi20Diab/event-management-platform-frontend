const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/api`;

export const getToken = () => {
  // Token is now stored in httpOnly cookie, not accessible from JS
  return null;
};

export const apiRequest = async (endpoint, method = "GET", body) => {
  const headers = {
    "Content-Type": "application/json",
  };

  // No need to manually add Authorization header - cookies are sent automatically
  // Kept for backward compatibility if needed
  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
    credentials: 'include', // Include cookies in requests
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};
