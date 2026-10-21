const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

function getToken() {
  return localStorage.getItem("hostel_token") || "";
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const errorMsg = data?.message || "Request failed with status " + response.status;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  student: {
    signup: (data) =>
      request("/api/students/signup", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    verifyOtp: (data) =>
      request("/api/students/verify-otp", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    resendOtp: (data) =>
      request("/api/students/resend-otp", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (data) =>
      request("/api/students/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    profile: () =>
      request("/api/students/profile", {
        method: "GET",
      }),
  },
  subadmin: {
    login: (data) =>
      request("/api/subadmin/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    todayComplaints: () =>
      request("/api/subadmin/complaints/today", {
        method: "GET",
      }),
    pendingComplaints: () =>
      request("/api/subadmin/complaints/pending", {
        method: "GET",
      }),
    completedComplaints: () =>
      request("/api/subadmin/complaints/completed", {
        method: "GET",
      }),
    completeComplaint: (id, resolutionNote) =>
      request(`/api/subadmin/complaints/${id}/complete`, {
        method: "PATCH",
        body: JSON.stringify({ resolutionNote }),
      }),
  },
  admin: {
    login: (data) =>
      request("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getSubAdmins: () =>
      request("/api/admin/subadmins", {
        method: "GET",
      }),
    createSubAdmin: (data) =>
      request("/api/admin/create-subadmin", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    deleteSubAdmin: (id) =>
      request(`/api/admin/delete-subadmin/${id}`, {
        method: "DELETE",
      }),
    todayComplaints: () =>
      request("/api/admin/complaints/today", {
        method: "GET",
      }),
    pendingComplaints: () =>
      request("/api/admin/complaints/pending", {
        method: "GET",
      }),
    completedComplaints: () =>
      request("/api/admin/complaints/completed", {
        method: "GET",
      }),
    completeComplaint: (id, resolutionNote) =>
      request(`/api/admin/complaints/${id}/complete`, {
        method: "PATCH",
        body: JSON.stringify({ resolutionNote }),
      }),
  },
  complaints: {
    create: (formData) =>
      request("/api/complaints/create", {
        method: "POST",
        body: formData,
      }),
    pending: () =>
      request("/api/complaints/pending", {
        method: "GET",
      }),
    completed: () =>
      request("/api/complaints/completed", {
        method: "GET",
      }),
    delete: (id) =>
      request(`/api/complaints/${id}`, {
        method: "DELETE",
      }),
  },
};
