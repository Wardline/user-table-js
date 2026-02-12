import { useCallback, useEffect, useMemo, useState } from 'react';
import { getUsers } from '../api/usersApi';
import { getFio } from '../utils/userFormat';

function normalize(value) {
  return String(value ?? '').toLowerCase().trim();
}

function sortUsersLocally(users, sort) {
  if (!sort.key || !sort.order) return users;

  const factor = sort.order === 'asc' ? 1 : -1;
  const prepared = [...users];

  prepared.sort((a, b) => {
    if (sort.key === 'fio') {
      const fioA = getFio(a);
      const fioB = getFio(b);
      return fioA.localeCompare(fioB, 'ru', { sensitivity: 'base' }) * factor;
    }

    const valueA = a[sort.key];
    const valueB = b[sort.key];

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return (valueA - valueB) * factor;
    }

    return (
      String(valueA ?? '').localeCompare(String(valueB ?? ''), 'ru', {
        sensitivity: 'base',
        numeric: true,
      }) * factor
    );
  });

  return prepared;
}

function applyFilters(users, filters) {
  const fioFilter = normalize(filters.fio);
  const ageFilter = normalize(filters.age);
  const genderFilter = normalize(filters.gender);
  const phoneFilter = normalize(filters.phone);

  return users.filter((u) => {
    const fio = normalize(getFio(u));
    const fioOk = !fioFilter || fio.includes(fioFilter);

    let ageOk = true;
    if (ageFilter) {
      // поддержка диапазона вида "20-30"
      const rangeMatch = ageFilter.match(/^(\d+)\s*-\s*(\d+)$/);
      if (rangeMatch) {
        const min = Number(rangeMatch[1]);
        const max = Number(rangeMatch[2]);
        ageOk = Number(u.age) >= min && Number(u.age) <= max;
      } else {
        ageOk = String(u.age ?? '').includes(ageFilter);
      }
    }

    const genderOk = !genderFilter || normalize(u.gender).includes(genderFilter);
    const phoneOk = !phoneFilter || normalize(u.phone).includes(phoneFilter);

    return fioOk && ageOk && genderOk && phoneOk;
  });
}

export function useUsers({ page, pageSize, sort, filters }) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const hasFilters = useMemo(
    () => Object.values(filters).some((value) => String(value).trim() !== ''),
    [filters]
  );

  const refetch = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError('');

        const data = await getUsers({
          page,
          pageSize,
          sort,
          needAll: hasFilters,
          signal: controller.signal,
        });

        let list = Array.isArray(data.users) ? data.users : [];

        // Fallback-сортировка на клиенте
        // (на случай нестабильного поведения API)
        list = sortUsersLocally(list, sort);

        if (hasFilters) {
          const filtered = applyFilters(list, filters);
          const start = (page - 1) * pageSize;
          const end = start + pageSize;

          if (!isMounted) return;
          setUsers(filtered.slice(start, end));
          setTotal(filtered.length);
        } else {
          if (!isMounted) return;
          setUsers(list);
          setTotal(Number(data.total) || list.length);
        }
      } catch (err) {
        if (err?.name === 'AbortError') return;
        if (!isMounted) return;
        setError(err?.message || 'Не удалось получить данные пользователей');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page, pageSize, sort, filters, hasFilters, reloadKey]);

  return {
    users,
    total,
    loading,
    error,
    refetch,
  };
}
