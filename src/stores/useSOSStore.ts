import { create } from 'zustand';

interface SOSAlert {
  senderId: string;
  senderName: string;
  latitude?: string;
  longitude?: string;
  timestamp: number;
}

interface SOSState {
  activeAlert: SOSAlert | null;
  setActiveAlert: (alert: SOSAlert | null) => void;
  clearAlert: () => void;
}

export const useSOSStore = create<SOSState>((set) => ({
  activeAlert: null,
  setActiveAlert: (alert) => set({ activeAlert: alert }),
  clearAlert: () => set({ activeAlert: null }),
}));
