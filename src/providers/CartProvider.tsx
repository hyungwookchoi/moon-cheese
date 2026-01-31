import { create } from 'zustand';

export type CartItem = {
  productId: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  getItemQuantity: (productId: number) => number;
  getTotalQuantity: () => number;
  clearCart: () => void;
  removeProduct: (productId: number) => void;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],

  addItem: (productId: number) => {
    set(state => {
      const existingItem = state.items.find(item => item.productId === productId);
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { items: [...state.items, { productId, quantity: 1 }] };
    });
  },

  removeItem: (productId: number) => {
    set(state => {
      const existingItem = state.items.find(item => item.productId === productId);
      if (!existingItem || existingItem.quantity <= 1) {
        return { items: state.items.filter(item => item.productId !== productId) };
      }
      return {
        items: state.items.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
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
