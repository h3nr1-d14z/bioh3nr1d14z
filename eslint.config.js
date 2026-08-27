import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    // Component shadcn/ui sinh sẵn, không file nào được import (kiểm bằng grep,
    // và không file nào lọt vào bundle). Chúng gây 10/10 lỗi lint còn lại nên
    // `npm run lint` lúc nào cũng đỏ và mất tác dụng cảnh báo. Bỏ qua ở đây
    // thay vì xoá file, để còn dùng lại khi cần thêm component shadcn.
    // Tailwind cũng đã loại thư mục này khỏi content glob.
    'src/components/ui/**',
    'src/hooks/use-mobile.ts',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
