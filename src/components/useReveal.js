import { useEffect } from 'react'

// Səhifə açılanda .reveal elementlərini scroll ilə görünən edir.
// threshold: 0 — bölmənin hündürlüyündən asılı olmayaraq (məs. mobildə çox uzun
// "Layihələr" bölməsi, üfüqi telefon ekranı) ekrana girən kimi görünür.
export function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }),
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    )
    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
