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
    const OFF = -1000
    const s = { tx: OFF, ty: OFF, x: OFF, y: OFF, raf: 0, cardsQueued: false }

    // Kartları kadr başına bir dəfə yeniləyirik: əvvəl bütün ölçüləri OXUYURUQ,
    // sonra YAZIRIQ — beləcə brauzer hər kart üçün layout-u təkrar hesablamır.
    const updateCards = () => {
      s.cardsQueued = false
      const cards = document.querySelectorAll('.glow-card')
      const vh = window.innerHeight
      const rects = Array.from(cards, (el) => el.getBoundingClientRect())
      cards.forEach((el, i) => {
        const r = rects[i]
        if (r.bottom < -200 || r.top > vh + 200) return
        el.style.setProperty('--gx', `${s.tx - r.left}px`)
        el.style.setProperty('--gy', `${s.ty - r.top}px`)
      })
    }
    const queueCards = () => {
      if (s.cardsQueued) return
      s.cardsQueued = true
      requestAnimationFrame(updateCards)
    }

    const tick = () => {
      // işıq dairəsi kursora yumşaq "yetişir"
      s.x += (s.tx - s.x) * 0.15
      s.y += (s.ty - s.y) * 0.15
      root.style.setProperty('--mx', `${s.x}px`)
      root.style.setProperty('--my', `${s.y}px`)
      s.raf = Math.abs(s.tx - s.x) > 0.5 || Math.abs(s.ty - s.y) > 0.5 ? requestAnimationFrame(tick) : 0
    }

    const onMove = (e) => {
      if (s.x === OFF) {
        s.x = e.clientX
        s.y = e.clientY
      }
      s.tx = e.clientX
      s.ty = e.clientY
      queueCards()
      if (!s.raf) s.raf = requestAnimationFrame(tick)
    }

    // Kursor pəncərədən çıxanda (relatedTarget === null) işığı gizlət
    const onOut = (e) => {
      if (e.relatedTarget) return
      cancelAnimationFrame(s.raf)
      s.raf = 0
      s.tx = s.ty = s.x = s.y = OFF
      root.style.setProperty('--mx', `${OFF}px`)
      root.style.setProperty('--my', `${OFF}px`)
      queueCards()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', queueCards, { passive: true })
    window.addEventListener('pointerout', onOut)

    return () => {
      cancelAnimationFrame(s.raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', queueCards)
      window.removeEventListener('pointerout', onOut)
    }
  }, [])

  return <div aria-hidden="true" className="spotlight pointer-events-none fixed inset-0 z-0" />
}
