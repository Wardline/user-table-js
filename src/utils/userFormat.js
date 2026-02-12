function patronymicRaw(user) {
  return String(user?.middleName ?? '').trim();
}

export function getPatronymic(user) {
  return patronymicRaw(user) || '—';
}

export function getFio(user) {
  const lastName = String(user?.lastName ?? '').trim();
  const firstName = String(user?.firstName ?? '').trim();
  const patronymic = patronymicRaw(user);

  return [lastName, firstName, patronymic].filter(Boolean).join(' ').trim();
}
