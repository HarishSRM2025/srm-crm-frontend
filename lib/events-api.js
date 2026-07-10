const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://srm-crm-backend.onrender.com").replace(
  /\/$/,
  ""
);

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
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
  return apiRequest("/events", {
    method: "POST",
    body: JSON.stringify(form),
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


