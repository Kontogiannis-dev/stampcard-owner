import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    https: {
      key: fs.readFileSync(process.env.KEY_PATH),
      cert: fs.readFileSync(process.env.CERT_PATH),
    },
  },
})