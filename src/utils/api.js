const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function apiRequest(path, options = {}) {
  const { headers, parseJson = true, ...restOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...restOptions,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || '요청을 처리하지 못했습니다.');
  }

  if (!parseJson) {
    return response.text();
  }

  return response.json();
}
