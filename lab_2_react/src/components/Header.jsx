import photo from '../assets/photo.png'

function Header({ theme, onToggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <header>
      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-pressed={isDark}
      >
        <span aria-hidden="true">{isDark ? '🌙' : '☀️'}</span>{' '}
        {isDark ? 'Нічна тема' : 'Денна тема'}
      </button>
      <img src={photo} alt="Фото Назара Плохути" width="200" height="200" />
      <h1>Назар Плохута</h1>
      <p>Junior Backend Developer</p>

      <nav>
        <ul>
          <li><a href="#about">Про мене</a></li>
          <li><a href="#education">Освіта</a></li>
          <li><a href="#experience">Досвід</a></li>
          <li><a href="#skills">Навички</a></li>
          <li><a href="#achievements">Досягнення</a></li>
          <li><a href="#interests">Інтереси</a></li>
          <li><a href="#reviews">Відгуки</a></li>
          <li><a href="#contacts">Контакти</a></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
