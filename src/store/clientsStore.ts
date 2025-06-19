// src/store/clientsStore.ts
import { create } from "zustand";

type Client = {
  name: string;
  email: string;
  birth: string;
  sales?: any[];
};

type ClientsState = {
  clients: Client[];
  addClient: (client: Client) => void;
};

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  addClient: (client) =>
    set((state) => ({ clients: [...state.clients, client] })),
}));
