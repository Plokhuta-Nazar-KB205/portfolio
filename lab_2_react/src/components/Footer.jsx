import { useEffect, useState } from 'react'

const STORAGE_KEYS = {
  userAgent: 'userAgent',
  platform: 'platform',
}

function readSystemInfo() {
  try {
    return {
      userAgent: localStorage.getItem(STORAGE_KEYS.userAgent),
      platform: localStorage.getItem(STORAGE_KEYS.platform),
    }
  } catch {
    return { userAgent: null, platform: null }
  }
}

function Footer() {
  const [systemInfo, setSystemInfo] = useState({ userAgent: null, platform: null })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.userAgent, navigator.userAgent)
      localStorage.setItem(STORAGE_KEYS.platform, navigator.platform)
    } catch (err) {
      console.error('localStorage недоступний:', err)
    }
    // Відображаємо те, що фактично лежить у localStorage (синхронізація із зовнішнім сховищем)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSystemInfo(readSystemInfo())
  }, [])

  return (
    <footer id="contacts">
      <h2>Контакти</h2>
      <address>
        <ul>
          <li>
            Email:{' '}
            <a href="mailto:nazar.plokhuta.kb.2025@lpnu.ua">
              nazar.plokhuta.kb.2025@lpnu.ua
            </a>
          </li>
          <li>
            GitHub:{' '}
            <a
              href="https://github.com/Nazar-Plokhuta"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/Nazar-Plokhuta
            </a>
          </li>
          <li>
            LinkedIn:{' '}
            <a
              href="https://www.linkedin.com/in/nazarplokhuta/"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin.com/in/nazarplokhuta
            </a>
          </li>
        </ul>
      </address>
      <section className="system-info" aria-labelledby="system-info-title">
        <h3 id="system-info-title">Інформація про систему (з localStorage)</h3>
        {systemInfo.userAgent ? (
          <dl>
            <dt>Платформа (navigator.platform)</dt>
            <dd>{systemInfo.platform}</dd>
            <dt>User agent (navigator.userAgent)</dt>
            <dd>{systemInfo.userAgent}</dd>
          </dl>
        ) : (
          <p>Дані недоступні (localStorage заблоковано).</p>
        )}
      </section>
      <p><small>&copy; 2026 Назар Плохута</small></p>
    </footer>
  )
}

export default Footer
