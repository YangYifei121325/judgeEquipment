import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   allowedHosts: ['localhost:5173', 'allowed-jackal-lively.ngrok-free.app'],
  // },
  base:"/judgeEquipment/",
  build: {
    outDir: "docs",
  }

})
