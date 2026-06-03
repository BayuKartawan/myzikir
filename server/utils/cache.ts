interface GoogleApiResponse {
    status: string;
    data: Record<string, any>;
}

let cachedData: GoogleApiResponse | null = null;
let lastFetched = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 menit dalam milidetik

export function getZikirCache(): GoogleApiResponse | null {
    const now = Date.now();
    if (cachedData && (now - lastFetched < CACHE_TTL)) {
        return cachedData;
    }
    return null;
}

export function setZikirCache(data: GoogleApiResponse): void {
    cachedData = data;
    lastFetched = Date.now();
}

export function clearZikirCache(): void {
    cachedData = null;
    lastFetched = 0;
}
