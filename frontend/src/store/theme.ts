import { atom, selector } from 'recoil';

export const themeState = atom<'light' | 'dark'>({
  key: 'themeState',
  default: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
});

export const isDarkMode = selector({
  key: 'isDarkMode',
  get: ({get}) => get(themeState) === 'dark',
}); 