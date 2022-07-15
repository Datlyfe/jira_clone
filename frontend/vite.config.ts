import path from 'path'
import { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

const config: UserConfig = {
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [Vue()],
}

export default config
