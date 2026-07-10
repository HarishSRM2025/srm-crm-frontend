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
