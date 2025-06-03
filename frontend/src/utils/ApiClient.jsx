import { getAuthToken } from "./auth";
import { clearData } from "./clearData";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL || baseUrl;
  }

  async request(endpoint, method = "GET", body = null, customHeaders = {}) {
  const token = getAuthToken();
  const isFormData = body instanceof FormData;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...customHeaders,
  };

  // 🧠 Only attach body if method allows it
  const options = {
    method,
    headers,
  };

  if (body && method !== "GET" && method !== "HEAD") {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${this.baseURL}${endpoint}`, options);

    if (response.status === 402 || response.status === 401) {
      clearData();
      return null;
    }

    const data = await response.json();

    if (data?.error?.[0]?.message === "Invalid token") {
      clearData();
      return null;
    }

    return data;
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
}

  get(endpoint, headers = {}) {
    return this.request(endpoint, "GET", null, headers);
  }

  post(endpoint, body, headers = {}) {
    return this.request(endpoint, "POST", body, headers);
  }

  put(endpoint, body, headers = {}) {
    return this.request(endpoint, "PUT", body, headers);
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, "DELETE", null, headers);
  }
}

const apiClient = new ApiClient();
export default apiClient;