function thirdNameRaw(user) {
  return String(user?.maidenName ?? '').trim();
}

export function getThirdName(user) {
  return thirdNameRaw(user) || '—';
}

export function getFio(user) {
  const lastName = String(user?.lastName ?? '').trim();
  const firstName = String(user?.firstName ?? '').trim();
  const thirdName = thirdNameRaw(user);

  return [lastName, firstName, thirdName].filter(Boolean).join(' ').trim();
}

