import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import fs from 'fs'

// export default defineConfig({
//   plugins: [vue()],
//   server: {
//     https: {
//       key: fs.readFileSync('../../ssl/panicbot.xyz.key'),
//       cert: fs.readFileSync('../../ssl/panicbot_xyz.crt'),
//     },
//   },
//   define: {
//     'process.env': {}
//   }
// })

export default defineConfig({
  plugins: [vue()] 
})

