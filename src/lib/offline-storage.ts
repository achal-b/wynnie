interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

export class OfflineStorageManager {
  private static readonly STORAGE_PREFIX = "wynnie_offline_";
  private static readonly CACHE_VERSION = "1.0.0";

  static isOnline(): boolean {
    return navigator.onLine;
  }

  static async setItem<T>(
    key: string,
    data: T,
    expiresInMs: number = 24 * 60 * 60 * 1000
  ): Promise<void> {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresIn: expiresInMs,
    };

    try {
      localStorage.setItem(
        `${this.STORAGE_PREFIX}${key}`,
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.warn("Failed to store offline data:", error);
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const cached = localStorage.getItem(`${this.STORAGE_PREFIX}${key}`);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const now = Date.now();

      // Check if cache has expired
      if (now - cacheItem.timestamp > cacheItem.expiresIn) {
        localStorage.removeItem(`${this.STORAGE_PREFIX}${key}`);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn("Failed to retrieve offline data:", error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(`${this.STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.warn("Failed to remove offline data:", error);
    }
  }

  static async clearExpiredCache(): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(this.STORAGE_PREFIX)
      );

      const now = Date.now();
      for (const key of keys) {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            const cacheItem: CacheItem<any> = JSON.parse(cached);
            if (now - cacheItem.timestamp > cacheItem.expiresIn) {
              localStorage.removeItem(key);
            }
          } catch {
            // Remove corrupted cache items
            localStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to clear expired cache:", error);
    }
  }

  static async cacheUserData(userData: any): Promise<void> {
    await this.setItem("user_data", userData, 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  static async getCachedUserData(): Promise<any | null> {
    return await this.getItem("user_data");
  }

  static async cacheRecentSearches(searches: string[]): Promise<void> {
    await this.setItem("recent_searches", searches, 30 * 24 * 60 * 60 * 1000); // 30 days
  }

  static async getCachedRecentSearches(): Promise<string[]> {
    return (await this.getItem<string[]>("recent_searches")) || [];
  }

  static async cacheCartItems(cartItems: any[]): Promise<void> {
    await this.setItem("cart_items", cartItems, 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  static async getCachedCartItems(): Promise<any[]> {
    return (await this.getItem<any[]>("cart_items")) || [];
  }

  static async cacheChatHistory(chatHistory: any[]): Promise<void> {
    await this.setItem("chat_history", chatHistory, 30 * 24 * 60 * 60 * 1000); // 30 days
  }

  static async getCachedChatHistory(): Promise<any[]> {
    return (await this.getItem<any[]>("chat_history")) || [];
  }

  static async cacheProductData(
    productId: string,
    productData: any
  ): Promise<void> {
    await this.setItem(
      `product_${productId}`,
      productData,
      24 * 60 * 60 * 1000
    ); // 24 hours
  }

  static async getCachedProductData(productId: string): Promise<any | null> {
    return await this.getItem(`product_${productId}`);
  }

  static async getStorageInfo(): Promise<{
    used: number;
    quota: number;
    available: number;
  }> {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
        available: (estimate.quota || 0) - (estimate.usage || 0),
      };
    }

    // Fallback for browsers that don't support Storage API
    const used = new Blob(Object.values(localStorage)).size;
    return {
      used,
      quota: 5 * 1024 * 1024, // Estimated 5MB quota
      available: 5 * 1024 * 1024 - used,
    };
  }
}
