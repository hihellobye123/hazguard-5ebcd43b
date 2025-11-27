import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'local_admin' | 'worker';

interface User {
  name: string;
  phone: string;
  role: UserRole;
}

interface Allotment {
  id: string;
  disasterId: string;
  disasterTitle: string;
  location: string;
  workers: { name: string; phone: string }[];
  pickupLocation: string;
  destinationLocation: string;
  products: { name: string; quantity: number; pricePerUnit: number }[];
  totalCost: number;
  status: 'pending_local' | 'pending_main' | 'approved' | 'rejected';
  createdAt: string;
  createdBy: string;
}

interface AuthState {
  user: User | null;
  allotments: Allotment[];
  setUser: (user: User | null) => void;
  logout: () => void;
  addAllotment: (allotment: Omit<Allotment, 'id' | 'createdAt'>) => void;
  updateAllotmentStatus: (id: string, status: Allotment['status']) => void;
  getAllotments: () => Allotment[];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      allotments: [],
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      addAllotment: (allotment) => set((state) => ({
        allotments: [...state.allotments, {
          ...allotment,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        }]
      })),
      updateAllotmentStatus: (id, status) => set((state) => ({
        allotments: state.allotments.map(a => 
          a.id === id ? { ...a, status } : a
        )
      })),
      getAllotments: () => get().allotments
    }),
    { name: 'hazguard-auth' }
  )
);
