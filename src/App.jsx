import { useEffect, useState } from 'react';
import { DiaryComposer } from './components/DiaryComposer';
import { DiaryList } from './components/DiaryList';
import { StatusBanner } from './components/StatusBanner';
import { createDiary, deleteDiary, getDiaries } from './services/diaryService';
import { getTodayDate } from './utils/date';

const EMPTY_STATE_COPY = {
  title: '아직 작성된 일기가 없습니다',
  description: '날짜를 고르고 오늘의 기록을 남겨보세요.',
};

function App() {
  const [diaries, setDiaries] = useState([]);
  const [draft, setDraft] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayDate);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    void loadDiaries();
  }, []);

  async function loadDiaries() {
    setIsLoading(true);
    setError('');

    try {
      const items = await getDiaries();
      setDiaries(items);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateDiary(event) {
    event.preventDefault();

    const content = draft.trim();
    if (!content) {
      setError('일기 내용을 입력해 주세요.');
      return;
    }

    if (!selectedDate) {
      setError('날짜를 선택해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setNotice('');

    try {
      const createdDiary = await createDiary({
        content,
        date: selectedDate,
      });

      setDiaries((current) => [createdDiary, ...current]);
      setDraft('');
      setSelectedDate(getTodayDate());
      setNotice('일기가 저장되었습니다.');
    } catch (createError) {
      setError(createError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteDiary(id) {
    setDeletingId(id);
    setError('');
    setNotice('');

    try {
      const message = await deleteDiary(id);
      setDiaries((current) => current.filter((diary) => diary.id !== id));
      setNotice(message || '일기가 삭제되었습니다.');
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <main className="page">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Diary Atelier</p>
            <h1>Today's Diary</h1>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Write</p>
                <h2>오늘의 기록</h2>
              </div>
            </div>

            <DiaryComposer
              draft={draft}
              isSubmitting={isSubmitting}
              onDateChange={setSelectedDate}
              onDraftChange={setDraft}
              onSubmit={handleCreateDiary}
              selectedDate={selectedDate}
            />
          </div>

          <div className="panel">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Library</p>
                <h2>저장된 일기</h2>
              </div>
            </div>

            <StatusBanner error={error} notice={notice} />

            <DiaryList
              deletingId={deletingId}
              diaries={diaries}
              emptyStateCopy={EMPTY_STATE_COPY}
              isLoading={isLoading}
              onDelete={handleDeleteDiary}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
