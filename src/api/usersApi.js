const BASE_URL = 'https://dummyjson.com/users';

const SORT_TO_API_FIELD = {
  fio: 'lastName',
  age: 'age',
  gender: 'gender',
  phone: 'phone',
};

export async function getUsers({
  page,
  pageSize,
  sort,
  needAll,
  signal,
}) {
  const params = new URLSearchParams();

  if (needAll) {
    params.set('limit', '0');
    params.set('skip', '0');
  } else {
    params.set('limit', String(pageSize));
    params.set('skip', String((page - 1) * pageSize));
  }

  params.set(
    'select',
    [
      'id',
      'firstName',
      'lastName',
      'maidenName',
      'age',
      'gender',
      'phone',
      'email',
      'address',
      'height',
      'weight',
      'image',
    ].join(',')
  );

  // сортировка через HTTP-параметры
  if (sort.key && sort.order) {
    params.set('sortBy', SORT_TO_API_FIELD[sort.key]);
    params.set('order', sort.order);
  }

  const res = await fetch(`${BASE_URL}?${params.toString()}`, { signal });

  if (!res.ok) {
    throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
