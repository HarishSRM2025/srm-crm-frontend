const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://srm-crm-backend.onrender.com").replace(
  /\/$/,
  ""
);

async function apiRequest(path, options = {}) {
  let user = null;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("srm_crm_user");
      if (stored) {
        user = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading auth from storage:", e);
    }
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (user) {
    headers["x-user-id"] = String(user.id);
    headers["x-user-role"] = user.role;
    if (user.institution_id) {
      headers["x-user-institution-id"] = String(user.institution_id);
    }
    if (user.department_id) {
      headers["x-user-department-id"] = String(user.department_id);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export function fetchEvents() {
  return apiRequest("/events");
}

export function createEvent(form) {
  let userId = undefined;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("srm_crm_user");
      if (stored) {
        const user = JSON.parse(stored);
        userId = user.id;
      }
    } catch {}
  }

  return apiRequest("/events", {
    method: "POST",
    body: JSON.stringify({
      ...form,
      userId,
    }),
  });
}


export function updateEvent(id, data) {
  return apiRequest(`/events/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function fetchInstitutes() {
  return apiRequest("/institutes");
}

export function fetchDepartments() {
  return apiRequest("/departments");
}

export function createInstitute(name) {
  return apiRequest("/institutes", {
    method: "POST",
    body: JSON.stringify({ institute_name: name }),
  });
}

export function deleteInstitute(id) {
  return apiRequest(`/institutes/${id}`, {
    method: "DELETE",
  });
}

export function createDepartment(name, instituteId) {
  return apiRequest("/departments", {
    method: "POST",
    body: JSON.stringify({ department_name: name, instituteId }),
  });
}

export function deleteDepartment(id) {
  return apiRequest(`/departments/${id}`, {
    method: "DELETE",
  });
}

export function signupUser(data) {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function signinUser(email_id, password) {
  return apiRequest("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email_id, password }),
  });
}
