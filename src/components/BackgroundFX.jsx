import { useEffect } from 'react'

// Kursor işığı:
//  - kursorun ətrafında yumşaq işıq dairəsi (hamar izləyir, iz qoymur);
//  - .glow-card klaslı kartların kənarı kursor yaxınlaşanda işıqlanır.
// Rəng, ölçü və güc index.css-dəki --spot-* və --glow-* dəyişənlərindədir.
// Toxunma ekranlarında və "reduced motion" ayarında söndürülür (index.css).
export default function BackgroundFX() {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reduceMotion) return

    const root = document.documentElement
    const s = { tx: -1000, ty: -1000, x: -1000, y: -1000, raf: 0 }

    const updateCards = () => {
      document.querySelectorAll('.glow-card').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return
        el.style.setProperty('--gx', `${s.tx - r.left}px`)
        el.style.setProperty('--gy', `${s.ty - r.top}px`)
      })
    }

    const tick = () => {
      // işıq dairəsi kursora yumşaq "yetişir"
      s.x += (s.tx - s.x) * 0.15
      s.y += (s.ty - s.y) * 0.15
      root.style.setProperty('--mx', `${s.x}px`)
      root.style.setProperty('--my', `${s.y}px`)
      if (Math.abs(s.tx - s.x) > 0.5 || Math.abs(s.ty - s.y) > 0.5) {
        s.raf = requestAnimationFrame(tick)
      } else {
        s.raf = 0
      }
    }

    const onMove = (e) => {
      if (s.x === -1000) {
        s.x = e.clientX
        s.y = e.clientY
      }
      s.tx = e.clientX
      s.ty = e.clientY
      updateCards()
      if (!s.raf) s.raf = requestAnimationFrame(tick)
    }

    const onLeave = () => {
      s.tx = -1000
      s.ty = -1000
      s.x = -1000
      s.y = -1000
      root.style.setProperty('--mx', '-1000px')
      root.style.setProperty('--my', '-1000px')
      updateCards()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', updateCards, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(s.raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', updateCards)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <div aria-hidden="true" className="spotlight pointer-events-none fixed inset-0 z-0" />
}
