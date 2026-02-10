// open in new tab setting
document.addEventListener('DOMContentLoaded', () => {
    function cookie(name, value = null, days = null) {
        if (value !== null) {
            let expires = "";
            if (days) {
                let date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        } else {
            let cookieArr = document.cookie.split(';');
            for (let i = 0; i < cookieArr.length; i++) {
                let cookiePair = cookieArr[i].split('=');
                if (name === cookiePair[0].trim()) {
                    return decodeURIComponent(cookiePair[1]);
                }
            }
            return null;
        }
    }

    let openBlankCookie = cookie('open-blank');
    if (openBlankCookie === null) {
        openBlankCookie = 'true';
        cookie('open-blank', openBlankCookie, 365);
    }

    if (openBlankCookie === 'false') {
        let anchorTags = document.querySelectorAll('a[target="_blank"]');
        
        anchorTags.forEach(anchor => {
            anchor.removeAttribute('target');
        });
    }
});

// search bar
function filterGames() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const buttons = document.querySelectorAll('.button h2');

    buttons.forEach(button => {
        const gameName = button.textContent.toLowerCase();
        const buttonContainer = button.parentElement.parentElement;

        if (gameName.includes(searchInput)) {
            buttonContainer.style.display = 'block'; 
        } else {
            buttonContainer.style.display = 'none';
        }
    });
}

document.getElementById('search').addEventListener('input', filterGames);

// genre filtering
const genreDropdown = document.getElementById('genreDropdown');

genreDropdown.addEventListener('change', () => {
    const selectedGenre = genreDropdown.value;
    const buttons = document.querySelectorAll('.button');
    
    buttons.forEach(button => {
        const dataGenre = button.getAttribute('data-genre');
        
        if (selectedGenre === 'all' || selectedGenre === dataGenre) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
});

genreDropdown.value = 'all';

// cool typing
const text = "games";
const typingDelay = 500; 
const initialDelay = 100; 
const cursor = document.getElementById("cursor");
const h1 = document.querySelector(".typewriter");

function type() {
setTimeout(() => {
    for (let i = 0; i < text.length; i++) {
    setTimeout(() => {
        h1.textContent += text[i];
        if (i === text.length - 1) {
        cursor.style.display = "none"; 
        }
    }, i * typingDelay);
    }
}, initialDelay);
}

type();

// open in blank tab
document.addEventListener('DOMContentLoaded', function() {
    var openBlankLink = document.getElementById('openBlankLink');

    openBlankLink.addEventListener('click', function(event) {
        event.preventDefault();

        var newTab = window.open('about:blank', '_blank');

        if (newTab) {
            var newTabBody = newTab.document.body;
            newTabBody.style.padding = '0';
            newTabBody.style.margin = '0';
            newTabBody.style.border = 'hidden';

            var iframe = document.createElement('iframe');
            iframe.src = window.location.href;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'hidden';

            iframe.onload = function() {
                var links = iframe.contentDocument.querySelectorAll('a[target="_blank"]');
                links.forEach(function(link) {
                    link.addEventListener('click', function(event) {
                        event.preventDefault();
                        iframe.contentWindow.location.href = link.href;
                    });
                });
            };

            newTab.document.body.appendChild(iframe);
        } else {
            alert("couldn't manage to open a new tab :(");
        }
    });
}); 

// favouritng games
document.addEventListener("DOMContentLoaded", function () {
    const pinButtons = document.querySelectorAll(".pin-button");
    const pinnedContainer = document.querySelector(".pinned-container");
    const pinnedHeader = document.querySelector(".pinned-header");
    const allGamesHeader = document.querySelector(".allgames-header")

    const pinnedGames = JSON.parse(localStorage.getItem("pinnedGames")) || [];

    function updatePinnedUI() {
        if (pinnedGames.length === 0) {
            pinnedContainer.style.display = "none";
            pinnedHeader.style.display = "none";
            allGamesHeader.style.display = "none";
        } else {
            pinnedContainer.style.display = "block";
            pinnedHeader.style.display = "block";
            allGamesHeader.style.display = "block"

            pinnedContainer.innerHTML = "";
            pinnedGames.forEach((game) => {
                const gameLink = document.createElement("a");
                gameLink.href = game.link;
                gameLink.target = "_blank";

                const gameButton = document.createElement("div");
                gameButton.classList.add("button");
                gameButton.style.backgroundImage = `url('${game.thumbnail}')`;
                gameButton.innerHTML = `<h2>${game.name}</h2>`;

                const pinButton = document.createElement("span");
                pinButton.classList.add("pin-button");

                const img = document.createElement("img");
                img.src = "/images/other/cross.png";
                img.width = 25;
                img.height = 25;

                pinButton.appendChild(img);

                pinButton.addEventListener("click", (event) => {
                    event.preventDefault();
                    unpinGame(game.name);
                });

                gameButton.appendChild(pinButton);
                gameLink.appendChild(gameButton);
                pinnedContainer.appendChild(gameLink);
            });
        }
    }

    function pinGame(name, thumbnail, link) {
        const isAlreadyPinned = pinnedGames.some((game) => game.name === name);
        if (!isAlreadyPinned) {
            pinnedGames.push({ name, thumbnail, link });
            localStorage.setItem("pinnedGames", JSON.stringify(pinnedGames));
            updatePinnedUI();
        }
    }

    function unpinGame(name) {
        const index = pinnedGames.findIndex((game) => game.name === name);
        if (index !== -1) {
            pinnedGames.splice(index, 1);
            localStorage.setItem("pinnedGames", JSON.stringify(pinnedGames));
            updatePinnedUI();
        }
    }

    pinButtons.forEach((pinButton, index) => {
        pinButton.addEventListener("click", (event) => {
            event.preventDefault();
            const gameDiv = pinButton.closest(".button");
            const thumbnail = gameDiv.style.backgroundImage
                .replace('url("', '')
                .replace('")', '');
            const name = gameDiv.querySelector("h2").textContent;
            const link = gameDiv.parentElement.href; 
            pinGame(name, thumbnail, link);
        });
    });
    updatePinnedUI();
});

// downloading handler

const OFFLINE_MODE = [
    // offline mode page files
    '/offline.html',
    '/images/backgrounds/seraph/offlinebg.jpg',
    '/images/ico.ico',
    '/storage/fonts/ubuntu/Ubuntu.woff2',
    '/storage/js/directories.json',

    // download ruffle
    '/storage/ruffle/a29c1b01570ffecf6fae.wasm',
    '/storage/ruffle/core.ruffle.1caf8a7231ccf85abb1d.js',
    '/storage/ruffle/core.ruffle.1caf8a7231ccf85abb1d.js.map',
    '/storage/ruffle/core.ruffle.78cc902cbabd4bc44008.js',
    '/storage/ruffle/core.ruffle.78cc902cbabd4bc44008.js.map',
    '/storage/ruffle/d6c752be1c7e690bf226.wasm',
    '/storage/ruffle/package.json',
    '/storage/ruffle/ruffle.js',
    '/storage/ruffle/ruffle.js.map',

    // download cloaking
    '/storage/js/cloak.js',
    '/images/icons/google.ico',
    '/images/icons/bing.ico',
    '/images/icons/gmail.ico',
    '/images/icons/desmos.ico',
    '/images/icons/googleclassroom.ico',
    '/images/icons/wikipedia.ico',
    '/images/icons/chromenewtab.ico',
    '/images/icons/googledrive.ico'
];

async function areEssentialFilesCached() {
    const cache = await caches.open('offlinemode-cache');
    const promises = OFFLINE_MODE.map(async (file) => {
        const response = await cache.match(file);
        return !!response;
    });
    const results = await Promise.all(promises);
    return results.every(result => result);
}

async function cacheEssentialFiles() {
    const cache = await caches.open('game-cache');
    await cache.addAll(OFFLINE_MODE);
}

async function ensureEssentialFiles(promptDiv) {
    const essentialFilesCached = await areEssentialFilesCached();
    if (!essentialFilesCached) {
        promptDiv.querySelector('p').textContent = `downloading offline mode files. speed of this may depend on your internet connection. `;
        await cacheEssentialFiles();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.download-button').forEach(button => {
        button.addEventListener('click', handleDownloadClick);
    });
});

function handleDownloadClick(event) {
    event.preventDefault(); 
    const gameButton = event.target.closest('.button');
    const gameName = gameButton.querySelector('h2').textContent;
    const gameDirectory = gameButton.closest('a').getAttribute('href');
    showConfirmationPrompt(gameName, gameDirectory, gameButton.style.backgroundImage);
}


function showConfirmationPrompt(gameName, gameDirectory) {
    const blackoutDiv = document.createElement('div');
    blackoutDiv.classList.add('blackout');
    
    const promptDiv = document.createElement('div');
    promptDiv.classList.add('confirmation-prompt');
    promptDiv.innerHTML = `
        <div class="prompt-content">
            <h2>download game</h2>
            <p>would you like to download ${gameName}? you'll be able to load this game when you don't have an internet connection.</p>
            <button id="confirm-yes">yes</button>
            <button id="confirm-no">no</button>
        </div>
    `;

    document.body.appendChild(blackoutDiv);
    document.body.appendChild(promptDiv);

    document.getElementById('confirm-yes').addEventListener('click', () => {
        promptDiv.querySelector('p').textContent = `preparing to download ${gameName}. please wait..`;
        promptDiv.querySelector('#confirm-yes').remove();
        promptDiv.querySelector('#confirm-no').remove();
        ensureEssentialFiles(promptDiv);

        promptDiv.querySelector('p').textContent = `downloading ${gameName}. speeds vary depending on the game size and your internet connection.`;

        downloadGameFiles(gameName, gameDirectory, promptDiv, blackoutDiv);
    });

    document.getElementById('confirm-no').addEventListener('click', () => {
        document.body.removeChild(blackoutDiv);
        document.body.removeChild(promptDiv);
    });

    centerDivOnScroll();
    window.addEventListener('scroll', centerDivOnScroll);
    window.addEventListener('resize', centerDivOnScroll);
}

function centerDivOnScroll() {
    const centerDiv = document.querySelector('.confirmation-prompt');
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;

    const newTopPosition = scrollY + (windowHeight / 2);
    centerDiv.style.top = `${newTopPosition}px`;
}
  
async function downloadGameFiles(gameName, gameDirectory, promptDiv, blackoutDiv) {
    try {
        const response = await fetch('/storage/js/directories.json'); 
        if (!response.ok) {
            throw new Error('failed to fetch list');
        }

        const directoryList = await response.json();
        const gameData = directoryList[gameDirectory];
        if (!gameData || !gameData.files) {
            throw new Error('no files found for game.');
        }

        promptDiv.querySelector('p').textContent = `downloading ${gameName}. speeds vary depending on the game size and your internet connection.`;
        const files = gameData.files;
        const cache = await caches.open('game-cache');

        for (const file of files) {
            const fileResponse = await fetch(file);
            await cache.put(file, fileResponse.clone());
        }

        const thumbnailUrl = gameData.thumbnail;
        const thumbnailResponse = await fetch(thumbnailUrl);
        await cache.put(thumbnailUrl, thumbnailResponse.clone());

        saveGameToLocal({
            name: gameName,
            directory: gameDirectory,
            thumbnail: thumbnailUrl
        });

        promptDiv.querySelector('p').textContent = `${gameName} has finished downloading! you can now access this game locally by opening the site without an internet connection.`;
        const closeButton = document.createElement('button');
        closeButton.textContent = 'okay';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(blackoutDiv);
            document.body.removeChild(promptDiv);
            window.removeEventListener('scroll', centerDivOnScroll);
            window.removeEventListener('resize', centerDivOnScroll);
        });
        promptDiv.appendChild(closeButton);
    } catch (error) {
        console.error('Error downloading game files:', error);
        promptDiv.querySelector('p').textContent = `there was an error trying to download ${gameName}. try again later, or report the issue to github/discord.`;
        const closeButton = document.createElement('button');
        closeButton.textContent = 'close';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(blackoutDiv);
            document.body.removeChild(promptDiv);
            window.removeEventListener('scroll', centerDivOnScroll);
            window.removeEventListener('resize', centerDivOnScroll);
        });
        promptDiv.appendChild(closeButton);
    }
}

function saveGameToLocal(gameData) {
    const games = JSON.parse(localStorage.getItem('downloadedGames')) || [];
    games.push(gameData);
    localStorage.setItem('downloadedGames', JSON.stringify(games));
}
// Game descriptions database
const gameDescriptions = {
    "1 Date Danger": "Experience 1 Date Danger - an engaging game with unique gameplay and challenges.",
    "1 on 1 soccer": "Experience 1 on 1 soccer - an engaging game with unique gameplay and challenges.",
    "10 Minutes Till Dawn": "Experience 10 Minutes Till Dawn - an engaging game with unique gameplay and challenges.",
    "12 Mini Battles": "Experience 12 Mini Battles - an engaging game with unique gameplay and challenges.",
    "1v1.LoL": "Experience 1v1.LoL - an engaging game with unique gameplay and challenges.",
    "1v1lol": "Experience 1v1lol - an engaging game with unique gameplay and challenges.",
    "2048": "Experience 2048 - an engaging game with unique gameplay and challenges.",
    "2048 Merge Run": "Experience 2048 Merge Run - an engaging game with unique gameplay and challenges.",
    "3D Bolt Master": "Experience 3D Bolt Master - an engaging game with unique gameplay and challenges.",
    "3D Bowling": "Experience 3D Bowling - an engaging game with unique gameplay and challenges.",
    "8 Ball Classic": "Experience 8 Ball Classic - an engaging game with unique gameplay and challenges.",
    "8 Ball Pool": "Experience 8 Ball Pool - an engaging game with unique gameplay and challenges.",
    "99 Balls": "Experience 99 Balls - an engaging game with unique gameplay and challenges.",
    "A Bite at Freddy's": "Experience A Bite at Freddy\'s - an engaging game with unique gameplay and challenges.",
    "A Dance of Fire and Ice": "Experience A Dance of Fire and Ice - an engaging game with unique gameplay and challenges.",
    "A Difficult Game About Climbing": "Experience A Difficult Game About Climbing - an engaging game with unique gameplay and challenges.",
    "A Small World Cup": "Experience A Small World Cup - an engaging game with unique gameplay and challenges.",
    "Abandoned": "Experience Abandoned - an engaging game with unique gameplay and challenges.",
    "Achievement Unlocked": "Experience Achievement Unlocked - an engaging game with unique gameplay and challenges.",
    "Achievement Unlocked 2": "Experience Achievement Unlocked 2 - an engaging game with unique gameplay and challenges.",
    "Achievement Unlocked 3": "Experience Achievement Unlocked 3 - an engaging game with unique gameplay and challenges.",
    "Adventure Capatalist": "Experience Adventure Capatalist - an engaging game with unique gameplay and challenges.",
    "Adventure Drivers": "Experience Adventure Drivers - an engaging game with unique gameplay and challenges.",
    "Ages of Conflict": "Experience Ages of Conflict - an engaging game with unique gameplay and challenges.",
    "Alien Hominid": "Experience Alien Hominid - an engaging game with unique gameplay and challenges.",
    "Amanda the Adventurer": "Experience Amanda the Adventurer - an engaging game with unique gameplay and challenges.",
    "Amaze": "Experience Amaze - an engaging game with unique gameplay and challenges.",
    "Andy's Apple Farm": "Experience Andy\'s Apple Farm - an engaging game with unique gameplay and challenges.",
    "Angry Birds": "Experience Angry Birds - an engaging game with unique gameplay and challenges.",
    "Angry Birds Chrome": "Experience Angry Birds Chrome - an engaging game with unique gameplay and challenges.",
    "Angry Birds Showdown": "Experience Angry Birds Showdown - an engaging game with unique gameplay and challenges.",
    "Aquapark.io": "Experience Aquapark.io - an engaging game with unique gameplay and challenges.",
    "Archery World Tour": "Experience Archery World Tour - an engaging game with unique gameplay and challenges.",
    "Arthur's Nightmare": "Experience Arthur\'s Nightmare - an engaging game with unique gameplay and challenges.",
    "Attack Hole": "Experience Attack Hole - an engaging game with unique gameplay and challenges.",
    "Aviamasters": "Experience Aviamasters - an engaging game with unique gameplay and challenges.",
    "Awesome Tanks": "Experience Awesome Tanks - an engaging game with unique gameplay and challenges.",
    "Awesome Tanks 2": "Experience Awesome Tanks 2 - an engaging game with unique gameplay and challenges.",
    "BERGENTRUCK 201x": "Experience BERGENTRUCK 201x - an engaging game with unique gameplay and challenges.",
    "BFDIA 5b": "Experience BFDIA 5b - an engaging game with unique gameplay and challenges.",
    "BFDIA 5b: 5*30": "Experience BFDIA 5b: 5*30 - an engaging game with unique gameplay and challenges.",
    "BLOODMONEY!": "Experience BLOODMONEY! - an engaging game with unique gameplay and challenges.",
    "Backrooms": "Experience Backrooms - an engaging game with unique gameplay and challenges.",
    "Bacon May Die": "Experience Bacon May Die - an engaging game with unique gameplay and challenges.",
    "Bad Ice Cream": "Experience Bad Ice Cream - an engaging game with unique gameplay and challenges.",
    "Bad Ice Cream 2": "Experience Bad Ice Cream 2 - an engaging game with unique gameplay and challenges.",
    "Bad Ice Cream 3": "Experience Bad Ice Cream 3 - an engaging game with unique gameplay and challenges.",
    "Bad Monday Simulator": "Experience Bad Monday Simulator - an engaging game with unique gameplay and challenges.",
    "Bad Parenting 1": "Experience Bad Parenting 1 - an engaging game with unique gameplay and challenges.",
    "Bad Time Simulator": "Experience Bad Time Simulator - an engaging game with unique gameplay and challenges.",
    "Baldi's Basics": "Experience Baldi\'s Basics - an engaging game with unique gameplay and challenges.",
    "Baldi's Basics Classic Remastered": "Experience Baldi\'s Basics Classic Remastered - an engaging game with unique gameplay and challenges.",
    "Baldi's Basics Plus": "Experience Baldi\'s Basics Plus - an engaging game with unique gameplay and challenges.",
    "Ball Blast": "Experience Ball Blast - an engaging game with unique gameplay and challenges.",
    "Bank Robbery": "Experience Bank Robbery - an engaging game with unique gameplay and challenges.",
    "Bank Robbery 2": "Experience Bank Robbery 2 - an engaging game with unique gameplay and challenges.",
    "Bank Robbery 3": "Experience Bank Robbery 3 - an engaging game with unique gameplay and challenges.",
    "Baseball Bros": "Experience Baseball Bros - an engaging game with unique gameplay and challenges.",
    "Basket Battle": "Experience Basket Battle - an engaging game with unique gameplay and challenges.",
    "Basket Bros": "Experience Basket Bros - an engaging game with unique gameplay and challenges.",
    "Basket Random": "Experience Basket Random - an engaging game with unique gameplay and challenges.",
    "Basketball Frvr": "Experience Basketball Frvr - an engaging game with unique gameplay and challenges.",
    "Basketball Stars": "Experience Basketball Stars - an engaging game with unique gameplay and challenges.",
    "Bazooka Boy": "Experience Bazooka Boy - an engaging game with unique gameplay and challenges.",
    "Bendy and the Ink Machine": "Experience Bendy and the Ink Machine - an engaging game with unique gameplay and challenges.",
    "Big ICE Tower Tiny Square": "Experience Big ICE Tower Tiny Square - an engaging game with unique gameplay and challenges.",
    "Big NEON Tower Tiny Square": "Experience Big NEON Tower Tiny Square - an engaging game with unique gameplay and challenges.",
    "Big Tower Tiny Square": "Experience Big Tower Tiny Square - an engaging game with unique gameplay and challenges.",
    "Big Tower Tiny Square 2": "Experience Big Tower Tiny Square 2 - an engaging game with unique gameplay and challenges.",
    "Binding of Issac: Wrath of the Lamb": "Experience Binding of Issac: Wrath of the Lamb - an engaging game with unique gameplay and challenges.",
    "BitGun.io": "Experience BitGun.io - an engaging game with unique gameplay and challenges.",
    "BitLife": "Experience BitLife - an engaging game with unique gameplay and challenges.",
    "BitPlanes": "Experience BitPlanes - an engaging game with unique gameplay and challenges.",
    "BlackJack": "Experience BlackJack - an engaging game with unique gameplay and challenges.",
    "Blade Ball": "Experience Blade Ball - an engaging game with unique gameplay and challenges.",
    "Block Blast": "Experience Block Blast - an engaging game with unique gameplay and challenges.",
    "BlockPost": "Experience BlockPost - an engaging game with unique gameplay and challenges.",
    "Blocky Snakes": "Experience Blocky Snakes - an engaging game with unique gameplay and challenges.",
    "Bloons TD": "Experience Bloons TD - an engaging game with unique gameplay and challenges.",
    "Bloons TD 2": "Experience Bloons TD 2 - an engaging game with unique gameplay and challenges.",
    "Bloons TD 3": "Experience Bloons TD 3 - an engaging game with unique gameplay and challenges.",
    "Bloons TD 4": "Experience Bloons TD 4 - an engaging game with unique gameplay and challenges.",
    "Bloons TD 5": "Experience Bloons TD 5 - an engaging game with unique gameplay and challenges.",
    "Bloxorz": "Experience Bloxorz - an engaging game with unique gameplay and challenges.",
    "Blumgi Rocket": "Experience Blumgi Rocket - an engaging game with unique gameplay and challenges.",
    "Bob The Robber 2": "Experience Bob The Robber 2 - an engaging game with unique gameplay and challenges.",
    "Boom Slingers: Reboom": "Experience Boom Slingers: Reboom - an engaging game with unique gameplay and challenges.",
    "Bottle Jump 3D": "Experience Bottle Jump 3D - an engaging game with unique gameplay and challenges.",
    "Bouncemasters": "Experience Bouncemasters - an engaging game with unique gameplay and challenges.",
    "Bowmasters": "Experience Bowmasters - an engaging game with unique gameplay and challenges.",
    "Boxing Random": "Experience Boxing Random - an engaging game with unique gameplay and challenges.",
    "Brawl Guys.io": "Experience Brawl Guys.io - an engaging game with unique gameplay and challenges.",
    "Bridge Race": "Experience Bridge Race - an engaging game with unique gameplay and challenges.",
    "Buckshot Roulette": "Experience Buckshot Roulette - an engaging game with unique gameplay and challenges.",
    "Build a Big Army": "Experience Build a Big Army - an engaging game with unique gameplay and challenges.",
    "Build a Plane": "Experience Build a Plane - an engaging game with unique gameplay and challenges.",
    "Build a Queen": "Experience Build a Queen - an engaging game with unique gameplay and challenges.",
    "BuildNow.gg": "Experience BuildNow.gg - an engaging game with unique gameplay and challenges.",
    "Burrito Bison": "Experience Burrito Bison - an engaging game with unique gameplay and challenges.",
    "Bust a Loop": "Experience Bust a Loop - an engaging game with unique gameplay and challenges.",
    "Buster Jam": "Experience Buster Jam - an engaging game with unique gameplay and challenges.",
    "CG FC 25": "Experience CG FC 25 - an engaging game with unique gameplay and challenges.",
    "Camouflage and Sniper": "Experience Camouflage and Sniper - an engaging game with unique gameplay and challenges.",
    "Candy Crush": "Experience Candy Crush - an engaging game with unique gameplay and challenges.",
    "Cannon Balls 3D": "Experience Cannon Balls 3D - an engaging game with unique gameplay and challenges.",
    "Cannon Basketball": "Experience Cannon Basketball - an engaging game with unique gameplay and challenges.",
    "Cannon Basketball 2": "Experience Cannon Basketball 2 - an engaging game with unique gameplay and challenges.",
    "Car Survival 3D": "Experience Car Survival 3D - an engaging game with unique gameplay and challenges.",
    "Carrom Clash": "Experience Carrom Clash - an engaging game with unique gameplay and challenges.",
    "Cat Connection": "Experience Cat Connection - an engaging game with unique gameplay and challenges.",
    "Cat Gunner: Super Zombie Shoot": "Experience Cat Gunner: Super Zombie Shoot - an engaging game with unique gameplay and challenges.",
    "Cave Story": "Experience Cave Story - an engaging game with unique gameplay and challenges.",
    "Celeste": "Experience Celeste - an engaging game with unique gameplay and challenges.",
    "Celeste PICO": "Experience Celeste PICO - an engaging game with unique gameplay and challenges.",
    "Chat Bot (A.|.I)": "Experience Chat Bot (A.|.I) - an engaging game with unique gameplay and challenges.",
    "Cheese Chompers 3D": "Experience Cheese Chompers 3D - an engaging game with unique gameplay and challenges.",
    "Chess Classic": "Experience Chess Classic - an engaging game with unique gameplay and challenges.",
    "Chiikawa Puzzle": "Experience Chiikawa Puzzle - an engaging game with unique gameplay and challenges.",
    "Choppy Orc": "Experience Choppy Orc - an engaging game with unique gameplay and challenges.",
    "CircloO": "Experience CircloO - an engaging game with unique gameplay and challenges.",
    "CircloO 2": "Experience CircloO 2 - an engaging game with unique gameplay and challenges.",
    "City Defense": "Experience City Defense - an engaging game with unique gameplay and challenges.",
    "City Smash": "Experience City Smash - an engaging game with unique gameplay and challenges.",
    "Clash Of Vikings": "Experience Clash Of Vikings - an engaging game with unique gameplay and challenges.",
    "Class of '09": "Experience Class of \'09 - an engaging game with unique gameplay and challenges.",
    "Clothing Shop 3D": "Experience Clothing Shop 3D - an engaging game with unique gameplay and challenges.",
    "Cluster Rush": "Experience Cluster Rush - an engaging game with unique gameplay and challenges.",
    "Code Editor": "Experience Code Editor - an engaging game with unique gameplay and challenges.",
    "Color Match": "Experience Color Match - an engaging game with unique gameplay and challenges.",
    "Color Water Sort 3D": "Experience Color Water Sort 3D - an engaging game with unique gameplay and challenges.",
    "Cookie Clicker": "Experience Cookie Clicker - an engaging game with unique gameplay and challenges.",
    "Cooking Mama": "Experience Cooking Mama - an engaging game with unique gameplay and challenges.",
    "Cooking Mama 2": "Experience Cooking Mama 2 - an engaging game with unique gameplay and challenges.",
    "Cooking Mama 3": "Experience Cooking Mama 3 - an engaging game with unique gameplay and challenges.",
    "Cool Cars Run 3D": "Experience Cool Cars Run 3D - an engaging game with unique gameplay and challenges.",
    "Coreball": "Experience Coreball - an engaging game with unique gameplay and challenges.",
    "Count Masters: Stickman Games": "Experience Count Masters: Stickman Games - an engaging game with unique gameplay and challenges.",
    "Crazy Cars": "Experience Crazy Cars - an engaging game with unique gameplay and challenges.",
    "Crazy Cattle 3D": "Experience Crazy Cattle 3D - an engaging game with unique gameplay and challenges.",
    "Crazy Chicken 3D": "Experience Crazy Chicken 3D - an engaging game with unique gameplay and challenges.",
    "Crazy Kitty 3D": "Experience Crazy Kitty 3D - an engaging game with unique gameplay and challenges.",
    "Crossy Road": "Experience Crossy Road - an engaging game with unique gameplay and challenges.",
    "Crush Cars 3D": "Experience Crush Cars 3D - an engaging game with unique gameplay and challenges.",
    "Cubefield": "Experience Cubefield - an engaging game with unique gameplay and challenges.",
    "Cuphead": "Experience Cuphead - an engaging game with unique gameplay and challenges.",
    "Cut the Rope": "Experience Cut the Rope - an engaging game with unique gameplay and challenges.",
    "Cut the Rope: Holiday Gift": "Experience Cut the Rope: Holiday Gift - an engaging game with unique gameplay and challenges.",
    "Cut the Rope: Time Travel": "Experience Cut the Rope: Time Travel - an engaging game with unique gameplay and challenges.",
    "DEAD PLATE": "Experience DEAD PLATE - an engaging game with unique gameplay and challenges.",
    "DON'T YOU LECTURE ME": "Experience DON\'T YOU LECTURE ME - an engaging game with unique gameplay and challenges.",
    "DOOM": "Experience DOOM - an engaging game with unique gameplay and challenges.",
    "Dadish": "Experience Dadish - an engaging game with unique gameplay and challenges.",
    "Dadish 2": "Experience Dadish 2 - an engaging game with unique gameplay and challenges.",
    "Dadish 3": "Experience Dadish 3 - an engaging game with unique gameplay and challenges.",
    "Dadish 3D": "Experience Dadish 3D - an engaging game with unique gameplay and challenges.",
    "Daily Dadish": "Experience Daily Dadish - an engaging game with unique gameplay and challenges.",
    "Dalgona Candy Honeycomb Cookie": "Experience Dalgona Candy Honeycomb Cookie - an engaging game with unique gameplay and challenges.",
    "Dan The Man": "Experience Dan The Man - an engaging game with unique gameplay and challenges.",
    "Death Run 3D": "Experience Death Run 3D - an engaging game with unique gameplay and challenges.",
    "Deltatraveler": "Experience Deltatraveler - an engaging game with unique gameplay and challenges.",
    "Destiny Run 3D": "Experience Destiny Run 3D - an engaging game with unique gameplay and challenges.",
    "Destroy The Car 3D": "Experience Destroy The Car 3D - an engaging game with unique gameplay and challenges.",
    "Diamond Seeker": "Experience Diamond Seeker - an engaging game with unique gameplay and challenges.",
    "Dig Deep": "Experience Dig Deep - an engaging game with unique gameplay and challenges.",
    "Do NOT Take This Cat Home": "Experience Do NOT Take This Cat Home - an engaging game with unique gameplay and challenges.",
    "Doge Miner": "Experience Doge Miner - an engaging game with unique gameplay and challenges.",
    "Doodle Jump": "Experience Doodle Jump - an engaging game with unique gameplay and challenges.",
    "Doom 2": "Experience Doom 2 - an engaging game with unique gameplay and challenges.",
    "Doom 3": "Experience Doom 3 - an engaging game with unique gameplay and challenges.",
    "Dragon vs Bricks": "Experience Dragon vs Bricks - an engaging game with unique gameplay and challenges.",
    "Draw Climber": "Experience Draw Climber - an engaging game with unique gameplay and challenges.",
    "Draw Joust": "Experience Draw Joust - an engaging game with unique gameplay and challenges.",
    "Draw the Hill": "Experience Draw the Hill - an engaging game with unique gameplay and challenges.",
    "Draw the Line": "Experience Draw the Line - an engaging game with unique gameplay and challenges.",
    "Dreadhead Parkour": "Experience Dreadhead Parkour - an engaging game with unique gameplay and challenges.",
    "Drift Boss": "Experience Drift Boss - an engaging game with unique gameplay and challenges.",
    "Drift Hunters": "Experience Drift Hunters - an engaging game with unique gameplay and challenges.",
    "Driven Wild": "Experience Driven Wild - an engaging game with unique gameplay and challenges.",
    "Duck Life": "Experience Duck Life - an engaging game with unique gameplay and challenges.",
    "Duck Life 2": "Experience Duck Life 2 - an engaging game with unique gameplay and challenges.",
    "Duck Life 3": "Experience Duck Life 3 - an engaging game with unique gameplay and challenges.",
    "Duck Life 4": "Experience Duck Life 4 - an engaging game with unique gameplay and challenges.",
    "Duck Life 5": "Experience Duck Life 5 - an engaging game with unique gameplay and challenges.",
    "Duck Life 8": "Experience Duck Life 8 - an engaging game with unique gameplay and challenges.",
    "Elastic Man": "Experience Elastic Man - an engaging game with unique gameplay and challenges.",
    "Emulator.JS": "Experience Emulator.JS - an engaging game with unique gameplay and challenges.",
    "Endoparasitic": "Experience Endoparasitic - an engaging game with unique gameplay and challenges.",
    "Endroll": "Experience Endroll - an engaging game with unique gameplay and challenges.",
    "Escape Road": "Experience Escape Road - an engaging game with unique gameplay and challenges.",
    "Escape Road 2": "Experience Escape Road 2 - an engaging game with unique gameplay and challenges.",
    "Evil Glitch": "Experience Evil Glitch - an engaging game with unique gameplay and challenges.",
    "EvoWars.io": "Experience EvoWars.io - an engaging game with unique gameplay and challenges.",
    "Evolving Bombs 3D": "Experience Evolving Bombs 3D - an engaging game with unique gameplay and challenges.",
    "FIFA 10": "Experience FIFA 10 - an engaging game with unique gameplay and challenges.",
    "FIFA 11": "Experience FIFA 11 - an engaging game with unique gameplay and challenges.",
    "FNF Vs. Hypno's Lullaby v2": "Experience FNF Vs. Hypno\'s Lullaby v2 - an engaging game with unique gameplay and challenges.",
    "FNF Vs. Sonic.EXE 3.0/4.0": "Experience FNF Vs. Sonic.EXE 3.0/4.0 - an engaging game with unique gameplay and challenges.",
    "FNF vs Bob v2.0 (Bob’s Onslaught)": "Experience FNF vs Bob v2.0 (Bob’s Onslaught) - an engaging game with unique gameplay and challenges.",
    "FNF vs Pibby Corrupted": "Experience FNF vs Pibby Corrupted - an engaging game with unique gameplay and challenges.",
    "Fallout": "Experience Fallout - an engaging game with unique gameplay and challenges.",
    "Fancy Pants Adventure": "Experience Fancy Pants Adventure - an engaging game with unique gameplay and challenges.",
    "Fancy Pants Adventure 2": "Experience Fancy Pants Adventure 2 - an engaging game with unique gameplay and challenges.",
    "Fancy Pants Adventure 3": "Experience Fancy Pants Adventure 3 - an engaging game with unique gameplay and challenges.",
    "Fancy Pants Adventure 4 Part 1": "Experience Fancy Pants Adventure 4 Part 1 - an engaging game with unique gameplay and challenges.",
    "Fancy Pants Adventure 4 Part 2": "Experience Fancy Pants Adventure 4 Part 2 - an engaging game with unique gameplay and challenges.",
    "Fashion Battle": "Experience Fashion Battle - an engaging game with unique gameplay and challenges.",
    "Fears to Fathom: Home Alone": "Experience Fears to Fathom: Home Alone - an engaging game with unique gameplay and challenges.",
    "Final Earth 2": "Experience Final Earth 2 - an engaging game with unique gameplay and challenges.",
    "Final Fantasy VII": "Experience Final Fantasy VII - an engaging game with unique gameplay and challenges.",
    "Find the Alien": "Experience Find the Alien - an engaging game with unique gameplay and challenges.",
    "Fire and Frost Master": "Experience Fire and Frost Master - an engaging game with unique gameplay and challenges.",
    "Fireboy and Watergirl 2": "Experience Fireboy and Watergirl 2 - an engaging game with unique gameplay and challenges.",
    "Fireboy and Watergirl 3": "Experience Fireboy and Watergirl 3 - an engaging game with unique gameplay and challenges.",
    "Fitness Empire": "Experience Fitness Empire - an engaging game with unique gameplay and challenges.",
    "Five Nights at Candy's": "Experience Five Nights at Candy\'s - an engaging game with unique gameplay and challenges.",
    "Five Nights at Candy's 2": "Experience Five Nights at Candy\'s 2 - an engaging game with unique gameplay and challenges.",
    "Five Nights at Freddy's": "Experience Five Nights at Freddy\'s - an engaging game with unique gameplay and challenges.",
    "Five Nights at Freddy's 2": "Experience Five Nights at Freddy\'s 2 - an engaging game with unique gameplay and challenges.",
    "Five Nights at Freddy's 3": "Experience Five Nights at Freddy\'s 3 - an engaging game with unique gameplay and challenges.",
    "Five Nights at Freddy's 4": "Experience Five Nights at Freddy\'s 4 - an engaging game with unique gameplay and challenges.",
    "Five Nights at Freddy's 4: Halloween": "Experience Five Nights at Freddy\'s 4: Halloween - an engaging game with unique gameplay and challenges.",
    "Five Nights at Freddy's: Pizza Simulator": "Experience Five Nights at Freddy\'s: Pizza Simulator - an engaging game with unique gameplay and challenges.",
    "Five Nights at Freddy's: Sister Location": "Experience Five Nights at Freddy\'s: Sister Location - an engaging game with unique gameplay and challenges.",
    "Five Nights at Freddy's: Ultimate Custom Night": "Experience Five Nights at Freddy\'s: Ultimate Custom Night - an engaging game with unique gameplay and challenges.",
    "Five Nights at Freddy's: World": "Experience Five Nights at Freddy\'s: World - an engaging game with unique gameplay and challenges.",
    "Five Nights at Freddy's: World Refreshed": "Experience Five Nights at Freddy\'s: World Refreshed - an engaging game with unique gameplay and challenges.",
    "Five Nights at Winston's": "Experience Five Nights at Winston\'s - an engaging game with unique gameplay and challenges.",
    "Flappy Bird": "Experience Flappy Bird - an engaging game with unique gameplay and challenges.",
    "Flappy Dunk": "Experience Flappy Dunk - an engaging game with unique gameplay and challenges.",
    "Flick Goal": "Experience Flick Goal - an engaging game with unique gameplay and challenges.",
    "Flip Master": "Experience Flip Master - an engaging game with unique gameplay and challenges.",
    "Football Bros": "Experience Football Bros - an engaging game with unique gameplay and challenges.",
    "Fork n Sausage": "Experience Fork n Sausage - an engaging game with unique gameplay and challenges.",
    "Fortzone Battle Royale": "Experience Fortzone Battle Royale - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin": "Experience Friday Night Funkin - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin VS Impostor v4": "Experience Friday Night Funkin VS Impostor v4 - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin VS. KAPI": "Experience Friday Night Funkin VS. KAPI - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin VS. Sky": "Experience Friday Night Funkin VS. Sky - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin Vs. Cyber Sensation": "Experience Friday Night Funkin Vs. Cyber Sensation - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin Vs. Dave and Bambi v3": "Experience Friday Night Funkin Vs. Dave and Bambi v3 - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin vs Carol V2": "Experience Friday Night Funkin vs Carol V2 - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin vs Nonsense": "Experience Friday Night Funkin vs Nonsense - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin vs Shaggy": "Experience Friday Night Funkin vs Shaggy - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin vs Sunday Remastered HD": "Experience Friday Night Funkin vs Sunday Remastered HD - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin vs Undertale": "Experience Friday Night Funkin vs Undertale - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin' D-Sides": "Experience Friday Night Funkin\' D-Sides - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin' Drop and Roll, but Playable": "Experience Friday Night Funkin\' Drop and Roll, but Playable - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin' Sunday Night Suicide: Rookies Edition": "Experience Friday Night Funkin\' Sunday Night Suicide: Rookies Edition - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin' VS Impostor B-Sides": "Experience Friday Night Funkin\' VS Impostor B-Sides - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin' vs Hypno Lullaby": "Experience Friday Night Funkin\' vs Hypno Lullaby - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': 17 Bucks: Floor 1": "Experience Friday Night Funkin\': 17 Bucks: Floor 1 - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': AKAGE": "Experience Friday Night Funkin\': AKAGE - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': B-Sides": "Experience Friday Night Funkin\': B-Sides - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Chaos Nightmare - Sonic Vs. Fleetway": "Experience Friday Night Funkin\': Chaos Nightmare - Sonic Vs. Fleetway - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Creepypasta JP": "Experience Friday Night Funkin\': Creepypasta JP - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Darkness Takeover": "Experience Friday Night Funkin\': Darkness Takeover - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': FIRE IN THE HOLE: Lobotomy Dash Funkin'": "Experience Friday Night Funkin\': FIRE IN THE HOLE: Lobotomy Dash Funkin\' - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Gumballs": "Experience Friday Night Funkin\': Gumballs - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Heartbreak Havoc [Vs. Sky: REDUX]": "Experience Friday Night Funkin\': Heartbreak Havoc [Vs. Sky: REDUX] - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Hit Single Real": "Experience Friday Night Funkin\': Hit Single Real - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Indie Cross": "Experience Friday Night Funkin\': Indie Cross - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Jeffy's Endless Aethos": "Experience Friday Night Funkin\': Jeffy\'s Endless Aethos - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Mario's Madness": "Experience Friday Night Funkin\': Mario\'s Madness - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Mistful Crimson Morning Reboot": "Experience Friday Night Funkin\': Mistful Crimson Morning Reboot - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Neo": "Experience Friday Night Funkin\': Neo - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Pibby: Apocalypse": "Experience Friday Night Funkin\': Pibby: Apocalypse - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Rev-Mixed": "Experience Friday Night Funkin\': Rev-Mixed - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Sarvente's Mid-Fight Masses": "Experience Friday Night Funkin\': Sarvente\'s Mid-Fight Masses - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Sonic Legacy": "Experience Friday Night Funkin\': Sonic Legacy - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': TWIDDLEFINGER": "Experience Friday Night Funkin\': TWIDDLEFINGER - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': V.S. Whitty": "Experience Friday Night Funkin\': V.S. Whitty - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': VS. Impostor: Alternated": "Experience Friday Night Funkin\': VS. Impostor: Alternated - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Vs. Hatsune Miku": "Experience Friday Night Funkin\': Vs. Hatsune Miku - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': Vs. Hex": "Experience Friday Night Funkin\': Vs. Hex - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': vs. BOPCITY": "Experience Friday Night Funkin\': vs. BOPCITY - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': vs. Garcello": "Experience Friday Night Funkin\': vs. Garcello - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': vs. QT": "Experience Friday Night Funkin\': vs. QT - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin': vs. Tricky": "Experience Friday Night Funkin\': vs. Tricky - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin’ Soft": "Experience Friday Night Funkin’ Soft - an engaging game with unique gameplay and challenges.",
    "Friday Night Funkin’ Wednesday's Infidelity": "Experience Friday Night Funkin’ Wednesday\'s Infidelity - an engaging game with unique gameplay and challenges.",
    "Fruit Ninja": "Experience Fruit Ninja - an engaging game with unique gameplay and challenges.",
    "Generic Fighter Maybe": "Experience Generic Fighter Maybe - an engaging game with unique gameplay and challenges.",
    "Geometry Dash Lite (REMAKE)": "Experience Geometry Dash Lite (REMAKE) - an engaging game with unique gameplay and challenges.",
    "Get Yoked": "Experience Get Yoked - an engaging game with unique gameplay and challenges.",
    "Getaway Shootout": "Experience Getaway Shootout - an engaging game with unique gameplay and challenges.",
    "Getting Over It with Bennett Foddy": "Experience Getting Over It with Bennett Foddy - an engaging game with unique gameplay and challenges.",
    "Giant Wanted": "Experience Giant Wanted - an engaging game with unique gameplay and challenges.",
    "Gladihoppers": "Experience Gladihoppers - an engaging game with unique gameplay and challenges.",
    "Gobble": "Experience Gobble - an engaging game with unique gameplay and challenges.",
    "Goblin Goopmaxxing": "Experience Goblin Goopmaxxing - an engaging game with unique gameplay and challenges.",
    "God's Flesh": "Experience God\'s Flesh - an engaging game with unique gameplay and challenges.",
    "Godzilla Daikaiju Battle Royale": "Experience Godzilla Daikaiju Battle Royale - an engaging game with unique gameplay and challenges.",
    "Going Balls": "Experience Going Balls - an engaging game with unique gameplay and challenges.",
    "Google Baseball": "Experience Google Baseball - an engaging game with unique gameplay and challenges.",
    "Google Feud": "Experience Google Feud - an engaging game with unique gameplay and challenges.",
    "Gorilla Tag": "Experience Gorilla Tag - an engaging game with unique gameplay and challenges.",
    "Granny": "Experience Granny - an engaging game with unique gameplay and challenges.",
    "Granny 2": "Experience Granny 2 - an engaging game with unique gameplay and challenges.",
    "Granny 3": "Experience Granny 3 - an engaging game with unique gameplay and challenges.",
    "Growden.io": "Experience Growden.io - an engaging game with unique gameplay and challenges.",
    "Guess Their Answer": "Experience Guess Their Answer - an engaging game with unique gameplay and challenges.",
    "Gun Clone": "Experience Gun Clone - an engaging game with unique gameplay and challenges.",
    "Gun Runner": "Experience Gun Runner - an engaging game with unique gameplay and challenges.",
    "Gunspin": "Experience Gunspin - an engaging game with unique gameplay and challenges.",
    "Half Life": "Experience Half Life - an engaging game with unique gameplay and challenges.",
    "Half Life: Opposing Force": "Experience Half Life: Opposing Force - an engaging game with unique gameplay and challenges.",
    "Happy Sheepies": "Experience Happy Sheepies - an engaging game with unique gameplay and challenges.",
    "Happy Wheels": "Experience Happy Wheels - an engaging game with unique gameplay and challenges.",
    "Harvest.io": "Experience Harvest.io - an engaging game with unique gameplay and challenges.",
    "Hide N Seek": "Experience Hide N Seek - an engaging game with unique gameplay and challenges.",
    "High Heels": "Experience High Heels - an engaging game with unique gameplay and challenges.",
    "Highway Racer": "Experience Highway Racer - an engaging game with unique gameplay and challenges.",
    "Highway Racer 2": "Experience Highway Racer 2 - an engaging game with unique gameplay and challenges.",
    "Highway Racer 2 REMASTERED": "Experience Highway Racer 2 REMASTERED - an engaging game with unique gameplay and challenges.",
    "Hill Climb Racing Lite": "Experience Hill Climb Racing Lite - an engaging game with unique gameplay and challenges.",
    "Hobo 1": "Experience Hobo 1 - an engaging game with unique gameplay and challenges.",
    "Hobo 2": "Experience Hobo 2 - an engaging game with unique gameplay and challenges.",
    "Hobo 3": "Experience Hobo 3 - an engaging game with unique gameplay and challenges.",
    "Hobo 4": "Experience Hobo 4 - an engaging game with unique gameplay and challenges.",
    "Hobo 5": "Experience Hobo 5 - an engaging game with unique gameplay and challenges.",
    "Hobo 6": "Experience Hobo 6 - an engaging game with unique gameplay and challenges.",
    "Hobo 7": "Experience Hobo 7 - an engaging game with unique gameplay and challenges.",
    "Hollow Knight": "Experience Hollow Knight - an engaging game with unique gameplay and challenges.",
    "Hotline Miami": "Experience Hotline Miami - an engaging game with unique gameplay and challenges.",
    "House of Hazards": "Experience House of Hazards - an engaging game with unique gameplay and challenges.",
    "Hula Hoop Race": "Experience Hula Hoop Race - an engaging game with unique gameplay and challenges.",
    "Human Expenditure Program": "Experience Human Expenditure Program - an engaging game with unique gameplay and challenges.",
    "Hydrovolter": "Experience Hydrovolter - an engaging game with unique gameplay and challenges.",
    "Hypper Sandbox": "Experience Hypper Sandbox - an engaging game with unique gameplay and challenges.",
    "I woke up next to you again.": "Experience I woke up next to you again. - an engaging game with unique gameplay and challenges.",
    "Ice Dodo": "Experience Ice Dodo - an engaging game with unique gameplay and challenges.",
    "Idle Breakout": "Experience Idle Breakout - an engaging game with unique gameplay and challenges.",
    "Idle Dice": "Experience Idle Dice - an engaging game with unique gameplay and challenges.",
    "Idle Lumber Inc": "Experience Idle Lumber Inc - an engaging game with unique gameplay and challenges.",
    "Idle Mining Empire": "Experience Idle Mining Empire - an engaging game with unique gameplay and challenges.",
    "In Stars and Time": "Experience In Stars and Time - an engaging game with unique gameplay and challenges.",
    "Infinimoes": "Experience Infinimoes - an engaging game with unique gameplay and challenges.",
    "JavascriptPS1": "Experience JavascriptPS1 - an engaging game with unique gameplay and challenges.",
    "Jelly Drift": "Experience Jelly Drift - an engaging game with unique gameplay and challenges.",
    "Jelly Mario": "Experience Jelly Mario - an engaging game with unique gameplay and challenges.",
    "Jelly Restaurant": "Experience Jelly Restaurant - an engaging game with unique gameplay and challenges.",
    "Jetpack Joyride": "Experience Jetpack Joyride - an engaging game with unique gameplay and challenges.",
    "Johnny Trigger": "Experience Johnny Trigger - an engaging game with unique gameplay and challenges.",
    "Journey Downhill": "Experience Journey Downhill - an engaging game with unique gameplay and challenges.",
    "JustFall.lol": "Experience JustFall.lol - an engaging game with unique gameplay and challenges.",
    "Kaji Run": "Experience Kaji Run - an engaging game with unique gameplay and challenges.",
    "Karlson": "Experience Karlson - an engaging game with unique gameplay and challenges.",
    "Kindergarten": "Experience Kindergarten - an engaging game with unique gameplay and challenges.",
    "Kindergarten 2": "Experience Kindergarten 2 - an engaging game with unique gameplay and challenges.",
    "Kindergarten 3": "Experience Kindergarten 3 - an engaging game with unique gameplay and challenges.",
    "Kirby Squeak Squad": "Experience Kirby Squeak Squad - an engaging game with unique gameplay and challenges.",
    "Kirby Super Star Ultra": "Experience Kirby Super Star Ultra - an engaging game with unique gameplay and challenges.",
    "Kirby ~ Soft & Wet": "Experience Kirby ~ Soft & Wet - an engaging game with unique gameplay and challenges.",
    "Kitchen Bazar": "Experience Kitchen Bazar - an engaging game with unique gameplay and challenges.",
    "Kitty Toy": "Experience Kitty Toy - an engaging game with unique gameplay and challenges.",
    "Lacey's Flash Games": "Experience Lacey\'s Flash Games - an engaging game with unique gameplay and challenges.",
    "Layers Roll": "Experience Layers Roll - an engaging game with unique gameplay and challenges.",
    "Lazy Jumper": "Experience Lazy Jumper - an engaging game with unique gameplay and challenges.",
    "Learn to Fly": "Experience Learn to Fly - an engaging game with unique gameplay and challenges.",
    "Learn to Fly 2": "Experience Learn to Fly 2 - an engaging game with unique gameplay and challenges.",
    "Learn to Fly 3": "Experience Learn to Fly 3 - an engaging game with unique gameplay and challenges.",
    "Learn to Fly Idle": "Experience Learn to Fly Idle - an engaging game with unique gameplay and challenges.",
    "Line Rider": "Experience Line Rider - an engaging game with unique gameplay and challenges.",
    "Little Runmo": "Experience Little Runmo - an engaging game with unique gameplay and challenges.",
    "Look Outside": "Experience Look Outside - an engaging game with unique gameplay and challenges.",
    "Love Letters": "Experience Love Letters - an engaging game with unique gameplay and challenges.",
    "Madalin Stunt Cars 2": "Experience Madalin Stunt Cars 2 - an engaging game with unique gameplay and challenges.",
    "Madalin Stunt Cars 3": "Experience Madalin Stunt Cars 3 - an engaging game with unique gameplay and challenges.",
    "Madness Combat: Project Nexus (classic)": "Experience Madness Combat: Project Nexus (classic) - an engaging game with unique gameplay and challenges.",
    "Magic Tiles 3": "Experience Magic Tiles 3 - an engaging game with unique gameplay and challenges.",
    "Make a SuperBoat": "Experience Make a SuperBoat - an engaging game with unique gameplay and challenges.",
    "Makeover Run": "Experience Makeover Run - an engaging game with unique gameplay and challenges.",
    "Man Runner 2048": "Experience Man Runner 2048 - an engaging game with unique gameplay and challenges.",
    "Match Triple 3D": "Experience Match Triple 3D - an engaging game with unique gameplay and challenges.",
    "Maze Speedrun": "Experience Maze Speedrun - an engaging game with unique gameplay and challenges.",
    "Meatboy": "Experience Meatboy - an engaging game with unique gameplay and challenges.",
    "Mega Car Jumps": "Experience Mega Car Jumps - an engaging game with unique gameplay and challenges.",
    "Melon Playground": "Experience Melon Playground - an engaging game with unique gameplay and challenges.",
    "Merge Harvest": "Experience Merge Harvest - an engaging game with unique gameplay and challenges.",
    "Metal Gear Solid": "Experience Metal Gear Solid - an engaging game with unique gameplay and challenges.",
    "Midnight Shift": "Experience Midnight Shift - an engaging game with unique gameplay and challenges.",
    "Milk Inside a Bag of Milk Inside a Bag of Milk": "Experience Milk Inside a Bag of Milk Inside a Bag of Milk - an engaging game with unique gameplay and challenges.",
    "Milk Outside A Bag Of Milk Outside A Bag Of Milk": "Experience Milk Outside A Bag Of Milk Outside A Bag Of Milk - an engaging game with unique gameplay and challenges.",
    "Mindwave": "Experience Mindwave - an engaging game with unique gameplay and challenges.",
    "Minecraft 1.12.2": "Experience Minecraft 1.12.2 - an engaging game with unique gameplay and challenges.",
    "Minecraft 1.21.4": "Experience Minecraft 1.21.4 - an engaging game with unique gameplay and challenges.",
    "Minecraft 1.5.2": "Experience Minecraft 1.5.2 - an engaging game with unique gameplay and challenges.",
    "Minecraft 1.8.8": "Experience Minecraft 1.8.8 - an engaging game with unique gameplay and challenges.",
    "Minecraft Alpha 1.2.6": "Experience Minecraft Alpha 1.2.6 - an engaging game with unique gameplay and challenges.",
    "Minecraft Beta 1.3": "Experience Minecraft Beta 1.3 - an engaging game with unique gameplay and challenges.",
    "Minecraft Beta 1.7.3": "Experience Minecraft Beta 1.7.3 - an engaging game with unique gameplay and challenges.",
    "Minecraft Indev": "Experience Minecraft Indev - an engaging game with unique gameplay and challenges.",
    "Minesweeper Mania": "Experience Minesweeper Mania - an engaging game with unique gameplay and challenges.",
    "Minesweeper Plus": "Experience Minesweeper Plus - an engaging game with unique gameplay and challenges.",
    "Mob Control HTML5": "Experience Mob Control HTML5 - an engaging game with unique gameplay and challenges.",
    "Money Rush": "Experience Money Rush - an engaging game with unique gameplay and challenges.",
    "Monster Box 3D": "Experience Monster Box 3D - an engaging game with unique gameplay and challenges.",
    "Monster Tracks": "Experience Monster Tracks - an engaging game with unique gameplay and challenges.",
    "Moto X3M": "Experience Moto X3M - an engaging game with unique gameplay and challenges.",
    "Moto X3M 2": "Experience Moto X3M 2 - an engaging game with unique gameplay and challenges.",
    "Moto X3M 3": "Experience Moto X3M 3 - an engaging game with unique gameplay and challenges.",
    "Moto X3M Pool Party": "Experience Moto X3M Pool Party - an engaging game with unique gameplay and challenges.",
    "Moto X3M Spooky": "Experience Moto X3M Spooky - an engaging game with unique gameplay and challenges.",
    "Moto X3M Winter": "Experience Moto X3M Winter - an engaging game with unique gameplay and challenges.",
    "Mutilate a Doll 2": "Experience Mutilate a Doll 2 - an engaging game with unique gameplay and challenges.",
    "Nazi Zombies: Portable": "Experience Nazi Zombies: Portable - an engaging game with unique gameplay and challenges.",
    "Newgrounds Rumble": "Experience Newgrounds Rumble - an engaging game with unique gameplay and challenges.",
    "Nijika's Ahoge": "Experience Nijika\'s Ahoge - an engaging game with unique gameplay and challenges.",
    "Ninja vs EvilCorp": "Experience Ninja vs EvilCorp - an engaging game with unique gameplay and challenges.",
    "Nubby's Number Factory": "Experience Nubby\'s Number Factory - an engaging game with unique gameplay and challenges.",
    "OMORI": "Experience OMORI - an engaging game with unique gameplay and challenges.",
    "Off": "Experience Off - an engaging game with unique gameplay and challenges.",
    "Office Fight": "Experience Office Fight - an engaging game with unique gameplay and challenges.",
    "Offroad Mountain Bike": "Experience Offroad Mountain Bike - an engaging game with unique gameplay and challenges.",
    "Om Nom Run": "Experience Om Nom Run - an engaging game with unique gameplay and challenges.",
    "Oneshot (LEGACY)": "Experience Oneshot (LEGACY) - an engaging game with unique gameplay and challenges.",
    "Orange Roulette": "Experience Orange Roulette - an engaging game with unique gameplay and challenges.",
    "Oshi Oshi Punch!": "Experience Oshi Oshi Punch! - an engaging game with unique gameplay and challenges.",
    "OvO": "Experience OvO - an engaging game with unique gameplay and challenges.",
    "OvO 2": "Experience OvO 2 - an engaging game with unique gameplay and challenges.",
    "OvO 3 Dimensions": "Experience OvO 3 Dimensions - an engaging game with unique gameplay and challenges.",
    "Pac Man World": "Experience Pac Man World - an engaging game with unique gameplay and challenges.",
    "Pac Man World 2": "Experience Pac Man World 2 - an engaging game with unique gameplay and challenges.",
    "Pac-Man Superfast": "Experience Pac-Man Superfast - an engaging game with unique gameplay and challenges.",
    "PacMan (Horror)": "Experience PacMan (Horror) - an engaging game with unique gameplay and challenges.",
    "Papa's Bakeria": "Experience Papa\'s Bakeria - an engaging game with unique gameplay and challenges.",
    "Papa's Burgeria": "Experience Papa\'s Burgeria - an engaging game with unique gameplay and challenges.",
    "Papa's Cheeseria": "Experience Papa\'s Cheeseria - an engaging game with unique gameplay and challenges.",
    "Papa's Cupcakeria": "Experience Papa\'s Cupcakeria - an engaging game with unique gameplay and challenges.",
    "Papa's Donuteria": "Experience Papa\'s Donuteria - an engaging game with unique gameplay and challenges.",
    "Papa's Freezeria": "Experience Papa\'s Freezeria - an engaging game with unique gameplay and challenges.",
    "Papa's Hot Doggeria": "Experience Papa\'s Hot Doggeria - an engaging game with unique gameplay and challenges.",
    "Papa's Pancakeria": "Experience Papa\'s Pancakeria - an engaging game with unique gameplay and challenges.",
    "Papa's Pastaria": "Experience Papa\'s Pastaria - an engaging game with unique gameplay and challenges.",
    "Papa's Pizeria": "Experience Papa\'s Pizeria - an engaging game with unique gameplay and challenges.",
    "Papa's Scooperia": "Experience Papa\'s Scooperia - an engaging game with unique gameplay and challenges.",
    "Papa's Sushiria": "Experience Papa\'s Sushiria - an engaging game with unique gameplay and challenges.",
    "Papa's Taco Mia": "Experience Papa\'s Taco Mia - an engaging game with unique gameplay and challenges.",
    "Papa's Wingeria": "Experience Papa\'s Wingeria - an engaging game with unique gameplay and challenges.",
    "Paper.io 2": "Experience Paper.io 2 - an engaging game with unique gameplay and challenges.",
    "Papers, Please": "Experience Papers, Please - an engaging game with unique gameplay and challenges.",
    "Papery Planes": "Experience Papery Planes - an engaging game with unique gameplay and challenges.",
    "Parappa The Rapper": "Experience Parappa The Rapper - an engaging game with unique gameplay and challenges.",
    "Parking Fury 3D": "Experience Parking Fury 3D - an engaging game with unique gameplay and challenges.",
    "Parking Rush": "Experience Parking Rush - an engaging game with unique gameplay and challenges.",
    "Peggle": "Experience Peggle - an engaging game with unique gameplay and challenges.",
    "People Playground": "Experience People Playground - an engaging game with unique gameplay and challenges.",
    "Pico's School (1999)": "Experience Pico\'s School (1999) - an engaging game with unique gameplay and challenges.",
    "Pixel Gun Survival": "Experience Pixel Gun Survival - an engaging game with unique gameplay and challenges.",
    "Pizza Tower": "Experience Pizza Tower - an engaging game with unique gameplay and challenges.",
    "Pizza Tower: Scoutdigo": "Experience Pizza Tower: Scoutdigo - an engaging game with unique gameplay and challenges.",
    "Plants vs Zombies": "Experience Plants vs Zombies - an engaging game with unique gameplay and challenges.",
    "Plants vs. Zombies 2 Gardenless": "Experience Plants vs. Zombies 2 Gardenless - an engaging game with unique gameplay and challenges.",
    "Play!.js": "Experience Play!.js - an engaging game with unique gameplay and challenges.",
    "Please Dont Touch Anything": "Experience Please Dont Touch Anything - an engaging game with unique gameplay and challenges.",
    "Plinko": "Experience Plinko - an engaging game with unique gameplay and challenges.",
    "Pokemon Emerald": "Experience Pokemon Emerald - an engaging game with unique gameplay and challenges.",
    "Pokemon Firered": "Experience Pokemon Firered - an engaging game with unique gameplay and challenges.",
    "Pokemon HeartGold": "Experience Pokemon HeartGold - an engaging game with unique gameplay and challenges.",
    "Pokemon Red": "Experience Pokemon Red - an engaging game with unique gameplay and challenges.",
    "Pokey Ball": "Experience Pokey Ball - an engaging game with unique gameplay and challenges.",
    "Poly Track": "Experience Poly Track - an engaging game with unique gameplay and challenges.",
    "PortaBoy+": "Experience PortaBoy+ - an engaging game with unique gameplay and challenges.",
    "Postal": "Experience Postal - an engaging game with unique gameplay and challenges.",
    "Pottery Master": "Experience Pottery Master - an engaging game with unique gameplay and challenges.",
    "Pou": "Experience Pou - an engaging game with unique gameplay and challenges.",
    "Protektor": "Experience Protektor - an engaging game with unique gameplay and challenges.",
    "Quake III Arena": "Experience Quake III Arena - an engaging game with unique gameplay and challenges.",
    "R.E.P.O": "Experience R.E.P.O - an engaging game with unique gameplay and challenges.",
    "RE:RUN": "Experience RE:RUN - an engaging game with unique gameplay and challenges.",
    "Race Master 3D": "Experience Race Master 3D - an engaging game with unique gameplay and challenges.",
    "Raft": "Experience Raft - an engaging game with unique gameplay and challenges.",
    "Raft Wars": "Experience Raft Wars - an engaging game with unique gameplay and challenges.",
    "Raft Wars 2": "Experience Raft Wars 2 - an engaging game with unique gameplay and challenges.",
    "Ragdoll Archers": "Experience Ragdoll Archers - an engaging game with unique gameplay and challenges.",
    "Ragdoll Hit": "Experience Ragdoll Hit - an engaging game with unique gameplay and challenges.",
    "Rainbow Obby": "Experience Rainbow Obby - an engaging game with unique gameplay and challenges.",
    "Raldi's Crackhouse": "Experience Raldi\'s Crackhouse - an engaging game with unique gameplay and challenges.",
    "Real Flight Simulator": "Experience Real Flight Simulator - an engaging game with unique gameplay and challenges.",
    "Recoil": "Experience Recoil - an engaging game with unique gameplay and challenges.",
    "Red Ball": "Experience Red Ball - an engaging game with unique gameplay and challenges.",
    "Red Ball 2": "Experience Red Ball 2 - an engaging game with unique gameplay and challenges.",
    "Red Ball 3": "Experience Red Ball 3 - an engaging game with unique gameplay and challenges.",
    "Red Ball 4": "Experience Red Ball 4 - an engaging game with unique gameplay and challenges.",
    "Red Ball 4 Vol. 2": "Experience Red Ball 4 Vol. 2 - an engaging game with unique gameplay and challenges.",
    "Red Ball 4 Vol. 3": "Experience Red Ball 4 Vol. 3 - an engaging game with unique gameplay and challenges.",
    "Retro Bowl": "Experience Retro Bowl - an engaging game with unique gameplay and challenges.",
    "Retro Bowl College": "Experience Retro Bowl College - an engaging game with unique gameplay and challenges.",
    "Rich Run 3D": "Experience Rich Run 3D - an engaging game with unique gameplay and challenges.",
    "Riddle School": "Experience Riddle School - an engaging game with unique gameplay and challenges.",
    "Riddle School 2": "Experience Riddle School 2 - an engaging game with unique gameplay and challenges.",
    "Riddle School 3": "Experience Riddle School 3 - an engaging game with unique gameplay and challenges.",
    "Riddle School 4": "Experience Riddle School 4 - an engaging game with unique gameplay and challenges.",
    "Riddle School 5": "Experience Riddle School 5 - an engaging game with unique gameplay and challenges.",
    "Riddle Transfer": "Experience Riddle Transfer - an engaging game with unique gameplay and challenges.",
    "Riddle Transfer 2": "Experience Riddle Transfer 2 - an engaging game with unique gameplay and challenges.",
    "RigBMX": "Experience RigBMX - an engaging game with unique gameplay and challenges.",
    "RigBMX 2": "Experience RigBMX 2 - an engaging game with unique gameplay and challenges.",
    "Rio Rex": "Experience Rio Rex - an engaging game with unique gameplay and challenges.",
    "Road of Fury": "Experience Road of Fury - an engaging game with unique gameplay and challenges.",
    "Robot Invasion": "Experience Robot Invasion - an engaging game with unique gameplay and challenges.",
    "Rogue Sergeant The Final Operation": "Experience Rogue Sergeant The Final Operation - an engaging game with unique gameplay and challenges.",
    "Rolling Sky": "Experience Rolling Sky - an engaging game with unique gameplay and challenges.",
    "Rolly Vortex": "Experience Rolly Vortex - an engaging game with unique gameplay and challenges.",
    "Rooftop Snipers": "Experience Rooftop Snipers - an engaging game with unique gameplay and challenges.",
    "Rooftop Snipers 2": "Experience Rooftop Snipers 2 - an engaging game with unique gameplay and challenges.",
    "Room Sort": "Experience Room Sort - an engaging game with unique gameplay and challenges.",
    "Royal Towers: Medieval TD": "Experience Royal Towers: Medieval TD - an engaging game with unique gameplay and challenges.",
    "Ruffle": "Experience Ruffle - an engaging game with unique gameplay and challenges.",
    "Run 1": "Experience Run 1 - an engaging game with unique gameplay and challenges.",
    "Run 2": "Experience Run 2 - an engaging game with unique gameplay and challenges.",
    "Run 3": "Experience Run 3 - an engaging game with unique gameplay and challenges.",
    "Sandboxels": "Experience Sandboxels - an engaging game with unique gameplay and challenges.",
    "Sandtris": "Experience Sandtris - an engaging game with unique gameplay and challenges.",
    "Schoolboy Runaway": "Experience Schoolboy Runaway - an engaging game with unique gameplay and challenges.",
    "Scrap Metal 3": "Experience Scrap Metal 3 - an engaging game with unique gameplay and challenges.",
    "Seat Jam 3D": "Experience Seat Jam 3D - an engaging game with unique gameplay and challenges.",
    "Shapez.io": "Experience Shapez.io - an engaging game with unique gameplay and challenges.",
    "Shipo.io": "Experience Shipo.io - an engaging game with unique gameplay and challenges.",
    "Shooting Master": "Experience Shooting Master - an engaging game with unique gameplay and challenges.",
    "Shovel 3D": "Experience Shovel 3D - an engaging game with unique gameplay and challenges.",
    "Side Effects": "Experience Side Effects - an engaging game with unique gameplay and challenges.",
    "Sky Riders": "Experience Sky Riders - an engaging game with unique gameplay and challenges.",
    "Slender: The 8 Pages": "Experience Slender: The 8 Pages - an engaging game with unique gameplay and challenges.",
    "Slice it All": "Experience Slice it All - an engaging game with unique gameplay and challenges.",
    "Slime Rancher": "Experience Slime Rancher - an engaging game with unique gameplay and challenges.",
    "Slime.io": "Experience Slime.io - an engaging game with unique gameplay and challenges.",
    "Slither.io": "Experience Slither.io - an engaging game with unique gameplay and challenges.",
    "Slope": "Experience Slope - an engaging game with unique gameplay and challenges.",
    "Slope 2": "Experience Slope 2 - an engaging game with unique gameplay and challenges.",
    "Slowroads": "Experience Slowroads - an engaging game with unique gameplay and challenges.",
    "Smash Karts": "Experience Smash Karts - an engaging game with unique gameplay and challenges.",
    "Snow Rider 3D": "Experience Snow Rider 3D - an engaging game with unique gameplay and challenges.",
    "Snowbattle.io": "Experience Snowbattle.io - an engaging game with unique gameplay and challenges.",
    "Solar Smash": "Experience Solar Smash - an engaging game with unique gameplay and challenges.",
    "Sonic CD": "Experience Sonic CD - an engaging game with unique gameplay and challenges.",
    "Sonic Mania": "Experience Sonic Mania - an engaging game with unique gameplay and challenges.",
    "Sonic the Hedgehog 2: Community's Cut": "Experience Sonic the Hedgehog 2: Community\'s Cut - an engaging game with unique gameplay and challenges.",
    "Sonic the Hedgehog 3: Angel Island Remastered": "Experience Sonic the Hedgehog 3: Angel Island Remastered - an engaging game with unique gameplay and challenges.",
    "Sonic.EXE": "Experience Sonic.EXE - an engaging game with unique gameplay and challenges.",
    "Sonic.EXE (ORIGINAL)": "Experience Sonic.EXE (ORIGINAL) - an engaging game with unique gameplay and challenges.",
    "Sort the Court": "Experience Sort the Court - an engaging game with unique gameplay and challenges.",
    "Soundboard": "Experience Soundboard - an engaging game with unique gameplay and challenges.",
    "Space Funeral": "Experience Space Funeral - an engaging game with unique gameplay and challenges.",
    "Space Waves": "Experience Space Waves - an engaging game with unique gameplay and challenges.",
    "Spacebar Clicker": "Experience Spacebar Clicker - an engaging game with unique gameplay and challenges.",
    "Speed Stars": "Experience Speed Stars - an engaging game with unique gameplay and challenges.",
    "Spelunky Classic HD": "Experience Spelunky Classic HD - an engaging game with unique gameplay and challenges.",
    "SpiderDoll": "Experience SpiderDoll - an engaging game with unique gameplay and challenges.",
    "Spiral Roll": "Experience Spiral Roll - an engaging game with unique gameplay and challenges.",
    "SpongeBob SquarePants: Krabby Katch": "Experience SpongeBob SquarePants: Krabby Katch - an engaging game with unique gameplay and challenges.",
    "SpongeBob SquarePants: Land Ho!": "Experience SpongeBob SquarePants: Land Ho! - an engaging game with unique gameplay and challenges.",
    "SpongeBob SquarePants: Sandy's Sponge Stacker": "Experience SpongeBob SquarePants: Sandy\'s Sponge Stacker - an engaging game with unique gameplay and challenges.",
    "SpongeBob SquarePants: SpongeBob Run": "Experience SpongeBob SquarePants: SpongeBob Run - an engaging game with unique gameplay and challenges.",
    "SpongeBob SquarePants: Squidward's Sizzlin' Scare": "Experience SpongeBob SquarePants: Squidward\'s Sizzlin\' Scare - an engaging game with unique gameplay and challenges.",
    "SpongeBob SquarePants: Tasty Pastry Party": "Experience SpongeBob SquarePants: Tasty Pastry Party - an engaging game with unique gameplay and challenges.",
    "SpongeBob SquarePants: The Kah-Ray-Tay Squid": "Experience SpongeBob SquarePants: The Kah-Ray-Tay Squid - an engaging game with unique gameplay and challenges.",
    "SpongeBob SquarePants: WereSquirrel": "Experience SpongeBob SquarePants: WereSquirrel - an engaging game with unique gameplay and challenges.",
    "Sprunki": "Experience Sprunki - an engaging game with unique gameplay and challenges.",
    "Stacky Dash": "Experience Stacky Dash - an engaging game with unique gameplay and challenges.",
    "State.io": "Experience State.io - an engaging game with unique gameplay and challenges.",
    "Station 141": "Experience Station 141 - an engaging game with unique gameplay and challenges.",
    "Station Saturn": "Experience Station Saturn - an engaging game with unique gameplay and challenges.",
    "Steal A Brainrot": "Experience Steal A Brainrot - an engaging game with unique gameplay and challenges.",
    "Steal Brainrot Online": "Experience Steal Brainrot Online - an engaging game with unique gameplay and challenges.",
    "Stick War: Legacy": "Experience Stick War: Legacy - an engaging game with unique gameplay and challenges.",
    "Stick With It": "Experience Stick With It - an engaging game with unique gameplay and challenges.",
    "Stickman Boost": "Experience Stickman Boost - an engaging game with unique gameplay and challenges.",
    "Stickman Climb": "Experience Stickman Climb - an engaging game with unique gameplay and challenges.",
    "Stickman Destruction": "Experience Stickman Destruction - an engaging game with unique gameplay and challenges.",
    "Stickman Fight Ragdoll": "Experience Stickman Fight Ragdoll - an engaging game with unique gameplay and challenges.",
    "Stickman Golf": "Experience Stickman Golf - an engaging game with unique gameplay and challenges.",
    "Stickman Hook": "Experience Stickman Hook - an engaging game with unique gameplay and challenges.",
    "Stickman and Guns": "Experience Stickman and Guns - an engaging game with unique gameplay and challenges.",
    "Stone Grass Mowing Simulator": "Experience Stone Grass Mowing Simulator - an engaging game with unique gameplay and challenges.",
    "Super Mario 63": "Experience Super Mario 63 - an engaging game with unique gameplay and challenges.",
    "Super Mario 64": "Experience Super Mario 64 - an engaging game with unique gameplay and challenges.",
    "Super Mario Bros": "Experience Super Mario Bros - an engaging game with unique gameplay and challenges.",
    "Super Smash Flash": "Experience Super Smash Flash - an engaging game with unique gameplay and challenges.",
    "Super Star Car": "Experience Super Star Car - an engaging game with unique gameplay and challenges.",
    "Superhot": "Experience Superhot - an engaging game with unique gameplay and challenges.",
    "Supermarket 3D": "Experience Supermarket 3D - an engaging game with unique gameplay and challenges.",
    "Supreme Duelist": "Experience Supreme Duelist - an engaging game with unique gameplay and challenges.",
    "Survival Race": "Experience Survival Race - an engaging game with unique gameplay and challenges.",
    "Survive to Victory": "Experience Survive to Victory - an engaging game with unique gameplay and challenges.",
    "Sushi Roll": "Experience Sushi Roll - an engaging game with unique gameplay and challenges.",
    "Swordfight!!": "Experience Swordfight!! - an engaging game with unique gameplay and challenges.",
    "Swords and Souls": "Experience Swords and Souls - an engaging game with unique gameplay and challenges.",
    "Tag": "Experience Tag - an engaging game with unique gameplay and challenges.",
    "Tall Man Run": "Experience Tall Man Run - an engaging game with unique gameplay and challenges.",
    "Tall.io": "Experience Tall.io - an engaging game with unique gameplay and challenges.",
    "Tanuki Sunset": "Experience Tanuki Sunset - an engaging game with unique gameplay and challenges.",
    "Tattletail": "Experience Tattletail - an engaging game with unique gameplay and challenges.",
    "Teen Titans GO!: Jump Jousts": "Experience Teen Titans GO!: Jump Jousts - an engaging game with unique gameplay and challenges.",
    "Teen Titans GO!: Jump Jousts 2": "Experience Teen Titans GO!: Jump Jousts 2 - an engaging game with unique gameplay and challenges.",
    "Telekinesis": "Experience Telekinesis - an engaging game with unique gameplay and challenges.",
    "Telekinesis Attack": "Experience Telekinesis Attack - an engaging game with unique gameplay and challenges.",
    "Telekinesis Car": "Experience Telekinesis Car - an engaging game with unique gameplay and challenges.",
    "Telekinesis Drive": "Experience Telekinesis Drive - an engaging game with unique gameplay and challenges.",
    "Temple Run 2": "Experience Temple Run 2 - an engaging game with unique gameplay and challenges.",
    "Terraria": "Experience Terraria - an engaging game with unique gameplay and challenges.",
    "Territorial.io": "Experience Territorial.io - an engaging game with unique gameplay and challenges.",
    "That's Not My Neighbor": "Experience That\'s Not My Neighbor - an engaging game with unique gameplay and challenges.",
    "The Deadseat": "Experience The Deadseat - an engaging game with unique gameplay and challenges.",
    "The Impossible Quiz": "Experience The Impossible Quiz - an engaging game with unique gameplay and challenges.",
    "The Legend of Zelda Majora's Mask": "Experience The Legend of Zelda Majora\'s Mask - an engaging game with unique gameplay and challenges.",
    "The Legend of Zelda Ocarina of Time": "Experience The Legend of Zelda Ocarina of Time - an engaging game with unique gameplay and challenges.",
    "The Man In The Window": "Experience The Man In The Window - an engaging game with unique gameplay and challenges.",
    "The Oregon Trail": "Experience The Oregon Trail - an engaging game with unique gameplay and challenges.",
    "The World's Hardest Game": "Experience The World\'s Hardest Game - an engaging game with unique gameplay and challenges.",
    "The World's Hardest Game 3": "Experience The World\'s Hardest Game 3 - an engaging game with unique gameplay and challenges.",
    "The World's Hardest Game 4": "Experience The World\'s Hardest Game 4 - an engaging game with unique gameplay and challenges.",
    "They Are Coming": "Experience They Are Coming - an engaging game with unique gameplay and challenges.",
    "This Is The Only Level": "Experience This Is The Only Level - an engaging game with unique gameplay and challenges.",
    "This Is The Only Level 2": "Experience This Is The Only Level 2 - an engaging game with unique gameplay and challenges.",
    "Three Goblets": "Experience Three Goblets - an engaging game with unique gameplay and challenges.",
    "TileTopia": "Experience TileTopia - an engaging game with unique gameplay and challenges.",
    "Time Shooter 1": "Experience Time Shooter 1 - an engaging game with unique gameplay and challenges.",
    "Time Shooter 2": "Experience Time Shooter 2 - an engaging game with unique gameplay and challenges.",
    "Time Shooter 3: SWAT": "Experience Time Shooter 3: SWAT - an engaging game with unique gameplay and challenges.",
    "Tiny Fishing": "Experience Tiny Fishing - an engaging game with unique gameplay and challenges.",
    "Tomb Of The Mask": "Experience Tomb Of The Mask - an engaging game with unique gameplay and challenges.",
    "Tomodachi Collection": "Experience Tomodachi Collection - an engaging game with unique gameplay and challenges.",
    "Toss The Turtle": "Experience Toss The Turtle - an engaging game with unique gameplay and challenges.",
    "Touhou Mother": "Experience Touhou Mother - an engaging game with unique gameplay and challenges.",
    "Touhou: Luminous Strike": "Experience Touhou: Luminous Strike - an engaging game with unique gameplay and challenges.",
    "Tower Crash 3D": "Experience Tower Crash 3D - an engaging game with unique gameplay and challenges.",
    "Toy Rider": "Experience Toy Rider - an engaging game with unique gameplay and challenges.",
    "Traffic Rider": "Experience Traffic Rider - an engaging game with unique gameplay and challenges.",
    "Trivia Crack": "Experience Trivia Crack - an engaging game with unique gameplay and challenges.",
    "Tube Jumpers": "Experience Tube Jumpers - an engaging game with unique gameplay and challenges.",
    "Tug of War with Cars": "Experience Tug of War with Cars - an engaging game with unique gameplay and challenges.",
    "Tunnel Rush": "Experience Tunnel Rush - an engaging game with unique gameplay and challenges.",
    "Turbo Stars": "Experience Turbo Stars - an engaging game with unique gameplay and challenges.",
    "Twerk Race 3D": "Experience Twerk Race 3D - an engaging game with unique gameplay and challenges.",
    "Twisted Rope 3D": "Experience Twisted Rope 3D - an engaging game with unique gameplay and challenges.",
    "ULTRAKILL": "Experience ULTRAKILL - an engaging game with unique gameplay and challenges.",
    "UNDERWHEELS": "Experience UNDERWHEELS - an engaging game with unique gameplay and challenges.",
    "Undertale Yellow": "Experience Undertale Yellow - an engaging game with unique gameplay and challenges.",
    "VS Rewrite: ROUND 2": "Experience VS Rewrite: ROUND 2 - an engaging game with unique gameplay and challenges.",
    "Vex 1": "Experience Vex 1 - an engaging game with unique gameplay and challenges.",
    "Vex 2": "Experience Vex 2 - an engaging game with unique gameplay and challenges.",
    "Vex 3": "Experience Vex 3 - an engaging game with unique gameplay and challenges.",
    "Vex 3 XMAS": "Experience Vex 3 XMAS - an engaging game with unique gameplay and challenges.",
    "Vex 4": "Experience Vex 4 - an engaging game with unique gameplay and challenges.",
    "Vex 5": "Experience Vex 5 - an engaging game with unique gameplay and challenges.",
    "Vex 6": "Experience Vex 6 - an engaging game with unique gameplay and challenges.",
    "Vex 7": "Experience Vex 7 - an engaging game with unique gameplay and challenges.",
    "Vex 8": "Experience Vex 8 - an engaging game with unique gameplay and challenges.",
    "Vex Challenges": "Experience Vex Challenges - an engaging game with unique gameplay and challenges.",
    "Vex X3M": "Experience Vex X3M - an engaging game with unique gameplay and challenges.",
    "Vex X3M 2": "Experience Vex X3M 2 - an engaging game with unique gameplay and challenges.",
    "Wall Crawler": "Experience Wall Crawler - an engaging game with unique gameplay and challenges.",
    "War Regions": "Experience War Regions - an engaging game with unique gameplay and challenges.",
    "War The Knights": "Experience War The Knights - an engaging game with unique gameplay and challenges.",
    "Waterworks!": "Experience Waterworks! - an engaging game with unique gameplay and challenges.",
    "We Become What We Behold": "Experience We Become What We Behold - an engaging game with unique gameplay and challenges.",
    "Weapon Craft Run": "Experience Weapon Craft Run - an engaging game with unique gameplay and challenges.",
    "Weapon Scale": "Experience Weapon Scale - an engaging game with unique gameplay and challenges.",
    "Weapon Upgrade Rush": "Experience Weapon Upgrade Rush - an engaging game with unique gameplay and challenges.",
    "WebFishing": "Experience WebFishing - an engaging game with unique gameplay and challenges.",
    "Wheely": "Experience Wheely - an engaging game with unique gameplay and challenges.",
    "Wheely 2": "Experience Wheely 2 - an engaging game with unique gameplay and challenges.",
    "Wheely 3": "Experience Wheely 3 - an engaging game with unique gameplay and challenges.",
    "Wheely 4": "Experience Wheely 4 - an engaging game with unique gameplay and challenges.",
    "Wheely 5": "Experience Wheely 5 - an engaging game with unique gameplay and challenges.",
    "Wheely 6": "Experience Wheely 6 - an engaging game with unique gameplay and challenges.",
    "Wheely 7": "Experience Wheely 7 - an engaging game with unique gameplay and challenges.",
    "Wheely 8": "Experience Wheely 8 - an engaging game with unique gameplay and challenges.",
    "Wordle": "Experience Wordle - an engaging game with unique gameplay and challenges.",
    "World Box": "Experience World Box - an engaging game with unique gameplay and challenges.",
    "Yandere Simulator": "Experience Yandere Simulator - an engaging game with unique gameplay and challenges.",
    "Yume Nikki": "Experience Yume Nikki - an engaging game with unique gameplay and challenges.",
    "[!] COMMENTS": "Experience [!] COMMENTS - an engaging game with unique gameplay and challenges.",
    "abuda the alien": "Experience abuda the alien - an engaging game with unique gameplay and challenges.",
    "ace attorney": "Experience ace attorney - an engaging game with unique gameplay and challenges.",
    "adofai": "Experience adofai - an engaging game with unique gameplay and challenges.",
    "advance wars": "Experience advance wars - an engaging game with unique gameplay and challenges.",
    "advance wars 2": "Experience advance wars 2 - an engaging game with unique gameplay and challenges.",
    "advance wars days of ruin": "Experience advance wars days of ruin - an engaging game with unique gameplay and challenges.",
    "adventure captialist": "Experience adventure captialist - an engaging game with unique gameplay and challenges.",
    "adventure time": "Experience adventure time - an engaging game with unique gameplay and challenges.",
    "age of war": "Experience age of war - an engaging game with unique gameplay and challenges.",
    "age of war 2": "Experience age of war 2 - an engaging game with unique gameplay and challenges.",
    "altered beast": "Experience altered beast - an engaging game with unique gameplay and challenges.",
    "amazing rope police": "Experience amazing rope police - an engaging game with unique gameplay and challenges.",
    "among us fangame": "Experience among us fangame - an engaging game with unique gameplay and challenges.",
    "amorphous": "Experience amorphous - an engaging game with unique gameplay and challenges.",
    "animal crossing": "Experience animal crossing - an engaging game with unique gameplay and challenges.",
    "aquapark slides": "Experience aquapark slides - an engaging game with unique gameplay and challenges.",
    "backrooms 2d": "Experience backrooms 2d - an engaging game with unique gameplay and challenges.",
    "bad piggies": "Experience bad piggies - an engaging game with unique gameplay and challenges.",
    "ballistic chickens": "Experience ballistic chickens - an engaging game with unique gameplay and challenges.",
    "balloon run": "Experience balloon run - an engaging game with unique gameplay and challenges.",
    "banjo kazooie": "Experience banjo kazooie - an engaging game with unique gameplay and challenges.",
    "banjo pilot": "Experience banjo pilot - an engaging game with unique gameplay and challenges.",
    "banjo tooie": "Experience banjo tooie - an engaging game with unique gameplay and challenges.",
    "basketbros io": "Experience basketbros io - an engaging game with unique gameplay and challenges.",
    "battle beavers": "Experience battle beavers - an engaging game with unique gameplay and challenges.",
    "battleships": "Experience battleships - an engaging game with unique gameplay and challenges.",
    "battletoads": "Experience battletoads - an engaging game with unique gameplay and challenges.",
    "big red button": "Experience big red button - an engaging game with unique gameplay and challenges.",
    "bike champ": "Experience bike champ - an engaging game with unique gameplay and challenges.",
    "bike champ 2": "Experience bike champ 2 - an engaging game with unique gameplay and challenges.",
    "bloxors": "Experience bloxors - an engaging game with unique gameplay and challenges.",
    "bomberman": "Experience bomberman - an engaging game with unique gameplay and challenges.",
    "bowsers inside story": "Experience bowsers inside story - an engaging game with unique gameplay and challenges.",
    "boxing physics 2": "Experience boxing physics 2 - an engaging game with unique gameplay and challenges.",
    "breaking the bank": "Experience breaking the bank - an engaging game with unique gameplay and challenges.",
    "btd": "Experience btd - an engaging game with unique gameplay and challenges.",
    "btd 2": "Experience btd 2 - an engaging game with unique gameplay and challenges.",
    "btd 3": "Experience btd 3 - an engaging game with unique gameplay and challenges.",
    "btd 4": "Experience btd 4 - an engaging game with unique gameplay and challenges.",
    "bubble spinner": "Experience bubble spinner - an engaging game with unique gameplay and challenges.",
    "bubble tanks 2": "Experience bubble tanks 2 - an engaging game with unique gameplay and challenges.",
    "burger and frights": "Experience burger and frights - an engaging game with unique gameplay and challenges.",
    "cactus mccoy": "Experience cactus mccoy - an engaging game with unique gameplay and challenges.",
    "cactus mccoy 2": "Experience cactus mccoy 2 - an engaging game with unique gameplay and challenges.",
    "canopy": "Experience canopy - an engaging game with unique gameplay and challenges.",
    "cars 2": "Experience cars 2 - an engaging game with unique gameplay and challenges.",
    "castlevania": "Experience castlevania - an engaging game with unique gameplay and challenges.",
    "castlevania aria of sorrow": "Experience castlevania aria of sorrow - an engaging game with unique gameplay and challenges.",
    "castlevania dawn of sorrow": "Experience castlevania dawn of sorrow - an engaging game with unique gameplay and challenges.",
    "cave chaos": "Experience cave chaos - an engaging game with unique gameplay and challenges.",
    "cell machine": "Experience cell machine - an engaging game with unique gameplay and challenges.",
    "champion island": "Experience champion island - an engaging game with unique gameplay and challenges.",
    "change type": "Experience change type - an engaging game with unique gameplay and challenges.",
    "cheese dreams": "Experience cheese dreams - an engaging game with unique gameplay and challenges.",
    "chess": "Experience chess - an engaging game with unique gameplay and challenges.",
    "chibi knight": "Experience chibi knight - an engaging game with unique gameplay and challenges.",
    "chisel": "Experience chisel - an engaging game with unique gameplay and challenges.",
    "chisel 2": "Experience chisel 2 - an engaging game with unique gameplay and challenges.",
    "choose your weapon": "Experience choose your weapon - an engaging game with unique gameplay and challenges.",
    "choose your weapon 2": "Experience choose your weapon 2 - an engaging game with unique gameplay and challenges.",
    "choose your weapon 3": "Experience choose your weapon 3 - an engaging game with unique gameplay and challenges.",
    "chrome dino game": "Experience chrome dino game - an engaging game with unique gameplay and challenges.",
    "chrono trigger": "Experience chrono trigger - an engaging game with unique gameplay and challenges.",
    "clicker heroes": "Experience clicker heroes - an engaging game with unique gameplay and challenges.",
    "color switch": "Experience color switch - an engaging game with unique gameplay and challenges.",
    "comix zone": "Experience comix zone - an engaging game with unique gameplay and challenges.",
    "connect 4": "Experience connect 4 - an engaging game with unique gameplay and challenges.",
    "contra": "Experience contra - an engaging game with unique gameplay and challenges.",
    "contra iii": "Experience contra iii - an engaging game with unique gameplay and challenges.",
    "control craft 2": "Experience control craft 2 - an engaging game with unique gameplay and challenges.",
    "corporation inc": "Experience corporation inc - an engaging game with unique gameplay and challenges.",
    "crazy tunnel 3d": "Experience crazy tunnel 3d - an engaging game with unique gameplay and challenges.",
    "crimson fantasia": "Experience crimson fantasia - an engaging game with unique gameplay and challenges.",
    "crush the castle": "Experience crush the castle - an engaging game with unique gameplay and challenges.",
    "crush the castle 2": "Experience crush the castle 2 - an engaging game with unique gameplay and challenges.",
    "csgo clicker": "Experience csgo clicker - an engaging game with unique gameplay and challenges.",
    "dbz: supersonic warriors": "Experience dbz: supersonic warriors - an engaging game with unique gameplay and challenges.",
    "defend the tank": "Experience defend the tank - an engaging game with unique gameplay and challenges.",
    "diddy kong racing": "Experience diddy kong racing - an engaging game with unique gameplay and challenges.",
    "ditto": "Experience ditto - an engaging game with unique gameplay and challenges.",
    "donkey kong": "Experience donkey kong - an engaging game with unique gameplay and challenges.",
    "donkey kong 64": "Experience donkey kong 64 - an engaging game with unique gameplay and challenges.",
    "donkey kong country": "Experience donkey kong country - an engaging game with unique gameplay and challenges.",
    "donkey kong country 2": "Experience donkey kong country 2 - an engaging game with unique gameplay and challenges.",
    "donkey kong country 3": "Experience donkey kong country 3 - an engaging game with unique gameplay and challenges.",
    "donkey kong land": "Experience donkey kong land - an engaging game with unique gameplay and challenges.",
    "doodle defender": "Experience doodle defender - an engaging game with unique gameplay and challenges.",
    "doom 64": "Experience doom 64 - an engaging game with unique gameplay and challenges.",
    "dr mario": "Experience dr mario - an engaging game with unique gameplay and challenges.",
    "dragon boy 2": "Experience dragon boy 2 - an engaging game with unique gameplay and challenges.",
    "drift mania": "Experience drift mania - an engaging game with unique gameplay and challenges.",
    "drill dozer": "Experience drill dozer - an engaging game with unique gameplay and challenges.",
    "duck life 6": "Experience duck life 6 - an engaging game with unique gameplay and challenges.",
    "duck tales": "Experience duck tales - an engaging game with unique gameplay and challenges.",
    "duke nukem 64": "Experience duke nukem 64 - an engaging game with unique gameplay and challenges.",
    "duke nukem advance": "Experience duke nukem advance - an engaging game with unique gameplay and challenges.",
    "earthbound": "Experience earthbound - an engaging game with unique gameplay and challenges.",
    "ecco the dolphin": "Experience ecco the dolphin - an engaging game with unique gameplay and challenges.",
    "edge surf": "Experience edge surf - an engaging game with unique gameplay and challenges.",
    "electric box": "Experience electric box - an engaging game with unique gameplay and challenges.",
    "electric man 2": "Experience electric man 2 - an engaging game with unique gameplay and challenges.",
    "epic battle fantasy": "Experience epic battle fantasy - an engaging game with unique gameplay and challenges.",
    "epic battle fantasy 2": "Experience epic battle fantasy 2 - an engaging game with unique gameplay and challenges.",
    "epic battle fantasy 3": "Experience epic battle fantasy 3 - an engaging game with unique gameplay and challenges.",
    "escaping the prison": "Experience escaping the prison - an engaging game with unique gameplay and challenges.",
    "excitebike 64": "Experience excitebike 64 - an engaging game with unique gameplay and challenges.",
    "f-zero": "Experience f-zero - an engaging game with unique gameplay and challenges.",
    "f-zero x": "Experience f-zero x - an engaging game with unique gameplay and challenges.",
    "factory balls": "Experience factory balls - an engaging game with unique gameplay and challenges.",
    "feed me": "Experience feed me - an engaging game with unique gameplay and challenges.",
    "final fantasy iv": "Experience final fantasy iv - an engaging game with unique gameplay and challenges.",
    "final fantasy tactics adv": "Experience final fantasy tactics adv - an engaging game with unique gameplay and challenges.",
    "final ninja": "Experience final ninja - an engaging game with unique gameplay and challenges.",
    "fire emblem": "Experience fire emblem - an engaging game with unique gameplay and challenges.",
    "fireboy and watergirl": "Experience fireboy and watergirl - an engaging game with unique gameplay and challenges.",
    "fleeing the complex": "Experience fleeing the complex - an engaging game with unique gameplay and challenges.",
    "flippy fish": "Experience flippy fish - an engaging game with unique gameplay and challenges.",
    "flood runner 2": "Experience flood runner 2 - an engaging game with unique gameplay and challenges.",
    "flood runner 3": "Experience flood runner 3 - an engaging game with unique gameplay and challenges.",
    "fnaf 1": "Experience fnaf 1 - an engaging game with unique gameplay and challenges.",
    "fnaf 2": "Experience fnaf 2 - an engaging game with unique gameplay and challenges.",
    "fnaf 3": "Experience fnaf 3 - an engaging game with unique gameplay and challenges.",
    "fnaf 4": "Experience fnaf 4 - an engaging game with unique gameplay and challenges.",
    "fnf mid fight masses": "Experience fnf mid fight masses - an engaging game with unique gameplay and challenges.",
    "frost bite": "Experience frost bite - an engaging game with unique gameplay and challenges.",
    "frost bite 2": "Experience frost bite 2 - an engaging game with unique gameplay and challenges.",
    "funny mad racing": "Experience funny mad racing - an engaging game with unique gameplay and challenges.",
    "funny shooter 2": "Experience funny shooter 2 - an engaging game with unique gameplay and challenges.",
    "garfield gets real": "Experience garfield gets real - an engaging game with unique gameplay and challenges.",
    "geometry dash lite": "Experience geometry dash lite - an engaging game with unique gameplay and challenges.",
    "geometry dash sky": "Experience geometry dash sky - an engaging game with unique gameplay and challenges.",
    "geometry rash": "Experience geometry rash - an engaging game with unique gameplay and challenges.",
    "gex 64": "Experience gex 64 - an engaging game with unique gameplay and challenges.",
    "go ball": "Experience go ball - an engaging game with unique gameplay and challenges.",
    "gold digger frvr": "Experience gold digger frvr - an engaging game with unique gameplay and challenges.",
    "golden axe": "Experience golden axe - an engaging game with unique gameplay and challenges.",
    "golden eye 007": "Experience golden eye 007 - an engaging game with unique gameplay and challenges.",
    "golden sun": "Experience golden sun - an engaging game with unique gameplay and challenges.",
    "grand theft grotto": "Experience grand theft grotto - an engaging game with unique gameplay and challenges.",
    "groon groon, babey!": "Experience groon groon, babey! - an engaging game with unique gameplay and challenges.",
    "gun fest": "Experience gun fest - an engaging game with unique gameplay and challenges.",
    "gun mayhem": "Experience gun mayhem - an engaging game with unique gameplay and challenges.",
    "gun mayhem 2": "Experience gun mayhem 2 - an engaging game with unique gameplay and challenges.",
    "gun mayhem redux": "Experience gun mayhem redux - an engaging game with unique gameplay and challenges.",
    "gunstar heroes": "Experience gunstar heroes - an engaging game with unique gameplay and challenges.",
    "harvest moon": "Experience harvest moon - an engaging game with unique gameplay and challenges.",
    "harvest moon 64": "Experience harvest moon 64 - an engaging game with unique gameplay and challenges.",
    "helix jump": "Experience helix jump - an engaging game with unique gameplay and challenges.",
    "hexgl": "Experience hexgl - an engaging game with unique gameplay and challenges.",
    "hole io": "Experience hole io - an engaging game with unique gameplay and challenges.",
    "ice climber": "Experience ice climber - an engaging game with unique gameplay and challenges.",
    "icebreaker": "Experience icebreaker - an engaging game with unique gameplay and challenges.",
    "illusion of gaia": "Experience illusion of gaia - an engaging game with unique gameplay and challenges.",
    "infiltrating the airship": "Experience infiltrating the airship - an engaging game with unique gameplay and challenges.",
    "infinite craft": "Experience infinite craft - an engaging game with unique gameplay and challenges.",
    "jet force gemini": "Experience jet force gemini - an engaging game with unique gameplay and challenges.",
    "just fall lol": "Experience just fall lol - an engaging game with unique gameplay and challenges.",
    "kid icarus": "Experience kid icarus - an engaging game with unique gameplay and challenges.",
    "kirby 64": "Experience kirby 64 - an engaging game with unique gameplay and challenges.",
    "kirby amazing mirror": "Experience kirby amazing mirror - an engaging game with unique gameplay and challenges.",
    "kirby mass attack": "Experience kirby mass attack - an engaging game with unique gameplay and challenges.",
    "kirby power paintbrush": "Experience kirby power paintbrush - an engaging game with unique gameplay and challenges.",
    "kirby's dream land": "Experience kirby\'s dream land - an engaging game with unique gameplay and challenges.",
    "kirby's dreamland 2": "Experience kirby\'s dreamland 2 - an engaging game with unique gameplay and challenges.",
    "knife hit": "Experience knife hit - an engaging game with unique gameplay and challenges.",
    "lazy jump 3d": "Experience lazy jump 3d - an engaging game with unique gameplay and challenges.",
    "lego batman": "Experience lego batman - an engaging game with unique gameplay and challenges.",
    "link to the past": "Experience link to the past - an engaging game with unique gameplay and challenges.",
    "link's awakening dx": "Experience link\'s awakening dx - an engaging game with unique gameplay and challenges.",
    "lows adventures 2": "Experience lows adventures 2 - an engaging game with unique gameplay and challenges.",
    "majora's mask": "Experience majora\'s mask - an engaging game with unique gameplay and challenges.",
    "mario combat": "Experience mario combat - an engaging game with unique gameplay and challenges.",
    "mario golf": "Experience mario golf - an engaging game with unique gameplay and challenges.",
    "mario kart 64": "Experience mario kart 64 - an engaging game with unique gameplay and challenges.",
    "mario kart ds": "Experience mario kart ds - an engaging game with unique gameplay and challenges.",
    "mario kart super circuit": "Experience mario kart super circuit - an engaging game with unique gameplay and challenges.",
    "mario paint": "Experience mario paint - an engaging game with unique gameplay and challenges.",
    "mario party": "Experience mario party - an engaging game with unique gameplay and challenges.",
    "mario party 2": "Experience mario party 2 - an engaging game with unique gameplay and challenges.",
    "mario party 3": "Experience mario party 3 - an engaging game with unique gameplay and challenges.",
    "mario party advance": "Experience mario party advance - an engaging game with unique gameplay and challenges.",
    "mario party ds": "Experience mario party ds - an engaging game with unique gameplay and challenges.",
    "mario pinball land": "Experience mario pinball land - an engaging game with unique gameplay and challenges.",
    "mario tennis": "Experience mario tennis - an engaging game with unique gameplay and challenges.",
    "mc tower defence 2": "Experience mc tower defence 2 - an engaging game with unique gameplay and challenges.",
    "mega man 2": "Experience mega man 2 - an engaging game with unique gameplay and challenges.",
    "mega man x": "Experience mega man x - an engaging game with unique gameplay and challenges.",
    "mega man zero": "Experience mega man zero - an engaging game with unique gameplay and challenges.",
    "metroid": "Experience metroid - an engaging game with unique gameplay and challenges.",
    "metroid fusion": "Experience metroid fusion - an engaging game with unique gameplay and challenges.",
    "metroid ii": "Experience metroid ii - an engaging game with unique gameplay and challenges.",
    "minecraft [v1.5.2]": "Experience minecraft [v1.5.2] - an engaging game with unique gameplay and challenges.",
    "minecraft [v1.8]": "Experience minecraft [v1.8] - an engaging game with unique gameplay and challenges.",
    "minecraft classic": "Experience minecraft classic - an engaging game with unique gameplay and challenges.",
    "minesweeper": "Experience minesweeper - an engaging game with unique gameplay and challenges.",
    "monkey mart": "Experience monkey mart - an engaging game with unique gameplay and challenges.",
    "monopoly": "Experience monopoly - an engaging game with unique gameplay and challenges.",
    "monster brawl": "Experience monster brawl - an engaging game with unique gameplay and challenges.",
    "mortal kombat 4": "Experience mortal kombat 4 - an engaging game with unique gameplay and challenges.",
    "mother 3": "Experience mother 3 - an engaging game with unique gameplay and challenges.",
    "motox3m": "Experience motox3m - an engaging game with unique gameplay and challenges.",
    "motox3m pool": "Experience motox3m pool - an engaging game with unique gameplay and challenges.",
    "motox3m spooky": "Experience motox3m spooky - an engaging game with unique gameplay and challenges.",
    "motox3m winter": "Experience motox3m winter - an engaging game with unique gameplay and challenges.",
    "multitask": "Experience multitask - an engaging game with unique gameplay and challenges.",
    "mutiny": "Experience mutiny - an engaging game with unique gameplay and challenges.",
    "myTeardrop": "Experience myTeardrop - an engaging game with unique gameplay and challenges.",
    "mystery dungeon": "Experience mystery dungeon - an engaging game with unique gameplay and challenges.",
    "mystical ninja": "Experience mystical ninja - an engaging game with unique gameplay and challenges.",
    "n-gon": "Experience n-gon - an engaging game with unique gameplay and challenges.",
    "neon rider": "Experience neon rider - an engaging game with unique gameplay and challenges.",
    "new super mario bros": "Experience new super mario bros - an engaging game with unique gameplay and challenges.",
    "ngon": "Experience ngon - an engaging game with unique gameplay and challenges.",
    "ninja gaiden": "Experience ninja gaiden - an engaging game with unique gameplay and challenges.",
    "nintendogs": "Experience nintendogs - an engaging game with unique gameplay and challenges.",
    "nitrome must die": "Experience nitrome must die - an engaging game with unique gameplay and challenges.",
    "ocarina of time": "Experience ocarina of time - an engaging game with unique gameplay and challenges.",
    "offline paradise": "Experience offline paradise - an engaging game with unique gameplay and challenges.",
    "oodlegobs": "Experience oodlegobs - an engaging game with unique gameplay and challenges.",
    "order of ecclesia": "Experience order of ecclesia - an engaging game with unique gameplay and challenges.",
    "osu!": "Experience osu! - an engaging game with unique gameplay and challenges.",
    "osu!mania": "Experience osu!mania - an engaging game with unique gameplay and challenges.",
    "pacman": "Experience pacman - an engaging game with unique gameplay and challenges.",
    "pacman world": "Experience pacman world - an engaging game with unique gameplay and challenges.",
    "pako highway": "Experience pako highway - an engaging game with unique gameplay and challenges.",
    "pandemic 2": "Experience pandemic 2 - an engaging game with unique gameplay and challenges.",
    "papa louie": "Experience papa louie - an engaging game with unique gameplay and challenges.",
    "papa louie 2": "Experience papa louie 2 - an engaging game with unique gameplay and challenges.",
    "papa louie 3": "Experience papa louie 3 - an engaging game with unique gameplay and challenges.",
    "papa's hotdoggeria": "Experience papa\'s hotdoggeria - an engaging game with unique gameplay and challenges.",
    "papa's pizzaria": "Experience papa\'s pizzaria - an engaging game with unique gameplay and challenges.",
    "papa's tacomia": "Experience papa\'s tacomia - an engaging game with unique gameplay and challenges.",
    "paper io 3d": "Experience paper io 3d - an engaging game with unique gameplay and challenges.",
    "paper mario": "Experience paper mario - an engaging game with unique gameplay and challenges.",
    "paperio2": "Experience paperio2 - an engaging game with unique gameplay and challenges.",
    "partners in time": "Experience partners in time - an engaging game with unique gameplay and challenges.",
    "phantasy star iv": "Experience phantasy star iv - an engaging game with unique gameplay and challenges.",
    "pick crafter": "Experience pick crafter - an engaging game with unique gameplay and challenges.",
    "picross ds": "Experience picross ds - an engaging game with unique gameplay and challenges.",
    "pokemon diamond": "Experience pokemon diamond - an engaging game with unique gameplay and challenges.",
    "pokemon fire red": "Experience pokemon fire red - an engaging game with unique gameplay and challenges.",
    "pokemon leaf green": "Experience pokemon leaf green - an engaging game with unique gameplay and challenges.",
    "pokemon platinum": "Experience pokemon platinum - an engaging game with unique gameplay and challenges.",
    "pokemon ruby": "Experience pokemon ruby - an engaging game with unique gameplay and challenges.",
    "pokemon sapphire": "Experience pokemon sapphire - an engaging game with unique gameplay and challenges.",
    "pokemon snap": "Experience pokemon snap - an engaging game with unique gameplay and challenges.",
    "pokemon soulsilver": "Experience pokemon soulsilver - an engaging game with unique gameplay and challenges.",
    "pokemon stadium": "Experience pokemon stadium - an engaging game with unique gameplay and challenges.",
    "pokemon unbound": "Experience pokemon unbound - an engaging game with unique gameplay and challenges.",
    "pokemon yellow": "Experience pokemon yellow - an engaging game with unique gameplay and challenges.",
    "pool": "Experience pool - an engaging game with unique gameplay and challenges.",
    "portal": "Experience portal - an engaging game with unique gameplay and challenges.",
    "portal 2": "Experience portal 2 - an engaging game with unique gameplay and challenges.",
    "precision client": "Experience precision client - an engaging game with unique gameplay and challenges.",
    "professor layton": "Experience professor layton - an engaging game with unique gameplay and challenges.",
    "punch out": "Experience punch out - an engaging game with unique gameplay and challenges.",
    "quest 64": "Experience quest 64 - an engaging game with unique gameplay and challenges.",
    "rabbit samurai": "Experience rabbit samurai - an engaging game with unique gameplay and challenges.",
    "ranger x": "Experience ranger x - an engaging game with unique gameplay and challenges.",
    "rayman 3": "Experience rayman 3 - an engaging game with unique gameplay and challenges.",
    "redball": "Experience redball - an engaging game with unique gameplay and challenges.",
    "redball 3": "Experience redball 3 - an engaging game with unique gameplay and challenges.",
    "redball 4": "Experience redball 4 - an engaging game with unique gameplay and challenges.",
    "redball 4 vol 2": "Experience redball 4 vol 2 - an engaging game with unique gameplay and challenges.",
    "redball 4 vol 3": "Experience redball 4 vol 3 - an engaging game with unique gameplay and challenges.",
    "rise higher": "Experience rise higher - an engaging game with unique gameplay and challenges.",
    "ristar": "Experience ristar - an engaging game with unique gameplay and challenges.",
    "rocket soccer": "Experience rocket soccer - an engaging game with unique gameplay and challenges.",
    "rough dino": "Experience rough dino - an engaging game with unique gameplay and challenges.",
    "run": "Experience run - an engaging game with unique gameplay and challenges.",
    "run 3 plus": "Experience run 3 plus - an engaging game with unique gameplay and challenges.",
    "sandspiel": "Experience sandspiel - an engaging game with unique gameplay and challenges.",
    "sandstone": "Experience sandstone - an engaging game with unique gameplay and challenges.",
    "sandtrix": "Experience sandtrix - an engaging game with unique gameplay and challenges.",
    "scribblenauts": "Experience scribblenauts - an engaging game with unique gameplay and challenges.",
    "shapeshipper": "Experience shapeshipper - an engaging game with unique gameplay and challenges.",
    "shift": "Experience shift - an engaging game with unique gameplay and challenges.",
    "shift 2": "Experience shift 2 - an engaging game with unique gameplay and challenges.",
    "shift 3": "Experience shift 3 - an engaging game with unique gameplay and challenges.",
    "shift 4": "Experience shift 4 - an engaging game with unique gameplay and challenges.",
    "shining force": "Experience shining force - an engaging game with unique gameplay and challenges.",
    "shinobi iii": "Experience shinobi iii - an engaging game with unique gameplay and challenges.",
    "shop empire": "Experience shop empire - an engaging game with unique gameplay and challenges.",
    "shop empire fable": "Experience shop empire fable - an engaging game with unique gameplay and challenges.",
    "shrek 2": "Experience shrek 2 - an engaging game with unique gameplay and challenges.",
    "simcity 2000": "Experience simcity 2000 - an engaging game with unique gameplay and challenges.",
    "simpsons road rage": "Experience simpsons road rage - an engaging game with unique gameplay and challenges.",
    "skibidi toilet 1v100": "Experience skibidi toilet 1v100 - an engaging game with unique gameplay and challenges.",
    "skibidi toilet attack": "Experience skibidi toilet attack - an engaging game with unique gameplay and challenges.",
    "skywire": "Experience skywire - an engaging game with unique gameplay and challenges.",
    "skywire 2": "Experience skywire 2 - an engaging game with unique gameplay and challenges.",
    "slope ball": "Experience slope ball - an engaging game with unique gameplay and challenges.",
    "slope city": "Experience slope city - an engaging game with unique gameplay and challenges.",
    "snake": "Experience snake - an engaging game with unique gameplay and challenges.",
    "snow battle io": "Experience snow battle io - an engaging game with unique gameplay and challenges.",
    "soccer random": "Experience soccer random - an engaging game with unique gameplay and challenges.",
    "solitaire": "Experience solitaire - an engaging game with unique gameplay and challenges.",
    "sonic advance": "Experience sonic advance - an engaging game with unique gameplay and challenges.",
    "sonic advance 2": "Experience sonic advance 2 - an engaging game with unique gameplay and challenges.",
    "sonic and knuckles": "Experience sonic and knuckles - an engaging game with unique gameplay and challenges.",
    "sonic rush": "Experience sonic rush - an engaging game with unique gameplay and challenges.",
    "sonic spinball": "Experience sonic spinball - an engaging game with unique gameplay and challenges.",
    "sonic the hedgehog": "Experience sonic the hedgehog - an engaging game with unique gameplay and challenges.",
    "sonic the hedgehog 2": "Experience sonic the hedgehog 2 - an engaging game with unique gameplay and challenges.",
    "sonic the hedgehog 3": "Experience sonic the hedgehog 3 - an engaging game with unique gameplay and challenges.",
    "space invaders": "Experience space invaders - an engaging game with unique gameplay and challenges.",
    "spirit tracks": "Experience spirit tracks - an engaging game with unique gameplay and challenges.",
    "sprinter": "Experience sprinter - an engaging game with unique gameplay and challenges.",
    "stack": "Experience stack - an engaging game with unique gameplay and challenges.",
    "stair race 3d": "Experience stair race 3d - an engaging game with unique gameplay and challenges.",
    "star fox 64": "Experience star fox 64 - an engaging game with unique gameplay and challenges.",
    "state io": "Experience state io - an engaging game with unique gameplay and challenges.",
    "steak and jake": "Experience steak and jake - an engaging game with unique gameplay and challenges.",
    "steak and jake midnight": "Experience steak and jake midnight - an engaging game with unique gameplay and challenges.",
    "stealing the diamond": "Experience stealing the diamond - an engaging game with unique gameplay and challenges.",
    "stick war": "Experience stick war - an engaging game with unique gameplay and challenges.",
    "stick war 2": "Experience stick war 2 - an engaging game with unique gameplay and challenges.",
    "street fighter 2": "Experience street fighter 2 - an engaging game with unique gameplay and challenges.",
    "streets of rage": "Experience streets of rage - an engaging game with unique gameplay and challenges.",
    "streets of rage 2": "Experience streets of rage 2 - an engaging game with unique gameplay and challenges.",
    "subway runner": "Experience subway runner - an engaging game with unique gameplay and challenges.",
    "subway surfers": "Experience subway surfers - an engaging game with unique gameplay and challenges.",
    "sudoku": "Experience sudoku - an engaging game with unique gameplay and challenges.",
    "super bomberman": "Experience super bomberman - an engaging game with unique gameplay and challenges.",
    "super hot": "Experience super hot - an engaging game with unique gameplay and challenges.",
    "super mario 64 ds": "Experience super mario 64 ds - an engaging game with unique gameplay and challenges.",
    "super mario bros 2": "Experience super mario bros 2 - an engaging game with unique gameplay and challenges.",
    "super mario bros 3": "Experience super mario bros 3 - an engaging game with unique gameplay and challenges.",
    "super mario construct": "Experience super mario construct - an engaging game with unique gameplay and challenges.",
    "super mario flash": "Experience super mario flash - an engaging game with unique gameplay and challenges.",
    "super mario flash 2": "Experience super mario flash 2 - an engaging game with unique gameplay and challenges.",
    "super mario kart": "Experience super mario kart - an engaging game with unique gameplay and challenges.",
    "super mario land": "Experience super mario land - an engaging game with unique gameplay and challenges.",
    "super mario land 2": "Experience super mario land 2 - an engaging game with unique gameplay and challenges.",
    "super mario rpg": "Experience super mario rpg - an engaging game with unique gameplay and challenges.",
    "super mario world": "Experience super mario world - an engaging game with unique gameplay and challenges.",
    "super meat boy": "Experience super meat boy - an engaging game with unique gameplay and challenges.",
    "super metroid": "Experience super metroid - an engaging game with unique gameplay and challenges.",
    "super monkey ball jr": "Experience super monkey ball jr - an engaging game with unique gameplay and challenges.",
    "super princess peach": "Experience super princess peach - an engaging game with unique gameplay and challenges.",
    "super smash bros": "Experience super smash bros - an engaging game with unique gameplay and challenges.",
    "super tennis": "Experience super tennis - an engaging game with unique gameplay and challenges.",
    "super treadmill": "Experience super treadmill - an engaging game with unique gameplay and challenges.",
    "superhero drop": "Experience superhero drop - an engaging game with unique gameplay and challenges.",
    "superstar saga": "Experience superstar saga - an engaging game with unique gameplay and challenges.",
    "swindler": "Experience swindler - an engaging game with unique gameplay and challenges.",
    "swords and sandals": "Experience swords and sandals - an engaging game with unique gameplay and challenges.",
    "swords and sandals 2": "Experience swords and sandals 2 - an engaging game with unique gameplay and challenges.",
    "territorial io": "Experience territorial io - an engaging game with unique gameplay and challenges.",
    "test subject arena": "Experience test subject arena - an engaging game with unique gameplay and challenges.",
    "test subject complete": "Experience test subject complete - an engaging game with unique gameplay and challenges.",
    "tetris": "Experience tetris - an engaging game with unique gameplay and challenges.",
    "tetris ds": "Experience tetris ds - an engaging game with unique gameplay and challenges.",
    "the binding of isaac": "Experience the binding of isaac - an engaging game with unique gameplay and challenges.",
    "the impossible quiz 2": "Experience the impossible quiz 2 - an engaging game with unique gameplay and challenges.",
    "the legend of zelda": "Experience the legend of zelda - an engaging game with unique gameplay and challenges.",
    "the sims 2": "Experience the sims 2 - an engaging game with unique gameplay and challenges.",
    "the sims 3": "Experience the sims 3 - an engaging game with unique gameplay and challenges.",
    "theme hotel": "Experience theme hotel - an engaging game with unique gameplay and challenges.",
    "there is no game": "Experience there is no game - an engaging game with unique gameplay and challenges.",
    "three line": "Experience three line - an engaging game with unique gameplay and challenges.",
    "thumb fighter": "Experience thumb fighter - an engaging game with unique gameplay and challenges.",
    "time shooter": "Experience time shooter - an engaging game with unique gameplay and challenges.",
    "time shooter 3": "Experience time shooter 3 - an engaging game with unique gameplay and challenges.",
    "totally accurate battle sim": "Experience totally accurate battle sim - an engaging game with unique gameplay and challenges.",
    "townscaper": "Experience townscaper - an engaging game with unique gameplay and challenges.",
    "tron": "Experience tron - an engaging game with unique gameplay and challenges.",
    "turok dinosaur hunter": "Experience turok dinosaur hunter - an engaging game with unique gameplay and challenges.",
    "twin shot": "Experience twin shot - an engaging game with unique gameplay and challenges.",
    "twin shot 2": "Experience twin shot 2 - an engaging game with unique gameplay and challenges.",
    "ultimate flash sonic": "Experience ultimate flash sonic - an engaging game with unique gameplay and challenges.",
    "unfair mario": "Experience unfair mario - an engaging game with unique gameplay and challenges.",
    "vectorman": "Experience vectorman - an engaging game with unique gameplay and challenges.",
    "vectorman 2": "Experience vectorman 2 - an engaging game with unique gameplay and challenges.",
    "vex": "Experience vex - an engaging game with unique gameplay and challenges.",
    "volley random": "Experience volley random - an engaging game with unique gameplay and challenges.",
    "wall smash": "Experience wall smash - an engaging game with unique gameplay and challenges.",
    "wario land 4": "Experience wario land 4 - an engaging game with unique gameplay and challenges.",
    "wario land ii": "Experience wario land ii - an engaging game with unique gameplay and challenges.",
    "wario's woods": "Experience wario\'s woods - an engaging game with unique gameplay and challenges.",
    "warioware": "Experience warioware - an engaging game with unique gameplay and challenges.",
    "warioware diy": "Experience warioware diy - an engaging game with unique gameplay and challenges.",
    "warioware touched": "Experience warioware touched - an engaging game with unique gameplay and challenges.",
    "watermelon game": "Experience watermelon game - an engaging game with unique gameplay and challenges.",
    "waterworks": "Experience waterworks - an engaging game with unique gameplay and challenges.",
    "wave race 64": "Experience wave race 64 - an engaging game with unique gameplay and challenges.",
    "world's hardest game": "Experience world\'s hardest game - an engaging game with unique gameplay and challenges.",
    "worlds hardest game 2": "Experience worlds hardest game 2 - an engaging game with unique gameplay and challenges.",
    "worms world party": "Experience worms world party - an engaging game with unique gameplay and challenges.",
    "wubzzys adventure": "Experience wubzzys adventure - an engaging game with unique gameplay and challenges.",
    "xx142-b2.exe": "Experience xx142-b2.exe - an engaging game with unique gameplay and challenges.",
    "yohoho io": "Experience yohoho io - an engaging game with unique gameplay and challenges.",
    "yoshi's island": "Experience yoshi\'s island - an engaging game with unique gameplay and challenges.",
    "yoshi's story": "Experience yoshi\'s story - an engaging game with unique gameplay and challenges.",
    "zombocalypse": "Experience zombocalypse - an engaging game with unique gameplay and challenges.",
    "zombotron": "Experience zombotron - an engaging game with unique gameplay and challenges.",
    "zombotron 2": "Experience zombotron 2 - an engaging game with unique gameplay and challenges.",
    "default": "An exciting game that will test your skills and provide hours of entertainment. Jump in and start playing!"
};

// Function to get game description
function getGameDescription(gameName) {
    return gameDescriptions[gameName] || gameDescriptions["default"];
}

// Function to open game modal
function openGameModal(gameName, gameImage, gameUrl) {
    const modal = document.getElementById('gameModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalImage = document.getElementById('modalImage');
    const modalLaunchBtn = document.getElementById('modalLaunchBtn');
    
    modalTitle.textContent = gameName;
    modalDescription.textContent = getGameDescription(gameName);
    modalImage.src = gameImage;
    modalImage.alt = gameName;
    modalLaunchBtn.href = gameUrl;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Ensure modal scrolls to top of its container
    modal.scrollTop = 0;
}

// Function to close game modal
function closeGameModal() {
    const modal = document.getElementById('gameModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('gameModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeGameModal();
            }
        });
    }
    
    // Add click handlers to all game buttons
    document.querySelectorAll('.button-container > a').forEach(function(gameLink) {
        const button = gameLink.querySelector('.button');
        if (button) {
            button.addEventListener('click', function(e) {
                // Only open modal if not clicking on pin or download buttons
                if (!e.target.closest('.pin-button') && !e.target.closest('.download-button')) {
                    e.preventDefault();
                    
                    const gameName = button.querySelector('h2').textContent;
                    const gameUrl = gameLink.getAttribute('href');
                    
                    // Get background image from button style
                    const style = button.getAttribute('style');
                    const imageMatch = style.match(/url\(['"]?([^'"]+)['"]?\)/);
                    const gameImage = imageMatch ? imageMatch[1] : '/images/ico.ico';
                    
                    openGameModal(gameName, gameImage, gameUrl);
                }
            });
        }
    });
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGameModal();
    }
});
