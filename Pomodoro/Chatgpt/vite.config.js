import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/AI-Test/Pomodoro/ChatGPT', // remplaza <REPO> con el nombre del repositorio
  plugins: [react()],
});
