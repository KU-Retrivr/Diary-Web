export function DiaryComposer({
  draft,
  isSubmitting,
  onDateChange,
  onDraftChange,
  onSubmit,
  selectedDate,
}) {
  const characterCount = draft.trim().length;

  return (
    <form className="composer" onSubmit={onSubmit}>
      <div className="composer-field">
        <label className="composer-label" htmlFor="diary-date">
          날짜
        </label>
        <input
          id="diary-date"
          className="date-input"
          name="date"
          type="date"
          value={selectedDate}
          onChange={(event) => onDateChange(event.target.value)}
        />
      </div>

      <div className="composer-field">
        <label className="composer-label" htmlFor="diary-content">
          내용
        </label>
        <textarea
          id="diary-content"
          className="composer-input"
          name="content"
          placeholder="오늘 남기고 싶은 일을 적어보세요."
          rows="8"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
        />
      </div>

      <div className="composer-footer">
        <span className="composer-hint">{characterCount}자</span>
        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  );
}
