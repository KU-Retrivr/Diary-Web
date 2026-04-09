import { apiRequest } from '../utils/api';

export function getDiaries() {
  return apiRequest('/diaries');
}

export function createDiary(payload) {
  return apiRequest('/diaries', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
}

export async function deleteDiary(id) {
  const responseText = await apiRequest(`/diaries/${id}`, {
    method: 'DELETE',
    parseJson: false,
  });

  return responseText;
}
