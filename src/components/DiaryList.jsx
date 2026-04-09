import { DiaryCard } from './DiaryCard';

export function DiaryList({
  deletingId,
  diaries,
  emptyStateCopy,
  isLoading,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="feedback-card">
        <div className="spinner" />
        <p>일기를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (diaries.length === 0) {
    return (
      <div className="feedback-card empty-state">
        <p className="empty-title">{emptyStateCopy.title}</p>
        <p className="empty-description">{emptyStateCopy.description}</p>
      </div>
    );
  }

  return (
    <div className="diary-list">
      {diaries.map((diary) => (
        <DiaryCard
          key={diary.id}
          diary={diary}
          isDeleting={deletingId === diary.id}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
