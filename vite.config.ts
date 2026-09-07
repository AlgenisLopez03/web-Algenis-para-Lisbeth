import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { copyFile, mkdir } from 'node:fs/promises'
import { defineConfig } from 'vite'

const hostingWorker = () => ({
  name: 'hosting-worker',
  apply: 'build' as const,
  async closeBundle() {
    await mkdir('dist/server', { recursive: true })
    await copyFile('worker/index.js', 'dist/server/index.js')
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    hostingWorker(),
  ],
  build: {
    outDir: 'dist/client',
  },
})
