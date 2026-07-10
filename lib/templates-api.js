const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://srm-crm-backend.onrender.com").replace(
  /\/$/,
  ""
);

async function apiRequest(path, options = {}) {
  const headers = { ...options.headers };
  
  // Only set application/json if we are not sending FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let message;
    try {
      const errorData = await response.json();
      message = errorData.message || errorData.error;
    } catch {
      message = await response.text();
    }
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export function fetchTemplates() {
  return apiRequest("/template-blob-url");
}

export function createTemplate(data) {
  return apiRequest("/template-blob-url", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateTemplate(id, data) {
  return apiRequest(`/template-blob-url/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteTemplate(id) {
  return apiRequest(`/template-blob-url/${id}`, {
    method: "DELETE",
  });
}

export function uploadTemplateFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest("/template-blob-url/upload", {
    method: "POST",
    body: formData,
  });
}

export function getDownloadUrl(filename, password) {
  const url = `${API_BASE_URL}/template-blob-url/download/${filename}`;
  if (password) {
    return `${url}?password=${encodeURIComponent(password)}`;
  }
  return url;
}

export function fetchTemplateBySlug(slug) {
  return apiRequest(`/template-blob-url/slug/${slug}`);
}

export function reactivateTemplate(id, password, duration) {
  return apiRequest(`/template-blob-url/${id}/reactivate`, {
    method: "PATCH",
    body: JSON.stringify({
      template_password: password,
      template_blob_url_epires_duriation: duration,
    }),
  });
}

export function getViewUrl(slug) {
  // Return the client side URL pointing to /view/[slug]
  if (typeof window !== "undefined") {
    return `${window.location.origin}/view/${slug}`;
  }
  return `/view/${slug}`;
}

export function submitCommentBySlug(slug, comment) {
  return apiRequest(`/template-blob-url/comment/${slug}`, {
    method: "PATCH",
    body: JSON.stringify({ comment }),
  });
}
