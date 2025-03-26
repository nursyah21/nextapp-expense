import {create} from 'zustand';

type UserIdStore = {
    userId: string | null;
    setUserId: (id: string) => void;
    getUserId: () => string | null;
    deleteUserId: () => void;
}

const useUserIdStore = create<UserIdStore>((set, get) => ({
    userId: null,
    setUserId: (id: string) => set({ userId: id }),
    getUserId: () => get().userId,
    deleteUserId: () => set({ userId: null }),
}));

export default useUserIdStore;