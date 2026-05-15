/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MainLayout } from './components/layout/MainLayout';

import { ThemeProvider } from './hooks/useTheme.tsx';

export default function App() {
  return (
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
  );
}
