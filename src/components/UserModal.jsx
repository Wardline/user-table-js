import { getFio } from '../utils/userFormat';

export default function UserModal({ user, onClose }) {
  if (!user) return null;

  const fio = getFio(user) || `${user.lastName ?? ''} ${user.firstName ?? ''}`.trim();
  const a = user.address || {};

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Информация о пользователе"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <div className="modal-header">
          <img src={user.image} alt={fio} className="avatar" />
          <div>
            <h2>{fio}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="modal-grid">
          <div>
            <strong>Возраст:</strong> {user.age}
          </div>
          <div>
            <strong>Пол:</strong> {user.gender}
          </div>
          <div>
            <strong>Рост:</strong> {user.height} см
          </div>
          <div>
            <strong>Вес:</strong> {user.weight} кг
          </div>
          <div>
            <strong>Телефон:</strong> {user.phone}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>

          <div>
            <strong>Страна:</strong> {a.country || '—'}
          </div>
          <div>
            <strong>Город:</strong> {a.city || '—'}
          </div>
          <div>
            <strong>Регион:</strong> {a.state || a.stateCode || '—'}
          </div>
          <div>
            <strong>Улица:</strong> {a.address || '—'}
          </div>
          <div>
            <strong>Индекс:</strong> {a.postalCode || '—'}
          </div>
        </div>
      </div>
    </div>
  );
}
