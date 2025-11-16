
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';


export async function fetchAPI<T>(
  endpoint: string,
  options?: { method?: HttpMethod; body?: any }
): Promise<T> {
  let headers: HeadersInit = {};
  let body = options?.body;
  const base = "http://localhost:8000";
  const url = `${base}${endpoint}`; // "http://localhost/feedback"

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  // const res = await fetch(url, {
  //   method: options?.method || "GET",
  //   headers,
  //   body,
  // });

  const fetchOptions: RequestInit = { method: options?.method || "GET", headers };
  if (body && options?.method !== "GET") fetchOptions.body = body;

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    let errorMessage = `API request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData?.detail) errorMessage = errorData.detail;
    } catch {
      // Ignore JSON parse error
      console.log("JSON parse error");
      
    }
    throw new Error(errorMessage);
  }

  const data = await res.json();
  return data as T;
}
