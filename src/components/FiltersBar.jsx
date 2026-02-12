export default function FiltersBar({ filters, onChange, onReset }) {
  return (
    <section className="filters" aria-label="Фильтры пользователей">
      <label className="field">
        <span>ФИО</span>
        <input
          type="text"
          placeholder="Например: Иванов"
          value={filters.fio}
          onChange={(e) => onChange('fio', e.target.value)}
        />
      </label>

      <label className="field">
        <span>Возраст</span>
        <input
          type="text"
          placeholder="Например: 25 или 20-30"
          value={filters.age}
          onChange={(e) => onChange('age', e.target.value)}
        />
      </label>

      <label className="field">
        <span>Пол</span>
        <select
          value={filters.gender}
          onChange={(e) => onChange('gender', e.target.value)}
        >
          <option value="">Любой</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </label>

      <label className="field">
        <span>Телефон</span>
        <input
          type="text"
          placeholder="Часть номера"
          value={filters.phone}
          onChange={(e) => onChange('phone', e.target.value)}
        />
      </label>

      <button type="button" className="reset-btn" onClick={onReset}>
        Сбросить фильтры
      </button>
    </section>
  );
}
