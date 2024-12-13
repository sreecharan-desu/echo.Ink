import { RecoilRoot } from 'recoil';
import Router from './Router';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {

  return (
    <RecoilRoot>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </RecoilRoot>
  );
}
