import { PAGINATION } from '@/constants/config';
import { Classification, ProductResult } from '@/types';
import { addItemToArray, combineFilters, findById, getFirstN } from '@/utils';
import { create } from 'zustand';

interface ProductStore {
  // State
  products: ProductResult[]; // Last N products
  currentProduct: ProductResult | null;
  historyFilter: {
    dateRange: [number, number];
    classification: 'ALL' | Classification;
  };
  
  // Actions
  addProduct: (product: ProductResult) => void;
  setCurrentProduct: (product: ProductResult | null) => void;
  clearHistory: () => void;
  setFilter: (filter: Partial<ProductStore['historyFilter']>) => void;
  getFilteredProducts: () => ProductResult[];
  getProductById: (id: string) => ProductResult | undefined;
  getRecentProducts: (limit?: number) => ProductResult[];
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  currentProduct: null,
  historyFilter: {
    dateRange: [0, Date.now()],
    classification: 'ALL',
  },

  addProduct: (product) =>
    set((state) => ({
      products: addItemToArray(state.products, product, PAGINATION.HISTORY_LIMIT),
      currentProduct: product,
    })),

  setCurrentProduct: (product) =>
    set({
      currentProduct: product,
    }),

  clearHistory: () =>
    set({
      products: [],
      currentProduct: null,
    }),

  setFilter: (filter) =>
    set((state) => ({
      historyFilter: {
        ...state.historyFilter,
        ...filter,
      },
    })),

  getFilteredProducts: () => {
    const state = get();
    const inDateRange = (product: ProductResult) =>
      product.timestamp >= state.historyFilter.dateRange[0] &&
      product.timestamp <= state.historyFilter.dateRange[1];
    
    const matchesClassification = (product: ProductResult) =>
      state.historyFilter.classification === 'ALL' ||
      product.classification === state.historyFilter.classification;

    return combineFilters(state.products, inDateRange, matchesClassification);
  },

  getProductById: (id) => {
    const state = get();
    return findById(state.products, id);
  },

  getRecentProducts: (limit = 10) => {
    const state = get();
    return getFirstN(state.products, limit);
  },
}));

// Selector hooks
export const useCurrentProduct = () => useProductStore((state) => state.currentProduct);
export const useProducts = () => useProductStore((state) => state.products);
export const useProductFilter = () => useProductStore((state) => state.historyFilter);
export const useFilteredProducts = () => useProductStore((state) => state.getFilteredProducts());
