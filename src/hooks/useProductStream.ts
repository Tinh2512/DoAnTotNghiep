import { getApiClient } from '@/services/api';
import { useProductStore } from '@/store/product-store';
import { ProductResult } from '@/types';
import { executeAsyncOperation, getErrorMessage } from '@/utils';
import { useEffect, useState } from 'react';

interface UseProductStreamReturn {
  isLoading: boolean;
  error: string | null;
  products: ProductResult[];
  currentProduct: ProductResult | null;
  refreshProducts: () => Promise<void>;
}

export const useProductStream = (): UseProductStreamReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const products = useProductStore((state) => state.products);
  const currentProduct = useProductStore((state) => state.currentProduct);
  const apiClient = getApiClient();

  const updateState = (loading: boolean, err: any) => {
    setIsLoading(loading);
    setError(err ? getErrorMessage(err) : null);
  };

  const refreshProducts = async () => {
    await executeAsyncOperation(
      async () => {
        const response = await apiClient.getProductsHistory(50);
        if (response.data) {
          const productStore = useProductStore.getState();
          response.data.forEach((product) => {
            if (!productStore.getProductById(product.id)) {
              productStore.addProduct(product);
            }
          });
        }
      },
      updateState
    );
  };

  useEffect(() => {
    // Initial load
    refreshProducts();

    // Poll for new products every 5 seconds
    const interval = setInterval(() => {
      refreshProducts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    isLoading,
    error,
    products,
    currentProduct,
    refreshProducts,
  };
};
