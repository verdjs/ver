#!/usr/bin/env node

/**
 * Script to fetch GN Math games and add them to Verdis
 * This script will:
 * 1. Fetch the zones.json from GN Math
 * 2. Check for duplicates against existing Verdis games
 * 3. Generate game entries for games/index.html
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ZONES_URL = 'https://cdn.jsdelivr.net/gh/gn-math/assets@main/zones.json';
const COVER_URL = 'https://cdn.jsdelivr.net/gh/gn-math/covers@main';
const HTML_URL = 'https://cdn.jsdelivr.net/gh/gn-math/html@main';

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function normalizeGameName(name) {
    // Convert game name to directory-friendly format
    return name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '');
}

async function main() {
    console.log('Fetching GN Math games list...');
    
    try {
        const zones = await fetchJSON(ZONES_URL);
        console.log(`Found ${zones.length} games from GN Math`);
        
        // Get existing game directories
        const gamesDir = path.join(__dirname, '..', 'games');
        const existingGames = fs.readdirSync(gamesDir)
            .filter(f => fs.statSync(path.join(gamesDir, f)).isDirectory());
        
        console.log(`Found ${existingGames.length} existing games in Verdis`);
        
        // Filter out duplicates and special entries
        const newGames = zones.filter(zone => {
            const normalizedName = normalizeGameName(zone.name);
            const isDuplicate = existingGames.includes(normalizedName);
            const isExternal = zone.url && zone.url.startsWith('http');
            return !isDuplicate && !isExternal;
        });
        
        console.log(`${newGames.length} new games to add (after filtering duplicates and external links)`);
        
        // Output game data as JSON for further processing
        const outputPath = path.join(__dirname, 'gnmath-games.json');
        fs.writeFileSync(outputPath, JSON.stringify(newGames, null, 2));
        console.log(`Game data saved to ${outputPath}`);
        
        // Generate summary
        console.log('\n=== Summary ===');
        console.log(`Total GN Math games: ${zones.length}`);
        console.log(`Existing Verdis games: ${existingGames.length}`);
        console.log(`New games to add: ${newGames.length}`);
        console.log(`Skipped (duplicates or external): ${zones.length - newGames.length}`);
        
        if (newGames.length > 0) {
            console.log('\n=== Sample of new games ===');
            newGames.slice(0, 10).forEach(game => {
                console.log(`  - ${game.name} (ID: ${game.id})`);
            });
        }
        
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
