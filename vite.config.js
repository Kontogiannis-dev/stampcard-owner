import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const { KEY_PATH, CERT_PATH } = process.env
const https = KEY_PATH && CERT_PATH
    ? { key: fs.readFileSync(KEY_PATH), cert: fs.readFileSync(CERT_PATH) }
    : undefined

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    https,
  },
})