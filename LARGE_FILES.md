# Large Files Management

## Overview

This repository contains large game files and assets that exceed Cloudflare Pages' 25MB per-file deployment limit. To work around this limitation while maintaining fork independence (avoiding Git LFS), we've implemented a client-side file reassembly system.

## Why Files Were Split

Cloudflare Pages has a **25MB per-file limit** for deployments. This repository originally contained 47 files exceeding this limit, ranging from 25.39MB to 77.5MB. To enable successful deployment while keeping the repository self-contained and fork-friendly, these files have been split into smaller chunks.

## How It Works

### File Splitting

Large files (>25MB) are split into chunks of **maximum 24MB** each. For each split file:

1. **Chunks**: Original file is divided into sequential chunks named `{filename}.part000`, `{filename}.part001`, etc.
2. **Manifest**: A JSON manifest file (`{filename}.manifest.json`) is created containing:
   - Original filename and path
   - Total file size
   - SHA-256 hash (for integrity verification)
   - List of chunk filenames in order
   - Metadata (creation date, chunk size, etc.)
3. **Original Removal**: The original large file is deleted to save space and ensure deployment compatibility

### Client-Side Reassembly

When a game or app needs a split file, the reassembly happens automatically in the user's browser:

1. **Fetch Manifest**: The manifest JSON is loaded first
2. **Download Chunks**: All chunks are fetched in order with retry logic
3. **Reassemble**: Chunks are concatenated into a single Blob
4. **Verify**: SHA-256 hash is calculated and compared with manifest
5. **Cache**: Reassembled file is stored in IndexedDB for future use
6. **Use**: File is made available to the game/app as a Blob URL

## Reassembly Library

The `scripts/chunk-reassembler.js` library provides:

### Basic Usage

```javascript
// Initialize the reassembler
const reassembler = new ChunkReassembler();

// Reassemble a file with progress tracking
const blob = await reassembler.reassembleFile(
    'games/example/largefile.bin.manifest.json',
    (progress) => console.log(`Progress: ${progress}%`),
    true // use cache
);

// Create a URL for the reassembled file
const url = reassembler.createDownloadUrl(blob, 'largefile.bin');

// Or trigger a download
reassembler.downloadFile(blob, 'largefile.bin');
```

### Features

- **Progress Callbacks**: Track download and reassembly progress (0-100%)
- **IndexedDB Caching**: Reassembled files are cached locally to avoid re-downloading
- **Retry Logic**: Automatic retry with exponential backoff for failed chunk downloads
- **Hash Verification**: SHA-256 verification ensures file integrity
- **Error Handling**: Comprehensive error messages for debugging

### API Reference

#### `reassembleFile(manifestPath, onProgress, useCache)`

Fetches and reassembles a file from its chunks.

- **manifestPath** (string): Path to the manifest JSON file
- **onProgress** (function, optional): Callback receiving progress (0-100)
- **useCache** (boolean, optional): Whether to use cached version (default: true)
- **Returns**: Promise<Blob> - The reassembled file

#### `getCachedFile(filename)`

Retrieves a cached file from IndexedDB.

- **filename** (string): Original filename
- **Returns**: Promise<Object|undefined> - Cached file data or undefined

#### `clearCache()`

Clears all cached reassembled files from IndexedDB.

- **Returns**: Promise<void>

#### `createDownloadUrl(blob, filename)`

Creates an object URL for a blob.

- **blob** (Blob): The file blob
- **filename** (string): The filename
- **Returns**: string - Object URL

#### `downloadFile(blob, filename)`

Triggers a browser download of the reassembled file.

- **blob** (Blob): The file blob
- **filename** (string): Download filename

## Adding New Large Files

If you need to add a new file that exceeds 25MB:

### 1. Add the File Path to the Script

Edit `scripts/split-large-files.js` and add your file path to the `FILES_TO_SPLIT` array:

```javascript
const FILES_TO_SPLIT = [
    // ... existing files ...
    'games/yournewgame/largefile.bin',
];
```

### 2. Run the Splitting Script

```bash
cd /home/runner/work/ver/ver
node scripts/split-large-files.js
```

This will:
- Split your file into 24MB chunks
- Generate a manifest with SHA-256 hash
- Delete the original file

### 3. Update Your Game/App Code

Modify your game's loading code to use the reassembler:

```javascript
// Load the chunk-reassembler library
const script = document.createElement('script');
script.src = '/scripts/chunk-reassembler.js';
document.head.appendChild(script);

script.onload = async () => {
    const reassembler = new ChunkReassembler();
    
    // Show loading progress
    const progressDiv = document.getElementById('loading-progress');
    
    const blob = await reassembler.reassembleFile(
        'games/yournewgame/largefile.bin.manifest.json',
        (progress) => {
            progressDiv.textContent = `Loading: ${progress}%`;
        }
    );
    
    // Use the reassembled file
    const url = reassembler.createDownloadUrl(blob, 'largefile.bin');
    // ... initialize your game with the URL ...
};
```

### 4. Commit Changes

Commit the chunks, manifest, and any code changes:

```bash
git add games/yournewgame/largefile.bin.part*
git add games/yournewgame/largefile.bin.manifest.json
git add games/yournewgame/index.html  # or whatever files you modified
git commit -m "Split largefile.bin for Cloudflare Pages compatibility"
```

## Split Files List

The following 47 files have been split into chunks:

1. `games/backrooms2d/Build/7-21-23.data` (77.5 MB) → 4 chunks
2. `games/pakohighway/Build/phhh.data` (73.51 MB) → 4 chunks
3. `games/thesims3/Sims 3, The (Europe) (En,Fr,De,Es,It,Nl) (NDSi Enhanced).zip` (66.85 MB) → 3 chunks
4. `games/spirittracks/Legend of Zelda, The - Spirit Tracks (USA) (En,Fr,Es).zip` (66.53 MB) → 3 chunks
5. `games/advancewarsdayofruin/1964 - Advance Wars - Days of Ruin (USA) (En,Fr,Es).nds` (64 MB) → 3 chunks
6. `games/castlevaniadawnofsorrow/0121 - Castlevania - Dawn of Sorrow (USA).nds` (64 MB) → 3 chunks
7. `games/castlevaniaorderofecclesia/3092 - Castlevania - Order of Ecclesia (Europe) (En,Fr,De,Es,It).nds` (64 MB) → 3 chunks
8. `games/marioandluigipartnersintime/Mario & Luigi - Partners in Time (USA) (Rev 1).nds` (64 MB) → 3 chunks
9. `games/bowsersinsidestory/Mario & Luigi - Bowser's Inside Story (Europe) (En,Fr,De,Es,It).zip` (62.85 MB) → 3 chunks
10. `games/amazingropepolice/spider.data.unityweb` (62.75 MB) → 3 chunks
11. `games/pokemonsoulsilver/pokemon-soulsilver.zip` (57.95 MB) → 3 chunks
12. `games/thesims2/Sims 2, The (USA) (En,Fr,De,Es,It).zip` (54.98 MB) → 3 chunks
13. `games/professorlayton/Professor Layton and the Curious Village (USA).zip` (50.92 MB) → 3 chunks
14. `apps/v86/images/dsl-4.11.rc2.iso` (50.38 MB) → 3 chunks
15. `games/legobatman/LEGO Batman - The Videogame (Europe) (En,Fr,De,Es,It,Da).zip` (48.56 MB) → 3 chunks
16. `games/pokemonplatinum/pokemon-platinum.zip` (48.43 MB) → 3 chunks
17. `games/cars2/Cars 2 (Europe) (En,Es) (NDSi Enhanced) [b].zip` (47.51 MB) → 2 chunks
18. `games/tanukisunset/Build/WebGL.data.unityweb` (46.89 MB) → 2 chunks
19. `games/crimsonfantasia/Build/Crimson Fantasia [WebGL].data` (45.94 MB) → 2 chunks
20. `games/sonicrush/Sonic Rush (Europe) (En,Ja,Fr,De,Es,It).zip` (42.91 MB) → 2 chunks
21. `games/funnyshooter2/Build/FunnyShooter2_Poki.data.unityweb` (40.32 MB) → 2 chunks
22. `games/aceattorney/Phoenix Wright - Ace Attorney (Europe) (En,Fr).zip` (38.1 MB) → 2 chunks
23. `games/subwayrunner/Build/subway_runner_v3.data.unityweb` (35.94 MB) → 2 chunks
24. `games/funnymadracing/Build/TPG_FunnyMadRacing_V01a.data.unityweb` (35.89 MB) → 2 chunks
25. `games/fancypantsadventure3/FPAWorld3.swf` (33.72 MB) → 2 chunks
26. `games/run3plus/Build/Run3Edittor.data.unityweb` (33.59 MB) → 2 chunks
27. `games/fleeingthecomplex/5.swf` (32.93 MB) → 2 chunks
28. `games/subwaysurfers/062497be` (32.76 MB) → 2 chunks
29. `games/fnf/assets/videos/videos/toyCommercial.mp4` (32.09 MB) → 2 chunks
30. `games/banjotooie/Banjo-Tooie (USA).n64` (32 MB) → 2 chunks
31. `games/jetforcegemini/Jet Force Gemini (USA).n64` (32 MB) → 2 chunks
32. `games/baldisbasics/unity/baldi.data.unityweb` (31.21 MB) → 2 chunks
33. `games/crimsonfantasia/Build/Crimson Fantasia [WebGL].wasm` (30.95 MB) → 2 chunks
34. `games/townscaper/Build/WebGL.data` (30.89 MB) → 2 chunks
35. `games/infiltratingtheairship/infiltratingtheairship.swf` (28.4 MB) → 2 chunks
36. `games/rocketsoccer/RSD 1.1.0rc4.data.unityweb` (28.35 MB) → 2 chunks
37. `games/kirbypowerpaintbrush/Kirby - Power Paintbrush (Europe) (En,Fr,De,Es,It).zip` (28.19 MB) → 2 chunks
38. `games/aquaparkslides/Build/WaterParkSlides3Dx2.data.unityweb` (27.08 MB) → 2 chunks
39. `games/mariopartyds/Mario Party DS (Europe) (En,Fr,De,Es,It).zip` (26.89 MB) → 2 chunks
40. `games/subwaysurfers/Build/SanFrancisco/SanFrancisco.data.unityweb` (26.68 MB) → 2 chunks
41. `games/pokemondiamond/pokemon-diamond.zip` (26.63 MB) → 2 chunks
42. `games/donkeykong64/donkeykong64.zip` (26.58 MB) → 2 chunks
43. `games/majorasmask/Legend of Zelda, The - Majora's Mask (USA).zip` (26.54 MB) → 2 chunks
44. `games/pokemonstadium/Pokemon Stadium (USA) (Rev A).zip` (26.53 MB) → 2 chunks
45. `games/10minutestilldawn/Build/10MinutesTillDawnWebGL.data.unityweb` (26.08 MB) → 2 chunks
46. `games/ocarinaoftime/ocarinaoftime.zip` (25.75 MB) → 2 chunks
47. `games/rocketsoccer/RSD 1.1.0rc4.wasm.code.unityweb` (25.39 MB) → 2 chunks

## Technical Details

- **Chunk Size**: 24MB (25,165,824 bytes)
- **Threshold**: Files over 25MB (26,214,400 bytes) are split
- **Hash Algorithm**: SHA-256 for file integrity verification
- **Cache Storage**: IndexedDB for persistent client-side caching
- **Compatibility**: Works in all modern browsers supporting IndexedDB and Crypto API

## Benefits

1. **Cloudflare Pages Compatible**: All chunks are under the 25MB limit
2. **No Git LFS**: Keeps repository self-contained and fork-friendly
3. **Client-Side**: No server-side processing needed
4. **Cached**: Files are cached locally after first download
5. **Verified**: SHA-256 ensures file integrity
6. **Transparent**: Games/apps work seamlessly after initial setup

## Troubleshooting

### Cache Issues

If you experience issues with cached files:

```javascript
const reassembler = new ChunkReassembler();
await reassembler.clearCache();
// Then reload the page
```

### Hash Verification Failures

If hash verification fails, it usually indicates:
- Corrupted download
- Incomplete chunk transfer
- Modified chunk files

The reassembler will automatically retry failed chunks up to 3 times.

### Performance

- First load: Downloads all chunks (can take time for large files)
- Subsequent loads: Instant from IndexedDB cache
- Network: Chunks are downloaded in sequence (not parallel) to avoid overwhelming the connection

## Maintenance

- **Regular Testing**: Test reassembly functionality after deploying changes
- **Cache Clearing**: Clear browser cache/IndexedDB when updating split files
- **Monitoring**: Check browser console for reassembly errors or warnings
