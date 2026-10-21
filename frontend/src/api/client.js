export class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(path, { method = "GET", body, token, formData, raw } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  let options = { method, headers };

  if (formData) {
    options.body = formData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  } else if (raw !== undefined) {
    headers["Content-Type"] = "text/plain;charset=utf-8";
    options.body = raw;
  }

  let res;
  try {
    const url = path.startsWith("/api") ? path : `/api${path}`;
    res = await fetch(url, options);
  } catch {
    throw new ApiError(0, "Can't reach the server. Is it running on port 4000?");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok) {
    throw new ApiError(res.status, data?.message || `Request failed (${res.status})`, data);
  }

  return data ?? {};
}

export const api = {
  get: (path, token) => request(path, { token }),
  post: (path, body, token) => request(path, { method: "POST", body, token }),
  postForm: (path, formData, token) => request(path, { method: "POST", token, formData }),
  patch: (path, body, token) => request(path, { method: "PATCH", body, token }),
  del: (path, token) => request(path, { method: "DELETE", token })
};