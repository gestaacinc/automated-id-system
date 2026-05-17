import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If you rename the GitHub repo, change this to match the new repo name.
// For user/organization sites (repo named <user>.github.io), set base to '/'.
export default defineConfig({
  plugins: [react()],
  base: '/automated-id-system/',
})
