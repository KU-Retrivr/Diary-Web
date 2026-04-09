import { formatDiaryDate } from '../utils/date';

export function DiaryCard({ diary, isDeleting, onDelete }) {
  return (
    <article className="diary-card">
      <div className="diary-card-header">
        <div className="diary-meta">
          <span className="diary-badge">{formatDiaryDate(diary.date)}</span>
          <span className="diary-id">#{diary.id}</span>
        </div>

        <button
          className="ghost-button"
          disabled={isDeleting}
          type="button"
          onClick={() => onDelete(diary.id)}
        >
          {isDeleting ? '삭제 중...' : '삭제'}
        </button>
      </div>

      <p className="diary-content">{diary.content}</p>
    </article>
  );
}
