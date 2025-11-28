import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'local_admin' | 'worker' | 'citizen';

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
  journeyStarted?: boolean;
  workerLat?: number;
  workerLng?: number;
}

interface CitizenNotification {
  id: string;
  message: string;
  destination: string;
  allotmentId: string;
  createdAt: string;
  dismissed: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'worker';
  timestamp: Date;
}

interface AuthState {
  user: User | null;
  allotments: Allotment[];
  citizenNotifications: CitizenNotification[];
  chatMessages: { [key: string]: ChatMessage[] };
  setUser: (user: User | null) => void;
  logout: () => void;
  addAllotment: (allotment: Omit<Allotment, 'id' | 'createdAt'>) => void;
  updateAllotmentStatus: (id: string, status: Allotment['status']) => void;
  getAllotments: () => Allotment[];
  addCitizenNotification: (notification: Omit<CitizenNotification, 'id' | 'createdAt' | 'dismissed'>) => void;
  dismissCitizenNotification: (id: string) => void;
  getCitizenNotifications: () => CitizenNotification[];
  startJourney: (allotmentId: string, lat: number, lng: number) => void;
  updateWorkerLocation: (allotmentId: string, lat: number, lng: number) => void;
  addMessage: (chatKey: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  getMessages: (chatKey: string) => ChatMessage[];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      allotments: [],
      citizenNotifications: [],
      chatMessages: {},
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
      getAllotments: () => get().allotments,
      addCitizenNotification: (notification) => set((state) => ({
        citizenNotifications: [...state.citizenNotifications, {
          ...notification,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          dismissed: false
        }]
      })),
      dismissCitizenNotification: (id) => set((state) => ({
        citizenNotifications: state.citizenNotifications.map(n =>
          n.id === id ? { ...n, dismissed: true } : n
        )
      })),
      getCitizenNotifications: () => get().citizenNotifications.filter(n => !n.dismissed),
      startJourney: (allotmentId, lat, lng) => set((state) => ({
        allotments: state.allotments.map(a =>
          a.id === allotmentId ? { ...a, journeyStarted: true, workerLat: lat, workerLng: lng } : a
        )
      })),
      updateWorkerLocation: (allotmentId, lat, lng) => set((state) => ({
        allotments: state.allotments.map(a =>
          a.id === allotmentId ? { ...a, workerLat: lat, workerLng: lng } : a
        )
      })),
      addMessage: (chatKey, message) => set((state) => ({
        chatMessages: {
          ...state.chatMessages,
          [chatKey]: [...(state.chatMessages[chatKey] || []), {
            ...message,
            id: crypto.randomUUID(),
            timestamp: new Date()
          }]
        }
      })),
      getMessages: (chatKey) => get().chatMessages[chatKey] || []
    }),
    { name: 'hazguard-auth' }
  )
);
