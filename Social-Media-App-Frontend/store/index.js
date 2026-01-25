import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import createAuthSlice from './Auth_Slice.js';

const useStore = create(
  devtools(
    immer((set, get) => ({
      authSlice: createAuthSlice(set, get),
      authType: 'token',
    })),
  ),
);

export default useStore;
