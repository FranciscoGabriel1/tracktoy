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
  updateClient: (client: Client) => void;
};

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  addClient: (client) =>
    set((state) => ({ clients: [...state.clients, client] })),
  updateClient: (updatedClient) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c.email === updatedClient.email ? { ...c, ...updatedClient } : c
      ),
    })),
}));
