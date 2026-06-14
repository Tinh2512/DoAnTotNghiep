/**
 * Generic store helper functions for common operations
 */

/**
 * Add item to array with optional limit
 * Returns updated array with item prepended
 */
export const addItemToArray = <T extends { id?: string }>(
  items: T[],
  newItem: T,
  limit?: number
): T[] => {
  const updated = [newItem, ...items];
  return limit ? updated.slice(0, limit) : updated;
};

/**
 * Find item by ID
 */
export const findById = <T extends { id: string }>(
  items: T[],
  id: string
): T | undefined => {
  return items.find((item) => item.id === id);
};

/**
 * Find item by predicate
 */
export const findByPredicate = <T>(
  items: T[],
  predicate: (item: T) => boolean
): T | undefined => {
  return items.find(predicate);
};

/**
 * Filter items by predicate
 */
export const filterItems = <T>(
  items: T[],
  predicate: (item: T) => boolean
): T[] => {
  return items.filter(predicate);
};

/**
 * Update item in array by ID
 */
export const updateItemInArray = <T extends { id: string }>(
  items: T[],
  id: string,
  updates: Partial<T>
): T[] => {
  return items.map((item) =>
    item.id === id ? { ...item, ...updates } : item
  );
};

/**
 * Remove item from array by ID
 */
export const removeItemFromArray = <T extends { id: string }>(
  items: T[],
  id: string
): T[] => {
  return items.filter((item) => item.id !== id);
};

/**
 * Check if item exists in array
 */
export const itemExists = <T extends { id: string }>(
  items: T[],
  id: string
): boolean => {
  return items.some((item) => item.id === id);
};

/**
 * Get first N items
 */
export const getFirstN = <T>(items: T[], n: number): T[] => {
  return items.slice(0, n);
};

/**
 * Get last N items
 */
export const getLastN = <T>(items: T[], n: number): T[] => {
  return items.slice(-n);
};

/**
 * Combine multiple filter conditions
 */
export const combineFilters = <T>(
  items: T[],
  ...predicates: Array<(item: T) => boolean>
): T[] => {
  return items.filter((item) =>
    predicates.every((predicate) => predicate(item))
  );
};

/**
 * Group items by key
 */
export const groupByKey = <T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K
): Map<K, T[]> => {
  const groups = new Map<K, T[]>();
  items.forEach((item) => {
    const key = keyFn(item);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  });
  return groups;
};

/**
 * Sort items by key
 */
export const sortByKey = <T>(
  items: T[],
  keyFn: (item: T) => number | string,
  ascending = true
): T[] => {
  const sorted = [...items].sort((a, b) => {
    const aKey = keyFn(a);
    const bKey = keyFn(b);
    if (aKey < bKey) return ascending ? -1 : 1;
    if (aKey > bKey) return ascending ? 1 : -1;
    return 0;
  });
  return sorted;
};
