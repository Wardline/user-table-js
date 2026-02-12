import { useEffect, useMemo, useState } from 'react';
import { useUsers } from './hooks/useUsers';
import FiltersBar from './components/FiltersBar';
import UsersTable from './components/UsersTable';
import Pagination from './components/Pagination';
import UserModal from './components/UserModal';

const PAGE_SIZE = 10;

const DEFAULT_WIDTHS = {
  lastName: 170,
  firstName: 150,
  patronymic: 170,
  age: 90,
  gender: 110,
  phone: 190,
  email: 260,
  country: 150,
  city: 150,
};

function cycleSort(prev, key) {
  if (prev.key !== key) return { key, order: 'asc' };
  if (prev.order === 'asc') return { key, order: 'desc' };
  if (prev.order === 'desc') return { key: null, order: null };
  return { key, order: 'asc' };
}

export default function App() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: null, order: null });
  const [filters, setFilters] = useState({
    fio: '',
    age: '',
    gender: '',
    phone: '',
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [colWidths, setColWidths] = useState(DEFAULT_WIDTHS);

  const { users, total, loading, error, refetch } = useUsers({
    page,
    pageSize: PAGE_SIZE,
    sort,
    filters,
  });

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total]
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleSort = (key) => {
    setSort((prev) => cycleSort(prev, key));
    setPage(1);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ fio: '', age: '', gender: '', phone: '' });
    setPage(1);
  };

  return (
    <main className="container">
      <h1>Таблица пользователей</h1>

      <p className="hint">
        Сортировка по ФИО, возрасту, полу и телефону переключается по циклу:
        <strong> по возрастанию - по убыванию - без сортировки</strong>.
      </p>

      <FiltersBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {error && (
        <div className="error-box" role="alert">
          <p>Ошибка: {error}</p>
          <button type="button" onClick={refetch}>
            Повторить запрос
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading">Загрузка данных...</div>
      ) : (
        <UsersTable
          users={users}
          sort={sort}
          onSort={handleSort}
          onRowClick={setSelectedUser}
          colWidths={colWidths}
          setColWidths={setColWidths}
        />
      )}

      <div className="bottom-bar">
        <div>
          Всего записей: <strong>{total}</strong>
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </main>
  );
}
