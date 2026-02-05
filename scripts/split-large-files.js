#!/usr/bin/env node

/**
 * Split Large Files Script
 * 
 * This script splits files larger than 25MB into chunks of 24MB each,
 * generates manifest files with SHA-256 hashes, and removes the original files.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const MAX_FILE_SIZE = 26214400; // 25MB in bytes (25 * 1024 * 1024)
const CHUNK_SIZE = 25165824; // 24MB in bytes (24 * 1024 * 1024)

// Files to split (from problem statement)
const FILES_TO_SPLIT = [
    'games/backrooms2d/Build/7-21-23.data',
    'games/pakohighway/Build/phhh.data',
    'games/thesims3/Sims 3, The (Europe) (En,Fr,De,Es,It,Nl) (NDSi Enhanced).zip',
    'games/spirittracks/Legend of Zelda, The - Spirit Tracks (USA) (En,Fr,Es).zip',
    'games/advancewarsdayofruin/1964 - Advance Wars - Days of Ruin (USA) (En,Fr,Es).nds',
    'games/castlevaniadawnofsorrow/0121 - Castlevania - Dawn of Sorrow (USA).nds',
    'games/castlevaniaorderofecclesia/3092 - Castlevania - Order of Ecclesia (Europe) (En,Fr,De,Es,It).nds',
    'games/marioandluigipartnersintime/Mario & Luigi - Partners in Time (USA) (Rev 1).nds',
    'games/bowsersinsidestory/Mario & Luigi - Bowser\'s Inside Story (Europe) (En,Fr,De,Es,It).zip',
    'games/amazingropepolice/spider.data.unityweb',
    'games/pokemonsoulsilver/pokemon-soulsilver.zip',
    'games/thesims2/Sims 2, The (USA) (En,Fr,De,Es,It).zip',
    'games/professorlayton/Professor Layton and the Curious Village (USA).zip',
    'apps/v86/images/dsl-4.11.rc2.iso',
    'games/legobatman/LEGO Batman - The Videogame (Europe) (En,Fr,De,Es,It,Da).zip',
    'games/pokemonplatinum/pokemon-platinum.zip',
    'games/cars2/Cars 2 (Europe) (En,Es) (NDSi Enhanced) [b].zip',
    'games/tanukisunset/Build/WebGL.data.unityweb',
    'games/crimsonfantasia/Build/Crimson Fantasia [WebGL].data',
    'games/sonicrush/Sonic Rush (Europe) (En,Ja,Fr,De,Es,It).zip',
    'games/funnyshooter2/Build/FunnyShooter2_Poki.data.unityweb',
    'games/aceattorney/Phoenix Wright - Ace Attorney (Europe) (En,Fr).zip',
    'games/subwayrunner/Build/subway_runner_v3.data.unityweb',
    'games/funnymadracing/Build/TPG_FunnyMadRacing_V01a.data.unityweb',
    'games/fancypantsadventure3/FPAWorld3.swf',
    'games/run3plus/Build/Run3Edittor.data.unityweb',
    'games/fleeingthecomplex/5.swf',
    'games/subwaysurfers/062497be',
    'games/fnf/assets/videos/videos/toyCommercial.mp4',
    'games/banjotooie/Banjo-Tooie (USA).n64',
    'games/jetforcegemini/Jet Force Gemini (USA).n64',
    'games/baldisbasics/unity/baldi.data.unityweb',
    'games/crimsonfantasia/Build/Crimson Fantasia [WebGL].wasm',
    'games/townscaper/Build/WebGL.data',
    'games/infiltratingtheairship/infiltratingtheairship.swf',
    'games/rocketsoccer/RSD 1.1.0rc4.data.unityweb',
    'games/kirbypowerpaintbrush/Kirby - Power Paintbrush (Europe) (En,Fr,De,Es,It).zip',
    'games/aquaparkslides/Build/WaterParkSlides3Dx2.data.unityweb',
    'games/mariopartyds/Mario Party DS (Europe) (En,Fr,De,Es,It).zip',
    'games/subwaysurfers/Build/SanFrancisco/SanFrancisco.data.unityweb',
    'games/pokemondiamond/pokemon-diamond.zip',
    'games/donkeykong64/donkeykong64.zip',
    'games/majorasmask/Legend of Zelda, The - Majora\'s Mask (USA).zip',
    'games/pokemonstadium/Pokemon Stadium (USA) (Rev A).zip',
    'games/10minutestilldawn/Build/10MinutesTillDawnWebGL.data.unityweb',
    'games/ocarinaoftime/ocarinaoftime.zip',
    'games/rocketsoccer/RSD 1.1.0rc4.wasm.code.unityweb'
];

/**
 * Calculate SHA-256 hash of a file
 */
function calculateFileHash(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);

        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
}

/**
 * Split a file into chunks
 */
async function splitFile(filePath, repoRoot) {
    const fullPath = path.join(repoRoot, filePath);
    
    console.log(`\nProcessing: ${filePath}`);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
        console.log(`  ⚠️  File not found, skipping: ${fullPath}`);
        return false;
    }

    // Get file stats
    const stats = fs.statSync(fullPath);
    const fileSize = stats.size;

    console.log(`  Size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

    // Check if file needs to be split
    if (fileSize <= MAX_FILE_SIZE) {
        console.log(`  ℹ️  File is under 25MB, skipping`);
        return false;
    }

    // Calculate hash of original file
    console.log(`  🔍 Calculating hash...`);
    const fileHash = await calculateFileHash(fullPath);

    // Calculate number of chunks needed
    const numChunks = Math.ceil(fileSize / CHUNK_SIZE);
    console.log(`  📦 Splitting into ${numChunks} chunks...`);

    // Read and split the file
    const fileName = path.basename(filePath);
    const fileDir = path.dirname(fullPath);
    const chunks = [];

    const fileBuffer = fs.readFileSync(fullPath);
    
    for (let i = 0; i < numChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, fileSize);
        const chunkBuffer = fileBuffer.slice(start, end);
        
        const chunkName = `${fileName}.part${String(i).padStart(3, '0')}`;
        const chunkPath = path.join(fileDir, chunkName);
        
        fs.writeFileSync(chunkPath, chunkBuffer);
        chunks.push(chunkName);
        
        const chunkSizeMB = (chunkBuffer.length / 1024 / 1024).toFixed(2);
        console.log(`    ✓ Created ${chunkName} (${chunkSizeMB} MB)`);
    }

    // Create manifest
    const manifest = {
        filename: fileName,
        originalPath: filePath,
        size: fileSize,
        hash: fileHash,
        chunks: chunks,
        numChunks: numChunks,
        chunkSize: CHUNK_SIZE,
        createdAt: new Date().toISOString()
    };

    const manifestName = `${fileName}.manifest.json`;
    const manifestPath = path.join(fileDir, manifestName);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`  ✓ Created manifest: ${manifestName}`);

    // Delete original file
    fs.unlinkSync(fullPath);
    console.log(`  ✓ Deleted original file`);

    return true;
}

/**
 * Main function
 */
async function main() {
    const repoRoot = process.cwd();
    console.log(`Repository root: ${repoRoot}`);
    console.log(`Max file size: ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Chunk size: ${(CHUNK_SIZE / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Files to process: ${FILES_TO_SPLIT.length}`);

    let processed = 0;
    let skipped = 0;
    let errors = 0;

    for (const filePath of FILES_TO_SPLIT) {
        try {
            const result = await splitFile(filePath, repoRoot);
            if (result) {
                processed++;
            } else {
                skipped++;
            }
        } catch (error) {
            console.error(`  ❌ Error processing ${filePath}:`, error.message);
            errors++;
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Summary:`);
    console.log(`  ✓ Processed: ${processed}`);
    console.log(`  ⚠️  Skipped: ${skipped}`);
    console.log(`  ❌ Errors: ${errors}`);
    console.log(`${'='.repeat(60)}\n`);
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { splitFile, calculateFileHash };
