#!/usr/bin/env node

/**
 * Script to add GN Math games to Verdis
 * Since we can't fetch zones.json externally, this uses a curated list
 * of popular GN Math games and creates wrapper pages for them
 */

const fs = require('fs');
const path = require('path');

// Popular GN Math games (sample list - would normally come from zones.json)
// Format: { id, name, genre, special tags }
const GNMATH_GAMES = [
    { id: 1, name: "Drive Mad", genre: "arcade", tags: ["popular", "driving"] },
    { id: 2, name: "Crazy Cattle 3D", genre: "arcade", tags: ["3d"] },
    { id: 3, name: "Moto X3M", genre: "arcade", tags: ["popular", "driving"] },
    { id: 4, name: "Tunnel Rush", genre: "arcade", tags: ["popular", "3d"] },
    { id: 5, name: "Vex 5", genre: "platformer", tags: ["popular"] },
    { id: 6, name: "Vex 6", genre: "platformer", tags: ["popular"] },
    { id: 7, name: "Vex 7", genre: "platformer", tags: ["popular"] },
    { id: 8, name: "Slope", genre: "arcade", tags: ["popular", "3d"] },
    { id: 9, name: "Run 3", genre: "platformer", tags: ["popular"] },
    { id: 10, name: "Geometry Dash", genre: "platformer", tags: ["popular"] },
];

function normalizeGameName(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '');
}

function createGameHTML(game) {
    const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${game.name} | Verdis</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #000;
        }
        iframe {
            border: none;
            width: 100%;
            height: 100vh;
            display: block;
        }
        .loader {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-family: Arial, sans-serif;
            font-size: 20px;
        }
    </style>
</head>
<body>
    <div class="loader">Loading ${game.name}...</div>
    <iframe id="gameFrame" allow="fullscreen"></iframe>
    
    <script>
        // Load game from GN Math CDN
        const gameId = ${game.id};
        const gnmathURL = 'https://cdn.jsdelivr.net/gh/gn-math/html@main/' + gameId + '.html';
        
        window.addEventListener('DOMContentLoaded', function() {
            const iframe = document.getElementById('gameFrame');
            iframe.src = gnmathURL;
            
            iframe.onload = function() {
                document.querySelector('.loader').style.display = 'none';
            };
        });
    </script>
</body>
</html>`;
    return template;
}

async function main() {
    const gamesDir = path.join(__dirname, '..', 'games');
    const existingGames = fs.readdirSync(gamesDir)
        .filter(f => {
            const fullPath = path.join(gamesDir, f);
            return fs.statSync(fullPath).isDirectory();
        });
    
    console.log(`Found ${existingGames.length} existing games`);
    
    let added = 0;
    let skipped = 0;
    
    for (const game of GNMATH_GAMES) {
        const dirName = normalizeGameName(game.name);
        
        // Check if game already exists
        if (existingGames.includes(dirName)) {
            console.log(`⏭️  Skipping "${game.name}" - already exists`);
            skipped++;
            continue;
        }
        
        // Create game directory
        const gameDir = path.join(gamesDir, dirName);
        fs.mkdirSync(gameDir, { recursive: true });
        
        // Create index.html
        const htmlContent = createGameHTML(game);
        const htmlPath = path.join(gameDir, 'index.html');
        fs.writeFileSync(htmlPath, htmlContent);
        
        console.log(`✅ Added "${game.name}" (${dirName})`);
        added++;
    }
    
    console.log(`\n=== Summary ===`);
    console.log(`Games added: ${added}`);
    console.log(`Games skipped (duplicates): ${skipped}`);
    console.log(`\nNext steps:`);
    console.log(`1. Add game entries to games/index.html`);
    console.log(`2. Add thumbnail images to images/thumbnails/`);
    console.log(`3. Test the games load correctly`);
}

main().catch(console.error);
