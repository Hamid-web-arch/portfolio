import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Vercel mövcud olmayan ünvanlar üçün dist/404.html-i HTTP 404 statusu ilə qaytarır.
// Onu index.html-in surəti edirik ki, React yüklənsin və öz "Səhifə tapılmadı" səhifəsini göstərsin.
const spa404 = () => ({
  name: 'spa-404',
  apply: 'build',
  closeBundle() {
    const out = resolve(import.meta.dirname, 'dist')
    copyFileSync(resolve(out, 'index.html'), resolve(out, '404.html'))
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), spa404()],
})
