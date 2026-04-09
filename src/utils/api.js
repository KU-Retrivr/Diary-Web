export const BASE_URL = 'http://52.79.227.135:8080';

export class ApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = details.status;
    this.error = details.error;
    this.path = details.path;
    this.timestamp = details.timestamp;
  }
}

async function parseErrorResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const errorBody = await response.json();
    throw new ApiError(
      errorBody.message || '요청을 처리하지 못했습니다.',
      errorBody,
    );
  }

  const errorText = await response.text();
  throw new ApiError(errorText || '요청을 처리하지 못했습니다.', {
    status: response.status,
  });
}

export async function apiRequest(path, options = {}) {
  const { headers, body, parseJson = true, ...restOptions } = options;
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body && typeof body !== 'string' ? JSON.stringify(body) : body,
    ...restOptions,
  });

  if (!response.ok) {
    await parseErrorResponse(response);
  }

  if (!parseJson || response.status === 204) {
    return null;
  }

  return response.json();
}
