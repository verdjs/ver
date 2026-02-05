/**
 * Chunk Reassembler - Client-side file reassembly for large files split into chunks
 * 
 * This library handles the reassembly of large files that have been split into smaller chunks
 * to comply with Cloudflare Pages' 25MB per-file limit.
 */

class ChunkReassembler {
    constructor() {
        this.dbName = 'ChunkReassemblerCache';
        this.dbVersion = 1;
        this.db = null;
    }

    /**
     * Initialize IndexedDB for caching reassembled files
     */
    async initDB() {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('files')) {
                    db.createObjectStore('files', { keyPath: 'filename' });
                }
            };
        });
    }

    /**
     * Get a cached file from IndexedDB
     */
    async getCachedFile(filename) {
        await this.initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readonly');
            const store = transaction.objectStore('files');
            const request = store.get(filename);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Cache a reassembled file in IndexedDB
     */
    async cacheFile(filename, blob, hash) {
        await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readwrite');
            const store = transaction.objectStore('files');
            const request = store.put({
                filename: filename,
                blob: blob,
                hash: hash,
                timestamp: Date.now()
            });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Clear the cache (useful for debugging or freeing up space)
     */
    async clearCache() {
        await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readwrite');
            const store = transaction.objectStore('files');
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Calculate SHA-256 hash of a blob for verification
     */
    async calculateHash(blob) {
        const arrayBuffer = await blob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Fetch a chunk with retry logic
     */
    async fetchChunk(chunkUrl, retries = 3, retryDelay = 1000) {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await fetch(chunkUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.blob();
            } catch (error) {
                if (attempt === retries - 1) {
                    throw new Error(`Failed to fetch chunk ${chunkUrl} after ${retries} attempts: ${error.message}`);
                }
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
            }
        }
    }

    /**
     * Fetch and reassemble a file from its chunks
     * 
     * @param {string} manifestPath - Path to the manifest JSON file
     * @param {function} onProgress - Optional callback for progress updates (receives 0-100)
     * @param {boolean} useCache - Whether to use cached version if available (default: true)
     * @returns {Promise<Blob>} - The reassembled file as a Blob
     */
    async reassembleFile(manifestPath, onProgress = null, useCache = true) {
        try {
            // Fetch the manifest
            const manifestResponse = await fetch(manifestPath);
            if (!manifestResponse.ok) {
                throw new Error(`Failed to fetch manifest: ${manifestResponse.status}`);
            }
            const manifest = await manifestResponse.json();

            // Check cache first
            if (useCache) {
                const cached = await this.getCachedFile(manifest.filename);
                if (cached && cached.hash === manifest.hash) {
                    console.log(`Using cached version of ${manifest.filename}`);
                    if (onProgress) onProgress(100);
                    return cached.blob;
                }
            }

            // Calculate base path from manifest path
            const basePath = manifestPath.substring(0, manifestPath.lastIndexOf('/') + 1);

            // Fetch all chunks
            const chunks = [];
            const totalChunks = manifest.chunks.length;

            for (let i = 0; i < totalChunks; i++) {
                const chunkName = manifest.chunks[i];
                const chunkUrl = basePath + chunkName;

                if (onProgress) {
                    onProgress(Math.floor((i / totalChunks) * 90)); // Reserve last 10% for verification
                }

                const chunkBlob = await this.fetchChunk(chunkUrl);
                chunks.push(chunkBlob);
            }

            // Reassemble the file
            const reassembledBlob = new Blob(chunks);

            // Verify size
            if (reassembledBlob.size !== manifest.size) {
                throw new Error(
                    `Size mismatch: expected ${manifest.size} bytes, got ${reassembledBlob.size} bytes`
                );
            }

            if (onProgress) onProgress(95);

            // Verify hash
            const calculatedHash = await this.calculateHash(reassembledBlob);
            if (calculatedHash !== manifest.hash) {
                throw new Error(
                    `Hash mismatch: expected ${manifest.hash}, got ${calculatedHash}`
                );
            }

            // Cache the reassembled file
            await this.cacheFile(manifest.filename, reassembledBlob, manifest.hash);

            if (onProgress) onProgress(100);

            return reassembledBlob;

        } catch (error) {
            console.error('Error reassembling file:', error);
            throw error;
        }
    }

    /**
     * Create a download link for a reassembled file
     * 
     * @param {Blob} blob - The file blob
     * @param {string} filename - The filename for download
     * @returns {string} - Object URL for the blob
     */
    createDownloadUrl(blob, filename) {
        return URL.createObjectURL(blob);
    }

    /**
     * Trigger a download of a reassembled file
     * 
     * @param {Blob} blob - The file blob
     * @param {string} filename - The filename for download
     */
    downloadFile(blob, filename) {
        const url = this.createDownloadUrl(blob, filename);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChunkReassembler;
}

// Make available globally
if (typeof window !== 'undefined') {
    window.ChunkReassembler = ChunkReassembler;
}
