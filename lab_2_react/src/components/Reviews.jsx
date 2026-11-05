import { useEffect, useState } from 'react'

const COMMENTS_URL = 'https://jsonplaceholder.typicode.com/posts/18/comments'

function Reviews() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadComments() {
      try {
        const response = await fetch(COMMENTS_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        setComments(await response.json())
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Не вдалося завантажити відгуки:', err)
          setError('Не вдалося завантажити відгуки. Спробуйте пізніше.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadComments()
    return () => controller.abort()
  }, [])

  return (
    <section id="reviews" aria-live="polite">
      <h2>Відгуки</h2>
      {loading && <p className="reviews-status">Завантаження відгуків…</p>}
      {error && <p className="reviews-status is-error">{error}</p>}
      <div className="reviews-list">
        {comments.map((comment) => (
          <article className="review-card" key={comment.id}>
            <h3>{comment.name}</h3>
            <a className="review-email" href={`mailto:${comment.email}`}>
              {comment.email}
            </a>
            <p>{comment.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Reviews
