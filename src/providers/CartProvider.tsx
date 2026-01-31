import { create } from 'zustand';

export type CartItem = {
  productId: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (params: { productId: number; quantity: number }) => void;
  removeItem: (params: { productId: number; quantity: number }) => void;
  getItemQuantity: (productId: number) => number;
  getTotalQuantity: () => number;
  clearCart: () => void;
  removeProduct: (productId: number) => void;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],

  addItem: ({ productId, quantity }) => {
    set(state => {
      const existingItem = state.items.find(item => item.productId === productId);
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      }
      return { items: [...state.items, { productId, quantity }] };
    });
  },

  removeItem: ({ productId, quantity }) => {
    set(state => {
      const existingItem = state.items.find(item => item.productId === productId);
      if (!existingItem || existingItem.quantity <= quantity) {
        return { items: state.items.filter(item => item.productId !== productId) };
      }
      return {
        items: state.items.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity - quantity } : item
        ),
      };
    });
  },

  removeProduct: (productId: number) => {
    set(state => ({ items: state.items.filter(item => item.productId !== productId) }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getItemQuantity: (productId: number) => {
    const item = get().items.find(item => item.productId === productId);
    return item?.quantity ?? 0;
  },

  getTotalQuantity: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
