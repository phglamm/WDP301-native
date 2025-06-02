import { create } from 'zustand';
import { getMySonService } from '../services/parentServices';

export const useParentStore = create((set) => ({
  mySon: null,
  isLoading: false,
  error: null,

  getMySon: async () => {
    set({ isLoading: true });
    try {
      const response = await getMySonService();
      if (response.code === 200 && response.status) {
        set({ mySon: response.data });
      } else {
        throw new Error('Lấy danh sách con thất bại');
      }
      return response;
    } catch (error) {
      console.log('Error at useParentStore: ', error);
      set({
        error: error?.message || 'Lấy danh sách con thất bại',
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
