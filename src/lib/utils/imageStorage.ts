const IMAGE_STORAGE_KEY = "chat_images";
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit

interface StoredImage {
  id: string;
  base64: string;
  timestamp: number;
}

export function storeImage(imageId: string, base64Data: string) {
  try {
    const stored = getStoredImages();

    // Clean up old images if storage is full
    while (
      calculateStorageSize(stored) > MAX_STORAGE_SIZE &&
      stored.length > 0
    ) {
      stored.shift(); // Remove oldest image
    }

    stored.push({
      id: imageId,
      base64: base64Data,
      timestamp: Date.now(),
    });

    localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(stored));
    return true;
  } catch (error) {
    console.error("Error storing image:", error);
    return false;
  }
}

export function getStoredImage(imageId: string): string | null {
  try {
    const stored = getStoredImages();
    const image = stored.find((img) => img.id === imageId);
    return image?.base64 || null;
  } catch (error) {
    console.error("Error retrieving image:", error);
    return null;
  }
}

export function removeStoredImage(imageId: string) {
  try {
    const stored = getStoredImages();
    const filtered = stored.filter((img) => img.id !== imageId);
    localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing image:", error);
  }
}

function getStoredImages(): StoredImage[] {
  try {
    const stored = localStorage.getItem(IMAGE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function calculateStorageSize(stored: StoredImage[]): number {
  return new TextEncoder().encode(JSON.stringify(stored)).length;
}
