/**
 * Data validation and transformation utilities
 */

/**
 * Validate required fields in an object
 */
export const validateRequired = <T extends Record<string, any>>(
  obj: T,
  requiredFields: (keyof T)[]
): { valid: boolean; missingFields: (keyof T)[] } => {
  const missingFields = requiredFields.filter((field) => !obj[field]);
  return {
    valid: missingFields.length === 0,
    missingFields,
  };
};

/**
 * Sanitize object by removing undefined/null values
 */
export const sanitizeObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null)
  ) as Partial<T>;
};

/**
 * Deep merge objects
 */
export const mergeObjects = <T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T => {
  const result = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        result[key as keyof T] = mergeObjects(
          result[key as keyof T] || {},
          value
        ) as any;
      } else {
        result[key as keyof T] = value as any;
      }
    }
  }

  return result;
};

/**
 * Pick specific fields from an object
 */
export const pickFields = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  fields: K[]
): Pick<T, K> => {
  return Object.fromEntries(
    fields.map((field) => [field, obj[field]])
  ) as Pick<T, K>;
};

/**
 * Omit specific fields from an object
 */
export const omitFields = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  fields: K[]
): Omit<T, K> => {
  const result = { ...obj };
  fields.forEach((field) => delete result[field]);
  return result as Omit<T, K>;
};

/**
 * Transform array of objects by mapping
 */
export const mapArray = <T, U>(items: T[], mapFn: (item: T, index: number) => U): U[] => {
  return items.map(mapFn);
};

/**
 * Filter array by predicate and return transformed results
 */
export const filterMap = <T, U>(
  items: T[],
  filterFn: (item: T) => boolean,
  mapFn: (item: T) => U
): U[] => {
  return items.filter(filterFn).map(mapFn);
};

/**
 * Convert timestamp to formatted date string
 */
export const formatTimestamp = (timestamp: number, locale = 'en-US'): string => {
  return new Date(timestamp).toLocaleString(locale);
};

/**
 * Calculate difference between two timestamps in milliseconds, seconds, minutes
 */
export const timeDifference = (
  timestamp1: number,
  timestamp2: number
): { ms: number; seconds: number; minutes: number; hours: number } => {
  const ms = Math.abs(timestamp2 - timestamp1);
  return {
    ms,
    seconds: Math.floor(ms / 1000),
    minutes: Math.floor(ms / 1000 / 60),
    hours: Math.floor(ms / 1000 / 60 / 60),
  };
};

/**
 * Clamp a number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Normalize a value between 0 and 1
 */
export const normalize = (value: number, min: number, max: number): number => {
  return clamp((value - min) / (max - min), 0, 1);
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (
  value: number,
  total: number,
  decimals = 2
): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
