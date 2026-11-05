import { useEffect, useState } from 'react'

const FORMSPREE_URL = 'https://formspree.io/f/xrpppgew'
const MODAL_DELAY_MS = 60000
const DISMISSED_KEY = 'contactModalDismissed'

function wasDismissed() {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === 'true'
  } catch {
    return false
  }
}

function ContactForm() {
  const [isOpen, setIsOpen] = useState(false)

  // Показати вікно через 1 хвилину, якщо користувач не закривав його під час сесії
  useEffect(() => {
    if (wasDismissed()) return undefined

    const timerId = setTimeout(() => setIsOpen(true), MODAL_DELAY_MS)
    return () => clearTimeout(timerId)
  }, [])

  const close = () => {
    setIsOpen(false)
    try {
      sessionStorage.setItem(DISMISSED_KEY, 'true')
    } catch {
      // sessionStorage недоступний — вікно просто не повторюватиметься до перезавантаження
    }
  }

  // Закриття по Escape
  useEffect(() => {
    if (!isOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <button type="button" className="modal-close" aria-label="Закрити" onClick={close}>
          &times;
        </button>
        <h2 id="contact-modal-title">Зворотний зв’язок</h2>

        <form className="contact-form" action={FORMSPREE_URL} method="POST">
          <label htmlFor="cf-name">Ім’я</label>
          <input type="text" id="cf-name" name="name" autoComplete="name" required autoFocus />

          <label htmlFor="cf-email">Email</label>
          <input type="email" id="cf-email" name="email" autoComplete="email" required />

          <label htmlFor="cf-phone">Номер телефону</label>
          <input type="tel" id="cf-phone" name="phone" autoComplete="tel" required />

          <label htmlFor="cf-message">Повідомлення</label>
          <textarea id="cf-message" name="message" rows="4" required />

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Надіслати</button>
            <button type="button" className="btn" onClick={close}>Закрити</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
