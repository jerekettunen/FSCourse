import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external access (e.g., from Docker)
    port: 5173, // Ensure the port matches your setup
    allowedHosts: ['app'], // Allow the hostname 'app'
  },
})
