const API_BASE_URL = "http://127.0.0.1:8000";

export const signupAPI = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/docs/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Signup failed");
  }
  return response.json();
};

export const loginAPI = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/docs/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }
  return response.json();
};

export const uploadHealthReportAPI = async (
  formData: FormData,
  token?: string
) => {
  const response = await fetch(`${API_BASE_URL}/upload-health-report`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "File upload failed");
  }
  return response.json();
};
