import { atom } from 'recoil';
import { User } from '../types';

export const userState = atom<User | null>({
  key: 'userState',
  default: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
});

export const tokenState = atom<string | null>({
  key: 'tokenState',
  default: localStorage.getItem('token') ? localStorage.getItem('token') : null,
}); 