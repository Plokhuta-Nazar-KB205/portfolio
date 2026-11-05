import { useEffect, useState } from 'react'
import Header from './components/Header'
import About from './components/About'
import Education from './components/Education'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Achievements from './components/Achievements'
import Interests from './components/Interests'
import Reviews from './components/Reviews'
import Footer from './components/Footer'
import ContactForm from './components/ContactForm'
import './features.css'

const DAY_START_HOUR = 7
const DAY_END_HOUR = 21

function getThemeByTime(now = new Date()) {
  const hours = now.getHours()
  return hours >= DAY_START_HOUR && hours < DAY_END_HOUR ? 'light' : 'dark'
}

function App() {
  // Початкова тема визначається за поточним часом: 07:00–21:00 — light, інакше — dark
  const [theme, setTheme] = useState(getThemeByTime)

  // Застосування теми: додаємо/прибираємо клас .dark-mode на <body>
  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark')
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <About />
        <Education />
        <Experience />
        <Skills />
        <Achievements />
        <Interests />
        <Reviews />
      </main>
      <Footer />
      <ContactForm />
    </>
  )
}

export default App
