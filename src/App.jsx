import { useEffect, useMemo, useState } from 'react';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'];
const emotionOptions = ['행복', '신남', '설렘', '슬픔', '무난'];

function createCalendarDays(baseDate) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();
  const startWeekDay = firstDay.getDay();
  const days = [];

  for (let i = 0; i < startWeekDay; i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    days.push(day);
  }

  while (days.length < 42) {
    days.push(null);
  }

  return days;
}

function toDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('이미지를 불러오지 못했습니다.'));
    reader.readAsDataURL(file);
  });
}

export default function App() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [emotion, setEmotion] = useState('무난');
  const [content, setContent] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [selectedImageDataUrl, setSelectedImageDataUrl] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [openedEntry, setOpenedEntry] = useState(null);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const calendarDays = useMemo(() => createCalendarDays(displayedMonth), [displayedMonth]);
  const monthLabel = `${displayedMonth.getFullYear()}년 ${displayedMonth.getMonth() + 1}월`;
  const entryMap = useMemo(() => {
    return entries.reduce((accumulator, entry) => {
      accumulator[entry.date] = entry;
      return accumulator;
    }, {});
  }, [entries]);
  const timeParts = currentTime
    .toLocaleTimeString('en-US', { hour12: true })
    .replace(',', '')
    .split(' ');
  const timeLabel = `${timeParts[1]} ${timeParts[0]}`;
  const todayLabel = `${currentTime.getFullYear()}년 ${String(
    currentTime.getMonth() + 1,
  ).padStart(2, '0')}월 ${String(currentTime.getDate()).padStart(2, '0')}일 (${
    weekdayLabels[currentTime.getDay()]
  })`;
  const currentHour = currentTime.getHours();
  const isNightTime = currentHour >= 19 || currentHour < 6;
  const themeClassName = isNightTime ? 'theme-night' : 'theme-day';

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFileName('');
      setImagePreviewUrl('');
      setSelectedImageDataUrl('');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSelectedFileName(file.name);
      setImagePreviewUrl(dataUrl);
      setSelectedImageDataUrl(dataUrl);
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
    }
  };

  const handleSave = () => {
    setEntries((previous) => {
      const filtered = previous.filter((entry) => entry.date !== date);
      return [
        ...filtered,
        {
          date,
          emotion,
          content,
          imageUrl: selectedImageDataUrl,
        },
      ];
    });

    // eslint-disable-next-line no-alert
    alert('기록이 저장되었습니다.');
  };

  const handlePrevMonth = () => {
    setDisplayedMonth(
      (previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setDisplayedMonth(
      (previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1),
    );
  };

  const handleOpenEntry = (entry, dateKey) => {
    if (!entry) {
      setShowEmptyMessage(false);
      window.setTimeout(() => {
        setShowEmptyMessage(true);
      }, 10);
      return;
    }
    setOpenedEntry({ ...entry, date: dateKey });
  };

  const handleCloseEntry = () => {
    setOpenedEntry(null);
  };

  return (
    <div className={`page ${themeClassName}`}>
      {isNightTime && (
        <>
          <div className="night-sky-gradient" />
          <div className="milkyway-band" />
          <div className="star-layer star-layer-slow" />
          <div className="star-layer star-layer-fast" />
          <div className="shooting-stars" />
        </>
      )}
      <header className="top">
        <div className="service-name">Cloud Diary</div>
        <div className="weather-card">
          <span className="weather-location">{todayLabel}</span>
          <span className="weather-time">현재 시간 {timeLabel}</span>
        </div>
      </header>

      <main className="middle">
        <section className="record-panel">
          <h2 className="record-title">오늘의 기록</h2>

          <label className="field date-field">
            <span className="field-title">날짜</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>

          <div className="field emotion-field">
            <span className="field-title" aria-hidden="true" />
            <div className="emotion-toggle-group">
              {emotionOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`emotion-toggle ${emotion === option ? 'active' : ''}`}
                  onClick={() => setEmotion(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <label className="field">
            <span className="field-title" aria-hidden="true" />
            <textarea
              placeholder="오늘의 감정과 사건을 기록해보세요."
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </label>

          <input id="image-upload" type="file" accept="image/*" onChange={handleImageSelect} />

          {selectedFileName && <p className="file-name">선택된 파일: {selectedFileName}</p>}

          <label className="image-preview clickable-preview" htmlFor="image-upload">
            {imagePreviewUrl ? (
              <img src={imagePreviewUrl} alt="첨부 이미지 미리보기" />
            ) : (
              <p>이 영역을 클릭해 이미지를 첨부하세요.</p>
            )}
          </label>

          <button type="button" className="save-button full-width" onClick={handleSave}>
            저장하기
          </button>
        </section>

        <section className="calendar-panel">
          <div className="calendar-header">
            <h2>기록 캘린더</h2>
            <div className="month-controls">
              <button type="button" className="month-button" onClick={handlePrevMonth}>
                이전 달
              </button>
              <span>{monthLabel}</span>
              <button type="button" className="month-button" onClick={handleNextMonth}>
                다음 달
              </button>
            </div>
          </div>

          <div className="weekdays">
            {weekdays.map((weekday) => (
              <div key={weekday}>{weekday}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((day, index) => (
              day ? (
                (() => {
                  const dateKey = toDateKey(
                    displayedMonth.getFullYear(),
                    displayedMonth.getMonth(),
                    day,
                  );
                  const entry = entryMap[dateKey];
                  const hasImage = Boolean(entry?.imageUrl);

                  return (
                    <div
                      key={`${day}-${index}`}
                      className={`day-cell ${hasImage ? 'has-image' : ''} ${entry ? 'has-entry' : ''}`}
                      style={hasImage ? { backgroundImage: `url(${entry.imageUrl})` } : undefined}
                      onClick={() => handleOpenEntry(entry, dateKey)}
                      role={entry ? 'button' : undefined}
                      tabIndex={entry ? 0 : undefined}
                      onKeyDown={(event) => {
                        if (!entry) return;
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleOpenEntry(entry, dateKey);
                        }
                      }}
                    >
                      <span className="day-number">{day}</span>
                    </div>
                  );
                })()
              ) : (
                <div key={`${day}-${index}`} className="day-cell empty" />
              )
            ))}
          </div>
        </section>
      </main>

      <footer className="bottom">
        <div className="bottom-text">
          <p>26-1학기 전공심화프로젝트</p>
          <p>202211379 조성호</p>
          <p>202212668 박다솔</p>
        </div>
      </footer>

      {openedEntry && (
        <div className="entry-modal-overlay" onClick={handleCloseEntry} role="presentation">
          <div className="entry-modal" onClick={(event) => event.stopPropagation()}>
            <div className="entry-modal-header">
              <h3>{openedEntry.date} 기록</h3>
              <button type="button" className="entry-modal-close" onClick={handleCloseEntry}>
                닫기
              </button>
            </div>

            {openedEntry.imageUrl && (
              <div className="entry-modal-image">
                <img src={openedEntry.imageUrl} alt="기록 이미지" />
              </div>
            )}

            <p className="entry-modal-content">{openedEntry.content || '저장된 기록 내용이 없습니다.'}</p>
            <p className="entry-modal-emotion">감정: {openedEntry.emotion || '무난'}</p>
          </div>
        </div>
      )}

      {showEmptyMessage && (
        <div
          className="empty-entry-message"
          onAnimationEnd={() => setShowEmptyMessage(false)}
          role="status"
        >
          저장된 기록이 없습니다.
        </div>
      )}
    </div>
  );
}
