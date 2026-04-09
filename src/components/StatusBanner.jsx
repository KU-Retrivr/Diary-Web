export function StatusBanner({ error, notice }) {
  if (!error && !notice) {
    return null;
  }

  return (
    <div className={`status-banner ${error ? 'is-error' : 'is-notice'}`}>
      <p>{error || notice}</p>
    </div>
  );
}
