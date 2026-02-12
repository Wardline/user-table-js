import { getPatronymic } from '../utils/userFormat';

function SortIcon({ active, order }) {
  if (!active) return <span className="sort-icon">↕</span>;
  if (order === 'asc') return <span className="sort-icon">↑</span>;
  if (order === 'desc') return <span className="sort-icon">↓</span>;
  return <span className="sort-icon">↕</span>;
}

function HeaderCell({ label, sortKey, sort, onSort, width, onResizeStart }) {
  const active = sort.key === sortKey && !!sort.order;

  return (
    <th style={{ width: `${width}px` }}>
      <button
        type="button"
        className="th-btn"
        onClick={() => onSort(sortKey)}
        title="Сортировка: asc → desc → off"
      >
        <span>{label}</span>
        <SortIcon active={active} order={sort.order} />
      </button>

      <span
        className="resize-handle"
        onMouseDown={(e) => onResizeStart(e, sortKey)}
        role="presentation"
      />
    </th>
  );
}

export default function UsersTable({
  users,
  sort,
  onSort,
  onRowClick,
  colWidths,
  setColWidths,
}) {
  const startResize = (event, colKey) => {
    event.preventDefault();

    const startX = event.clientX;
    const startWidth = colWidths[colKey];

    const handleMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      const nextWidth = Math.max(50, startWidth + delta);
      setColWidths((prev) => ({ ...prev, [colKey]: nextWidth }));
    };

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <HeaderCell
              label="Фамилия"
              sortKey="fio"
              sort={sort}
              onSort={onSort}
              width={colWidths.lastName}
              onResizeStart={(e) => startResize(e, 'lastName')}
            />
            <HeaderCell
              label="Имя"
              sortKey="fio"
              sort={sort}
              onSort={onSort}
              width={colWidths.firstName}
              onResizeStart={(e) => startResize(e, 'firstName')}
            />
            <HeaderCell
              label="Отчество"
              sortKey="fio"
              sort={sort}
              onSort={onSort}
              width={colWidths.patronymic}
              onResizeStart={(e) => startResize(e, 'patronymic')}
            />

            <HeaderCell
              label="Возраст"
              sortKey="age"
              sort={sort}
              onSort={onSort}
              width={colWidths.age}
              onResizeStart={(e) => startResize(e, 'age')}
            />

            <HeaderCell
              label="Пол"
              sortKey="gender"
              sort={sort}
              onSort={onSort}
              width={colWidths.gender}
              onResizeStart={(e) => startResize(e, 'gender')}
            />

            <HeaderCell
              label="Телефон"
              sortKey="phone"
              sort={sort}
              onSort={onSort}
              width={colWidths.phone}
              onResizeStart={(e) => startResize(e, 'phone')}
            />

            <th style={{ width: `${colWidths.email}px` }}>
              <span className="th-label">Email</span>
              <span
                className="resize-handle"
                onMouseDown={(e) => startResize(e, 'email')}
                role="presentation"
              />
            </th>

            <th style={{ width: `${colWidths.country}px` }}>
              <span className="th-label">Страна</span>
              <span
                className="resize-handle"
                onMouseDown={(e) => startResize(e, 'country')}
                role="presentation"
              />
            </th>

            <th style={{ width: `${colWidths.city}px` }}>
              <span className="th-label">Город</span>
              <span
                className="resize-handle"
                onMouseDown={(e) => startResize(e, 'city')}
                role="presentation"
              />
            </th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={9} className="empty-row">
                Пользователи не найдены
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} onClick={() => onRowClick(user)} className="clickable-row">
                <td>{user.lastName}</td>
                <td>{user.firstName}</td>
                <td>{getPatronymic(user)}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.address?.country || '—'}</td>
                <td>{user.address?.city || '—'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
