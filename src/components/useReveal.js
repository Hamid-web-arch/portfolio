import { useEffect } from 'react'

// Səhifə açılanda .reveal elementlərini scroll ilə görünən edir
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 },
    )
    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
