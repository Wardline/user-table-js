function buildPages(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push('...');
  for (let p = start; p <= end; p += 1) pages.push(p);
  if (end < total - 1) pages.push('...');

  pages.push(total);
  return pages;
}

export default function Pagination({ page, totalPages, onChange }) {
  const pages = buildPages(page, totalPages);

  return (
    <nav className="pagination" aria-label="Пагинация пользователей">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        Назад
      </button>

      {pages.map((item, idx) => {
        if (item === '...') {
          return (
            <span key={`dots-${idx}`} className="dots">
              ...
            </span>
          );
        }

        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={item === page ? 'active' : ''}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Вперед
      </button>
    </nav>
  );
}
