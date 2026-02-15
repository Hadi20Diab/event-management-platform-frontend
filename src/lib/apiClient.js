const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_APP_API_BASE_URL || "";

let _token = null;

export function setToken(token) {
  _token = token;
  try {
    if (typeof window !== "undefined") localStorage.setItem("token", token);
  } catch (e) {
    // ignore storage errors
  }
}

export function clearToken() {
  _token = null;
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  } catch (e) {}
}

export function getToken() {
  if (_token) return _token;
  try {
    if (typeof window !== "undefined") {
      _token = localStorage.getItem("token");
    }
  } catch (e) {}
  return _token;
}

async function request(path, opts = {}) {
  const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, Object.assign({}, opts, { headers }));

  let body = null;
  try {
    body = await res.json();
  } catch (e) {
    // not JSON
  }

  if (res.status === 401) {
    const err = new Error("Unauthorized");
    err.status = 401;
    err.data = body;
    throw err;
  }

  if (!res.ok) {
    const err = new Error(body?.message || "Request failed");
    err.status = res.status;
    err.data = body;
    throw err;
  }

  return body;
}

export async function get(path, opts) {
  return request(path, Object.assign({ method: "GET" }, opts));
}

export async function post(path, body, opts = {}) {
  return request(path, Object.assign({ method: "POST", body: JSON.stringify(body) }, opts));
}

export default {
  get,
  post,
  setToken,
  clearToken,
  getToken,
};
