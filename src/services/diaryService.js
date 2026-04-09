import { apiRequest } from '../utils/api';

/**
 * @typedef {Object} Diary
 * @property {number} id
 * @property {string} date
 * @property {string | null} emotion
 * @property {string} content
 * @property {string | null} imageUrl
 */

function validateMonth(month) {
  if (!month) {
    return;
  }

  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error('month는 YYYY-MM 형식이어야 합니다.');
  }
}

function validateDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('date는 YYYY-MM-DD 형식이어야 합니다.');
  }
}

/**
 * @param {string | undefined} month
 * @returns {Promise<Diary[]>}
 */
export function getDiaries(month) {
  validateMonth(month);
  const query = month ? `?month=${encodeURIComponent(month)}` : '';
  return apiRequest(`/diaries${query}`);
}

/**
 * @param {string} date
 * @param {{ date: string, content: string, emotion: string | null, imageUrl: string | null }} payload
 * @returns {Promise<Diary>}
 */
export function upsertDiary(date, payload) {
  validateDate(date);
  validateDate(payload.date);

  if (date !== payload.date) {
    throw new Error('path date와 body date가 일치해야 합니다.');
  }

  if (!payload.content?.trim()) {
    throw new Error('일기 내용은 필수입니다.');
  }

  return apiRequest(`/diaries/${date}`, {
    method: 'PUT',
    body: {
      ...payload,
      content: payload.content.trim(),
    },
  });
}

/**
 * @param {string} date
 * @returns {Promise<void>}
 */
export function deleteDiary(date) {
  validateDate(date);
  return apiRequest(`/diaries/${date}`, {
    method: 'DELETE',
    parseJson: false,
  });
}
