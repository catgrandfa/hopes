import autoprefixer from 'autoprefixer'
import tailwindcss from './lib/tailwind-postcss.js'

export default {
  plugins: [tailwindcss(), autoprefixer()],
}
