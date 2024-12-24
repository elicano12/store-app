import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.VITE_APP_WOMPI_URL) {
  throw new Error('VITE_WOMPI_PUBLIC_KEY is not defined in .env');
}
if (!process.env.VITE_APP_WOMPI_PUBLIC_KEY) {
  throw new Error('VITE_WOMPI_URL is not defined in .env');
}
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
