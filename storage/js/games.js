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
    "1 Date Danger": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "1 on 1 soccer": "Soccer gameplay. Score goals, execute plays, lead team to victory.",
    "10 Minutes Till Dawn": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "12 Mini Battles": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "1v1.LoL": "1v1 building combat arena. Strategic shooting meets construction.",
    "1v1lol": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "2048": "Combine numbered tiles to reach 2048. Simple yet deeply strategic puzzle game.",
    "2048 Merge Run": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "3D Bolt Master": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "3D Bowling": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "8 Ball Classic": "Retro arcade fun. Classic gameplay, simple mechanics, chase high scores.",
    "8 Ball Pool": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "99 Balls": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "A Bite at Freddy's": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "A Dance of Fire and Ice": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "A Difficult Game About Climbing": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "A Small World Cup": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Abandoned": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Achievement Unlocked": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Achievement Unlocked 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Achievement Unlocked 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Adventure Capatalist": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Adventure Drivers": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Ages of Conflict": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Alien Hominid": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Amanda the Adventurer": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Amaze": "Paint mazes by moving through them. Simple concept, complex solutions.",
    "Andy's Apple Farm": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Angry Birds": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Angry Birds Chrome": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Angry Birds Showdown": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Aquapark.io": "Fast-paced multiplayer arena. Compete against real players worldwide.",
    "Archery World Tour": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Arthur's Nightmare": "Horror experience. Survive scares, solve mysteries, escape dangerous situations.",
    "Attack Hole": "Control a black hole swallowing everything. Grow by consuming objects.",
    "Aviamasters": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Awesome Tanks": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Awesome Tanks 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "BERGENTRUCK 201x": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "BFDIA 5b": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "BFDIA 5b: 5*30": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "BLOODMONEY!": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Backrooms": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Bacon May Die": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Bad Ice Cream": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Bad Ice Cream 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Bad Ice Cream 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Bad Monday Simulator": "Simulation experience. Manage systems, make decisions, build and grow.",
    "Bad Parenting 1": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Bad Time Simulator": "Undertale Sans fight. Dodge complex bullet patterns to survive.",
    "Baldi's Basics": "Horror education parody. Solve math while escaping angry teacher.",
    "Baldi's Basics Classic Remastered": "Retro arcade fun. Classic gameplay, simple mechanics, chase high scores.",
    "Baldi's Basics Plus": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Ball Blast": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Bank Robbery": "Stealth action. Sneak undetected, complete objectives, escape silently.",
    "Bank Robbery 2": "Stealth action. Sneak undetected, complete objectives, escape silently.",
    "Bank Robbery 3": "Stealth action. Sneak undetected, complete objectives, escape silently.",
    "Baseball Bros": "Baseball simulation. Bat, pitch, field your way to the championship.",
    "Basket Battle": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Basket Bros": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Basket Random": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Basketball Frvr": "Basketball action. Shoot hoops, perform dunks, win competitive matches.",
    "Basketball Stars": "Basketball action. Shoot hoops, perform dunks, win competitive matches.",
    "Bazooka Boy": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Bendy and the Ink Machine": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Big ICE Tower Tiny Square": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Big NEON Tower Tiny Square": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Big Tower Tiny Square": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Big Tower Tiny Square 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Binding of Issac: Wrath of the Lamb": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "BitGun.io": "Fast-paced multiplayer arena. Compete against real players worldwide.",
    "BitLife": "Life simulator. Make choices from birth to death shaping your character's fate.",
    "BitPlanes": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "BlackJack": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Blade Ball": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Block Blast": "Match-3 puzzle. Clear blocks strategically for high scores.",
    "BlockPost": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Blocky Snakes": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Bloons TD": "Tower defense strategy. Place towers to pop balloons before they escape.",
    "Bloons TD 2": "Tower defense strategy. Place towers to pop balloons before they escape.",
    "Bloons TD 3": "Tower defense strategy. Place towers to pop balloons before they escape.",
    "Bloons TD 4": "Tower defense strategy. Place towers to pop balloons before they escape.",
    "Bloons TD 5": "Tower defense strategy. Place towers to pop balloons before they escape.",
    "Bloxorz": "Roll a block to the goal hole. Mind-bending 3D spatial puzzles.",
    "Blumgi Rocket": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Bob The Robber 2": "Stealth action. Sneak undetected, complete objectives, escape silently.",
    "Boom Slingers: Reboom": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Bottle Jump 3D": "Flip bottles perfectly from object to object using physics.",
    "Bouncemasters": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Bowmasters": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Boxing Random": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Brawl Guys.io": "Fast-paced multiplayer arena. Compete against real players worldwide.",
    "Bridge Race": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "Buckshot Roulette": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Build a Big Army": "Creative building. Gather resources, construct, shape your world.",
    "Build a Plane": "Creative building. Gather resources, construct, shape your world.",
    "Build a Queen": "Creative building. Gather resources, construct, shape your world.",
    "BuildNow.gg": "Multiplayer build and shoot. Construct defenses while battling.",
    "Burrito Bison": "Launch a wrestler through candy land. Bounce and smash forward.",
    "Bust a Loop": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Buster Jam": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "CG FC 25": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Camouflage and Sniper": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Candy Crush": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Cannon Balls 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Cannon Basketball": "Basketball action. Shoot hoops, perform dunks, win competitive matches.",
    "Cannon Basketball 2": "Basketball action. Shoot hoops, perform dunks, win competitive matches.",
    "Car Survival 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Carrom Clash": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Cat Connection": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Cat Gunner: Super Zombie Shoot": "Zombie shooter. Survive undead waves with weapons and upgrades.",
    "Cave Story": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Celeste": "Challenging mountain climbing platformer. Tight controls and emotional story.",
    "Celeste PICO": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Chat Bot (A.|.I)": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Cheese Chompers 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Chess Classic": "Retro arcade fun. Classic gameplay, simple mechanics, chase high scores.",
    "Chiikawa Puzzle": "Brain-teaser puzzle. Solve challenges with logic and creative thinking.",
    "Choppy Orc": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "CircloO": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "CircloO 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "City Defense": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "City Smash": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Clash Of Vikings": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Class of '09": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Clothing Shop 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Cluster Rush": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Code Editor": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Color Match": "Match-3 puzzle. Connect matching items to clear boards and score.",
    "Color Water Sort 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Cookie Clicker": "Click to bake cookies. Unlock upgrades and automation in this addictive incremental game.",
    "Cooking Mama": "Cooking game. Prepare meals, serve customers, manage kitchen efficiently.",
    "Cooking Mama 2": "Cooking game. Prepare meals, serve customers, manage kitchen efficiently.",
    "Cooking Mama 3": "Cooking game. Prepare meals, serve customers, manage kitchen efficiently.",
    "Cool Cars Run 3D": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Coreball": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Count Masters: Stickman Games": "Physics-based action. Experience realistic movement and brutal impacts.",
    "Crazy Cars": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Crazy Cattle 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Crazy Chicken 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Crazy Kitty 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Crossy Road": "Why did the chicken cross? Guide characters across traffic, rivers, and trains.",
    "Crush Cars 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Cubefield": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Cuphead": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Cut the Rope": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Cut the Rope: Holiday Gift": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Cut the Rope: Time Travel": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "DEAD PLATE": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "DON'T YOU LECTURE ME": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "DOOM": "Iconic FPS demon slaying. Fast-paced hell-based shooting with legendary weapons.",
    "Dadish": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Dadish 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Dadish 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Dadish 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Daily Dadish": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Dalgona Candy Honeycomb Cookie": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Dan The Man": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Death Run 3D": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Deltatraveler": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Destiny Run 3D": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Destroy The Car 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Diamond Seeker": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Dig Deep": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Do NOT Take This Cat Home": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Doge Miner": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Doodle Jump": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Doom 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Doom 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Dragon vs Bricks": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Draw Climber": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Draw Joust": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Draw the Hill": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Draw the Line": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Dreadhead Parkour": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Drift Boss": "Master drifting around endless corners. Stay on the platform as long as possible.",
    "Drift Hunters": "Customize cars and drift. Earn points through skillful sliding.",
    "Driven Wild": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Duck Life": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Duck Life 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Duck Life 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Duck Life 4": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Duck Life 5": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Duck Life 8": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Elastic Man": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Emulator.JS": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Endoparasitic": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Endroll": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Escape Road": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Escape Road 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Evil Glitch": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "EvoWars.io": "Fast-paced multiplayer arena. Compete against real players worldwide.",
    "Evolving Bombs 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "FIFA 10": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "FIFA 11": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "FNF Vs. Hypno's Lullaby v2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "FNF Vs. Sonic.EXE 3.0/4.0": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "FNF vs Bob v2.0 (Bob’s Onslaught)": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "FNF vs Pibby Corrupted": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Fallout": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Fancy Pants Adventure": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Fancy Pants Adventure 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Fancy Pants Adventure 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Fancy Pants Adventure 4 Part 1": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Fancy Pants Adventure 4 Part 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Fashion Battle": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Fears to Fathom: Home Alone": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Final Earth 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Final Fantasy VII": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Find the Alien": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Fire and Frost Master": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Fireboy and Watergirl 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Fireboy and Watergirl 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Fitness Empire": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Five Nights at Candy's": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "Five Nights at Candy's 2": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "Five Nights at Freddy's": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "Five Nights at Freddy's 2": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "Five Nights at Freddy's 3": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "Five Nights at Freddy's 4": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "Five Nights at Freddy's 4: Halloween": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "Five Nights at Freddy's: Pizza Simulator": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "Five Nights at Freddy's: Sister Location": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "Five Nights at Freddy's: Ultimate Custom Night": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "Five Nights at Freddy's: World": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "Five Nights at Freddy's: World Refreshed": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "Five Nights at Winston's": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "Flappy Bird": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Flappy Dunk": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Flick Goal": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Flip Master": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Football Bros": "Soccer gameplay. Score goals, execute plays, lead team to victory.",
    "Fork n Sausage": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Fortzone Battle Royale": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin": "Rhythm battle game. Hit notes perfectly to win rap battles and impress.",
    "Friday Night Funkin VS Impostor v4": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin VS. KAPI": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin VS. Sky": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin Vs. Cyber Sensation": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin Vs. Dave and Bambi v3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin vs Carol V2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin vs Nonsense": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin vs Shaggy": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin vs Sunday Remastered HD": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin vs Undertale": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin' D-Sides": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin' Drop and Roll, but Playable": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin' Sunday Night Suicide: Rookies Edition": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin' VS Impostor B-Sides": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin' vs Hypno Lullaby": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': 17 Bucks: Floor 1": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': AKAGE": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': B-Sides": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': Chaos Nightmare - Sonic Vs. Fleetway": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "Friday Night Funkin': Creepypasta JP": "Horror experience. Survive scares, solve mysteries, escape dangerous situations.",
    "Friday Night Funkin': Darkness Takeover": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': FIRE IN THE HOLE: Lobotomy Dash Funkin'": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': Gumballs": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': Heartbreak Havoc [Vs. Sky: REDUX]": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': Hit Single Real": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': Indie Cross": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': Jeffy's Endless Aethos": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': Mario's Madness": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "Friday Night Funkin': Mistful Crimson Morning Reboot": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': Neo": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': Pibby: Apocalypse": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': Rev-Mixed": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': Sarvente's Mid-Fight Masses": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': Sonic Legacy": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "Friday Night Funkin': TWIDDLEFINGER": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': V.S. Whitty": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': VS. Impostor: Alternated": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': Vs. Hatsune Miku": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': Vs. Hex": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': vs. BOPCITY": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': vs. Garcello": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': vs. QT": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin': vs. Tricky": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin’ Soft": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Friday Night Funkin’ Wednesday's Infidelity": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Fruit Ninja": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Generic Fighter Maybe": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Geometry Dash Lite (REMAKE)": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Get Yoked": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Getaway Shootout": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "Getting Over It with Bennett Foddy": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Giant Wanted": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Gladihoppers": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Gobble": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Goblin Goopmaxxing": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "God's Flesh": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Godzilla Daikaiju Battle Royale": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Going Balls": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Google Baseball": "Baseball simulation. Bat, pitch, field your way to the championship.",
    "Google Feud": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Gorilla Tag": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Granny": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Granny 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Granny 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Growden.io": "Fast-paced multiplayer arena. Compete against real players worldwide.",
    "Guess Their Answer": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Gun Clone": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "Gun Runner": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Gunspin": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "Half Life": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Half Life: Opposing Force": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Happy Sheepies": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Happy Wheels": "Physics ragdoll chaos. Navigate brutal obstacle courses with hilarious deadly results.",
    "Harvest.io": "Fast-paced multiplayer arena. Compete against real players worldwide.",
    "Hide N Seek": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "High Heels": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Highway Racer": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "Highway Racer 2": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "Highway Racer 2 REMASTERED": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "Hill Climb Racing Lite": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "Hobo 1": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Hobo 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Hobo 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Hobo 4": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Hobo 5": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Hobo 6": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Hobo 7": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Hollow Knight": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Hotline Miami": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "House of Hazards": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Hula Hoop Race": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "Human Expenditure Program": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Hydrovolter": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Hypper Sandbox": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "I woke up next to you again.": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Ice Dodo": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Idle Breakout": "Idle progression. Click to earn, unlock upgrades, grow exponentially.",
    "Idle Dice": "Idle progression. Click to earn, unlock upgrades, grow exponentially.",
    "Idle Lumber Inc": "Idle progression. Click to earn, unlock upgrades, grow exponentially.",
    "Idle Mining Empire": "Idle progression. Click to earn, unlock upgrades, grow exponentially.",
    "In Stars and Time": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Infinimoes": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "JavascriptPS1": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Jelly Drift": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "Jelly Mario": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "Jelly Restaurant": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Jetpack Joyride": "Fly through labs with your jetpack. Dodge obstacles and collect coins.",
    "Johnny Trigger": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Journey Downhill": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "JustFall.lol": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Kaji Run": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Karlson": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Kindergarten": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Kindergarten 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Kindergarten 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Kirby Squeak Squad": "Inhale enemies to copy abilities. Colorful platforming with creative powers.",
    "Kirby Super Star Ultra": "Inhale enemies to copy abilities. Colorful platforming with creative powers.",
    "Kirby ~ Soft & Wet": "Inhale enemies to copy abilities. Colorful platforming with creative powers.",
    "Kitchen Bazar": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Kitty Toy": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Lacey's Flash Games": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Layers Roll": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Lazy Jumper": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Learn to Fly": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Learn to Fly 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Learn to Fly 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Learn to Fly Idle": "Idle progression. Click to earn, unlock upgrades, grow exponentially.",
    "Line Rider": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Little Runmo": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Look Outside": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Love Letters": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Madalin Stunt Cars 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Madalin Stunt Cars 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Madness Combat: Project Nexus (classic)": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "Magic Tiles 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Make a SuperBoat": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Makeover Run": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Man Runner 2048": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Match Triple 3D": "Match-3 puzzle. Connect matching items to clear boards and score.",
    "Maze Speedrun": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Meatboy": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Mega Car Jumps": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Melon Playground": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Merge Harvest": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Metal Gear Solid": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Midnight Shift": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Milk Inside a Bag of Milk Inside a Bag of Milk": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Milk Outside A Bag Of Milk Outside A Bag Of Milk": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Mindwave": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Minecraft 1.12.2": "Creative building. Gather resources, construct, shape your world.",
    "Minecraft 1.21.4": "Creative building. Gather resources, construct, shape your world.",
    "Minecraft 1.5.2": "Creative building. Gather resources, construct, shape your world.",
    "Minecraft 1.8.8": "Creative building. Gather resources, construct, shape your world.",
    "Minecraft Alpha 1.2.6": "Creative building. Gather resources, construct, shape your world.",
    "Minecraft Beta 1.3": "Creative building. Gather resources, construct, shape your world.",
    "Minecraft Beta 1.7.3": "Creative building. Gather resources, construct, shape your world.",
    "Minecraft Indev": "Creative building. Gather resources, construct, shape your world.",
    "Minesweeper Mania": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Minesweeper Plus": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Mob Control HTML5": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Money Rush": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Monster Box 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Monster Tracks": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Moto X3M": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Moto X3M 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Moto X3M 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Moto X3M Pool Party": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Moto X3M Spooky": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Moto X3M Winter": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Mutilate a Doll 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Nazi Zombies: Portable": "Zombie survival. Fight undead, scavenge supplies, stay alive.",
    "Newgrounds Rumble": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Nijika's Ahoge": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Ninja vs EvilCorp": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Nubby's Number Factory": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "OMORI": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Off": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Office Fight": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Offroad Mountain Bike": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Om Nom Run": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Oneshot (LEGACY)": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Orange Roulette": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Oshi Oshi Punch!": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "OvO": "Fast-paced parkour platformer. Run, jump, slide, and dive through challenging obstacle courses with precision timing.",
    "OvO 2": "Sequel with new levels and enhanced mechanics. Test your reflexes with trickier obstacles and faster gameplay.",
    "OvO 3 Dimensions": "3D evolution of the parkour series. Navigate dimensional obstacles with enhanced movement controls.",
    "Pac Man World": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Pac Man World 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Pac-Man Superfast": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "PacMan (Horror)": "Horror experience. Survive scares, solve mysteries, escape dangerous situations.",
    "Papa's Bakeria": "Time management cooking. Run Papa's Bakeria, take orders, and serve customers perfectly.",
    "Papa's Burgeria": "Time management cooking. Run Papa's Burgeria, take orders, and serve customers perfectly.",
    "Papa's Cheeseria": "Time management cooking. Run Papa's Cheeseria, take orders, and serve customers perfectly.",
    "Papa's Cupcakeria": "Time management cooking. Run Papa's Cupcakeria, take orders, and serve customers perfectly.",
    "Papa's Donuteria": "Time management cooking. Run Papa's Donuteria, take orders, and serve customers perfectly.",
    "Papa's Freezeria": "Time management cooking. Run Papa's Freezeria, take orders, and serve customers perfectly.",
    "Papa's Hot Doggeria": "Time management cooking. Run Papa's Hot Doggeria, take orders, and serve customers perfectly.",
    "Papa's Pancakeria": "Time management cooking. Run Papa's Pancakeria, take orders, and serve customers perfectly.",
    "Papa's Pastaria": "Time management cooking. Run Papa's Pastaria, take orders, and serve customers perfectly.",
    "Papa's Pizeria": "Time management cooking. Run Papa's Pizeria, take orders, and serve customers perfectly.",
    "Papa's Scooperia": "Time management cooking. Run Papa's Scooperia, take orders, and serve customers perfectly.",
    "Papa's Sushiria": "Time management cooking. Run Papa's Sushiria, take orders, and serve customers perfectly.",
    "Papa's Taco Mia": "Time management cooking. Run Papa's Taco Mia, take orders, and serve customers perfectly.",
    "Papa's Wingeria": "Time management cooking. Run Papa's Wingeria, take orders, and serve customers perfectly.",
    "Paper.io 2": "Claim territory online. Draw lines to capture area against other players.",
    "Papers, Please": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Papery Planes": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Parappa The Rapper": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Parking Fury 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Parking Rush": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Peggle": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "People Playground": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Pico's School (1999)": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Pixel Gun Survival": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "Pizza Tower": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Pizza Tower: Scoutdigo": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Plants vs Zombies": "Zombie survival. Fight undead, scavenge supplies, stay alive.",
    "Plants vs. Zombies 2 Gardenless": "Zombie survival. Fight undead, scavenge supplies, stay alive.",
    "Play!.js": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Please Dont Touch Anything": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Plinko": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Pokemon Emerald": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "Pokemon Firered": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "Pokemon HeartGold": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "Pokemon Red": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "Pokey Ball": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Poly Track": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "PortaBoy+": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Postal": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Pottery Master": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Pou": "Virtual alien pet. Feed, clean, and play to keep Pou happy.",
    "Protektor": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Quake III Arena": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "R.E.P.O": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "RE:RUN": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Race Master 3D": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "Raft": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Raft Wars": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Raft Wars 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Ragdoll Archers": "Physics-based action. Experience realistic movement and brutal impacts.",
    "Ragdoll Hit": "Physics-based action. Experience realistic movement and brutal impacts.",
    "Rainbow Obby": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Raldi's Crackhouse": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Real Flight Simulator": "Simulation experience. Manage systems, make decisions, build and grow.",
    "Recoil": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Red Ball": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Red Ball 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Red Ball 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Red Ball 4": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Red Ball 4 Vol. 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Red Ball 4 Vol. 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Retro Bowl": "Lead your football team to glory. Manage roster, call plays, and win championships in retro-styled gameplay.",
    "Retro Bowl College": "College football management. Recruit star players and compete for the national championship.",
    "Rich Run 3D": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Riddle School": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Riddle School 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Riddle School 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Riddle School 4": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Riddle School 5": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Riddle Transfer": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Riddle Transfer 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "RigBMX": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "RigBMX 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Rio Rex": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Road of Fury": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Robot Invasion": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Rogue Sergeant The Final Operation": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Rolling Sky": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Rolly Vortex": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Rooftop Snipers": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Rooftop Snipers 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Room Sort": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Royal Towers: Medieval TD": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Ruffle": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Run 1": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Run 2": "Space-themed endless runner. Navigate zero-gravity tunnels and jump between platforms.",
    "Run 3": "Explore infinite space tunnels. Jump between platforms and discover new paths in this endless runner.",
    "Sandboxels": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Sandtris": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Schoolboy Runaway": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Scrap Metal 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Seat Jam 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Shapez.io": "Fast-paced multiplayer arena. Compete against real players worldwide.",
    "Shipo.io": "Fast-paced multiplayer arena. Compete against real players worldwide.",
    "Shooting Master": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "Shovel 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Side Effects": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Sky Riders": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Slender: The 8 Pages": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Slice it All": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Slime Rancher": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Slime.io": "Fast-paced multiplayer arena. Compete against real players worldwide.",
    "Slither.io": "Multiplayer snake arena. Grow by eating while avoiding other snakes.",
    "Slope": "Race down an endless slope dodging obstacles. Addictive 3D running testing your reflexes at high speed.",
    "Slope 2": "Enhanced sequel with improved graphics and new challenging tracks at breakneck speeds.",
    "Slowroads": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Smash Karts": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Snow Rider 3D": "Snowboard down mountains dodging obstacles and collecting gifts.",
    "Snowbattle.io": "Fast-paced multiplayer arena. Compete against real players worldwide.",
    "Solar Smash": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Sonic CD": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "Sonic Mania": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "Sonic the Hedgehog 2: Community's Cut": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "Sonic the Hedgehog 3: Angel Island Remastered": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "Sonic.EXE": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "Sonic.EXE (ORIGINAL)": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "Sort the Court": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Soundboard": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Space Funeral": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Space Waves": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Spacebar Clicker": "Idle progression. Click to earn, unlock upgrades, grow exponentially.",
    "Speed Stars": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Spelunky Classic HD": "Retro arcade fun. Classic gameplay, simple mechanics, chase high scores.",
    "SpiderDoll": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Spiral Roll": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "SpongeBob SquarePants: Krabby Katch": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "SpongeBob SquarePants: Land Ho!": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "SpongeBob SquarePants: Sandy's Sponge Stacker": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "SpongeBob SquarePants: SpongeBob Run": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "SpongeBob SquarePants: Squidward's Sizzlin' Scare": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "SpongeBob SquarePants: Tasty Pastry Party": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "SpongeBob SquarePants: The Kah-Ray-Tay Squid": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "SpongeBob SquarePants: WereSquirrel": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Sprunki": "Musical creativity. Mix beats and create melodies with unique characters.",
    "Stacky Dash": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "State.io": "Fast-paced multiplayer arena. Compete against real players worldwide.",
    "Station 141": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Station Saturn": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Steal A Brainrot": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Steal Brainrot Online": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Stick War: Legacy": "Physics-based action. Experience realistic movement and brutal impacts.",
    "Stick With It": "Physics-based action. Experience realistic movement and brutal impacts.",
    "Stickman Boost": "Physics-based action. Experience realistic movement and brutal impacts.",
    "Stickman Climb": "Physics-based action. Experience realistic movement and brutal impacts.",
    "Stickman Destruction": "Physics-based action. Experience realistic movement and brutal impacts.",
    "Stickman Fight Ragdoll": "Physics-based action. Experience realistic movement and brutal impacts.",
    "Stickman Golf": "Physics-based action. Experience realistic movement and brutal impacts.",
    "Stickman Hook": "Swing with grappling hooks. Master physics-based momentum to reach the finish.",
    "Stickman and Guns": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "Stone Grass Mowing Simulator": "Simulation experience. Manage systems, make decisions, build and grow.",
    "Super Mario 63": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "Super Mario 64": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "Super Mario Bros": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "Super Smash Flash": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Super Star Car": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Superhot": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Supermarket 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Supreme Duelist": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Survival Race": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "Survive to Victory": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Sushi Roll": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Swordfight!!": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Swords and Souls": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Tag": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Tall Man Run": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Tall.io": "Fast-paced multiplayer arena. Compete against real players worldwide.",
    "Tanuki Sunset": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Tattletail": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Teen Titans GO!: Jump Jousts": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Teen Titans GO!: Jump Jousts 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Telekinesis": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Telekinesis Attack": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Telekinesis Car": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Telekinesis Drive": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Temple Run 2": "Endless runner escaping guardians. Swipe to turn, jump, and slide through ruins.",
    "Terraria": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Territorial.io": "Fast-paced multiplayer arena. Compete against real players worldwide.",
    "That's Not My Neighbor": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "The Deadseat": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "The Impossible Quiz": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "The Legend of Zelda Majora's Mask": "Action-adventure classic. Explore dungeons, solve puzzles, save Hyrule from evil.",
    "The Legend of Zelda Ocarina of Time": "Action-adventure classic. Explore dungeons, solve puzzles, save Hyrule from evil.",
    "The Man In The Window": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "The Oregon Trail": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "The World's Hardest Game": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "The World's Hardest Game 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "The World's Hardest Game 4": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "They Are Coming": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "This Is The Only Level": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "This Is The Only Level 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Three Goblets": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "TileTopia": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Time Shooter 1": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "Time Shooter 2": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "Time Shooter 3: SWAT": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "Tiny Fishing": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Tomb Of The Mask": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Tomodachi Collection": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Toss The Turtle": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Touhou Mother": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Touhou: Luminous Strike": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Tower Crash 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "Toy Rider": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Traffic Rider": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Trivia Crack": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Tube Jumpers": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Tug of War with Cars": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Tunnel Rush": "High-speed tunnel flying. Dodge obstacles at breakneck pace.",
    "Turbo Stars": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Twerk Race 3D": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "Twisted Rope 3D": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "ULTRAKILL": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "UNDERWHEELS": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Undertale Yellow": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "VS Rewrite: ROUND 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Vex 1": "Stickman platformer. Navigate deadly traps with precise timing and skill.",
    "Vex 2": "Stickman platformer. Navigate deadly traps with precise timing and skill.",
    "Vex 3": "Stickman platformer. Navigate deadly traps with precise timing and skill.",
    "Vex 3 XMAS": "Stickman platformer. Navigate deadly traps with precise timing and skill.",
    "Vex 4": "Stickman platformer. Navigate deadly traps with precise timing and skill.",
    "Vex 5": "Stickman platformer. Navigate deadly traps with precise timing and skill.",
    "Vex 6": "Stickman platformer. Navigate deadly traps with precise timing and skill.",
    "Vex 7": "Stickman platformer. Navigate deadly traps with precise timing and skill.",
    "Vex 8": "Stickman platformer. Navigate deadly traps with precise timing and skill.",
    "Vex Challenges": "Stickman platformer. Navigate deadly traps with precise timing and skill.",
    "Vex X3M": "Stickman platformer. Navigate deadly traps with precise timing and skill.",
    "Vex X3M 2": "Stickman platformer. Navigate deadly traps with precise timing and skill.",
    "Wall Crawler": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "War Regions": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "War The Knights": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Waterworks!": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "We Become What We Behold": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Weapon Craft Run": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "Weapon Scale": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Weapon Upgrade Rush": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "WebFishing": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Wheely": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Wheely 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Wheely 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Wheely 4": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Wheely 5": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Wheely 6": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Wheely 7": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Wheely 8": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Wordle": "Daily word puzzle. Guess the five-letter word in six tries using logic.",
    "World Box": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "Yandere Simulator": "Simulation experience. Manage systems, make decisions, build and grow.",
    "Yume Nikki": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "[!] COMMENTS": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "abuda the alien": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "ace attorney": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "adofai": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "advance wars": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "advance wars 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "advance wars days of ruin": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "adventure captialist": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "adventure time": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "age of war": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "age of war 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "altered beast": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "amazing rope police": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "among us fangame": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "amorphous": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "animal crossing": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "aquapark slides": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "backrooms 2d": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "bad piggies": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "ballistic chickens": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "balloon run": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "banjo kazooie": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "banjo pilot": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "banjo tooie": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "basketbros io": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "battle beavers": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "battleships": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "battletoads": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "big red button": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "bike champ": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "bike champ 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "bloxors": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "bomberman": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "bowsers inside story": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "boxing physics 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "breaking the bank": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "btd": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "btd 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "btd 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "btd 4": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "bubble spinner": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "bubble tanks 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "burger and frights": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "cactus mccoy": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "cactus mccoy 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "canopy": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "cars 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "castlevania": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "castlevania aria of sorrow": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "castlevania dawn of sorrow": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "cave chaos": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "cell machine": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "champion island": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "change type": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "cheese dreams": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "chess": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "chibi knight": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "chisel": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "chisel 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "choose your weapon": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "choose your weapon 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "choose your weapon 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "chrome dino game": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "chrono trigger": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "clicker heroes": "Idle progression. Click to earn, unlock upgrades, grow exponentially.",
    "color switch": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "comix zone": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "connect 4": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "contra": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "contra iii": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "control craft 2": "Creative building. Gather resources, construct, shape your world.",
    "corporation inc": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "crazy tunnel 3d": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "crimson fantasia": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "crush the castle": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "crush the castle 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "csgo clicker": "Idle progression. Click to earn, unlock upgrades, grow exponentially.",
    "dbz: supersonic warriors": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "defend the tank": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "diddy kong racing": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "ditto": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "donkey kong": "Platformer collecting bananas. Ride animal friends and defeat King K. Rool.",
    "donkey kong 64": "Platformer collecting bananas. Ride animal friends and defeat King K. Rool.",
    "donkey kong country": "Platformer collecting bananas. Ride animal friends and defeat King K. Rool.",
    "donkey kong country 2": "Platformer collecting bananas. Ride animal friends and defeat King K. Rool.",
    "donkey kong country 3": "Platformer collecting bananas. Ride animal friends and defeat King K. Rool.",
    "donkey kong land": "Platformer collecting bananas. Ride animal friends and defeat King K. Rool.",
    "doodle defender": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "doom 64": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "dr mario": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "dragon boy 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "drift mania": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "drill dozer": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "duck life 6": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "duck tales": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "duke nukem 64": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "duke nukem advance": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "earthbound": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "ecco the dolphin": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "edge surf": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "electric box": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "electric man 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "epic battle fantasy": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "epic battle fantasy 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "epic battle fantasy 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "escaping the prison": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "excitebike 64": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "f-zero": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "f-zero x": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "factory balls": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "feed me": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "final fantasy iv": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "final fantasy tactics adv": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "final ninja": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "fire emblem": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "fireboy and watergirl": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "fleeing the complex": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "flippy fish": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "flood runner 2": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "flood runner 3": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "fnaf 1": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "fnaf 2": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "fnaf 3": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "fnaf 4": "Horror survival. Monitor cameras and survive animatronic attacks through nights.",
    "fnf mid fight masses": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "frost bite": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "frost bite 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "funny mad racing": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "funny shooter 2": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "garfield gets real": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "geometry dash lite": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "geometry dash sky": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "geometry rash": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "gex 64": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "go ball": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "gold digger frvr": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "golden axe": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "golden eye 007": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "golden sun": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "grand theft grotto": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "groon groon, babey!": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "gun fest": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "gun mayhem": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "gun mayhem 2": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "gun mayhem redux": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "gunstar heroes": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "harvest moon": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "harvest moon 64": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "helix jump": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "hexgl": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "hole io": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "ice climber": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "icebreaker": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "illusion of gaia": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "infiltrating the airship": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "infinite craft": "Creative building. Gather resources, construct, shape your world.",
    "jet force gemini": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "just fall lol": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "kid icarus": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "kirby 64": "Inhale enemies to copy abilities. Colorful platforming with creative powers.",
    "kirby amazing mirror": "Inhale enemies to copy abilities. Colorful platforming with creative powers.",
    "kirby mass attack": "Inhale enemies to copy abilities. Colorful platforming with creative powers.",
    "kirby power paintbrush": "Inhale enemies to copy abilities. Colorful platforming with creative powers.",
    "kirby's dream land": "Inhale enemies to copy abilities. Colorful platforming with creative powers.",
    "kirby's dreamland 2": "Inhale enemies to copy abilities. Colorful platforming with creative powers.",
    "knife hit": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "lazy jump 3d": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "lego batman": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "link to the past": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "link's awakening dx": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "lows adventures 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "majora's mask": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "mario combat": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "mario golf": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "mario kart 64": "Kart racing with Mario and friends. Race on creative tracks using items and shortcuts.",
    "mario kart ds": "Kart racing with Mario and friends. Race on creative tracks using items and shortcuts.",
    "mario kart super circuit": "Kart racing with Mario and friends. Race on creative tracks using items and shortcuts.",
    "mario paint": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "mario party": "Board game party. Play mini-games, collect stars, and compete with friends.",
    "mario party 2": "Board game party. Play mini-games, collect stars, and compete with friends.",
    "mario party 3": "Board game party. Play mini-games, collect stars, and compete with friends.",
    "mario party advance": "Board game party. Play mini-games, collect stars, and compete with friends.",
    "mario party ds": "Board game party. Play mini-games, collect stars, and compete with friends.",
    "mario pinball land": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "mario tennis": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "mc tower defence 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "mega man 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "mega man x": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "mega man zero": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "metroid": "Sci-fi exploration. Navigate alien worlds gaining power-ups and abilities.",
    "metroid fusion": "Sci-fi exploration. Navigate alien worlds gaining power-ups and abilities.",
    "metroid ii": "Sci-fi exploration. Navigate alien worlds gaining power-ups and abilities.",
    "minecraft [v1.5.2]": "Creative building. Gather resources, construct, shape your world.",
    "minecraft [v1.8]": "Creative building. Gather resources, construct, shape your world.",
    "minecraft classic": "Creative building. Gather resources, construct, shape your world.",
    "minesweeper": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "monkey mart": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "monopoly": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "monster brawl": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "mortal kombat 4": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "mother 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "motox3m": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "motox3m pool": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "motox3m spooky": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "motox3m winter": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "multitask": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "mutiny": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "myTeardrop": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "mystery dungeon": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "mystical ninja": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "n-gon": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "neon rider": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "new super mario bros": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "ngon": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "ninja gaiden": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "nintendogs": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "nitrome must die": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "ocarina of time": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "offline paradise": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "oodlegobs": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "order of ecclesia": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "osu!": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "osu!mania": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "pacman": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "pacman world": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "pako highway": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "pandemic 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "papa louie": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "papa louie 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "papa louie 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "papa's hotdoggeria": "Time management cooking. Run Papa's hotdoggeria, take orders, and serve customers perfectly.",
    "papa's pizzaria": "Time management cooking. Run Papa's pizzaria, take orders, and serve customers perfectly.",
    "papa's tacomia": "Time management cooking. Run Papa's tacomia, take orders, and serve customers perfectly.",
    "paper io 3d": "3D adventure. Navigate immersive environments and overcome obstacles.",
    "paper mario": "Turn-based RPG adventure. Explore paper craft worlds with strategic battles.",
    "paperio2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "partners in time": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "phantasy star iv": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "pick crafter": "Creative building. Gather resources, construct, shape your world.",
    "picross ds": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "pokemon diamond": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "pokemon fire red": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "pokemon leaf green": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "pokemon platinum": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "pokemon ruby": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "pokemon sapphire": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "pokemon snap": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "pokemon soulsilver": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "pokemon stadium": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "pokemon unbound": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "pokemon yellow": "Catch and train Pokemon. Battle trainers, collect badges, become regional champion.",
    "pool": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "portal": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "portal 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "precision client": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "professor layton": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "punch out": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "quest 64": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "rabbit samurai": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "ranger x": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "rayman 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "redball": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "redball 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "redball 4": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "redball 4 vol 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "redball 4 vol 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "rise higher": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "ristar": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "rocket soccer": "Soccer gameplay. Score goals, execute plays, lead team to victory.",
    "rough dino": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "run": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "run 3 plus": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "sandspiel": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "sandstone": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "sandtrix": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "scribblenauts": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "shapeshipper": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "shift": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "shift 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "shift 3": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "shift 4": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "shining force": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "shinobi iii": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "shop empire": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "shop empire fable": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "shrek 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "simcity 2000": "Simulation experience. Manage systems, make decisions, build and grow.",
    "simpsons road rage": "Simulation experience. Manage systems, make decisions, build and grow.",
    "skibidi toilet 1v100": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "skibidi toilet attack": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "skywire": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "skywire 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "slope ball": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "slope city": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "snake": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "snow battle io": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "soccer random": "Soccer gameplay. Score goals, execute plays, lead team to victory.",
    "solitaire": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "sonic advance": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "sonic advance 2": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "sonic and knuckles": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "sonic rush": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "sonic spinball": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "sonic the hedgehog": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "sonic the hedgehog 2": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "sonic the hedgehog 3": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "space invaders": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "spirit tracks": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "sprinter": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "stack": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "stair race 3d": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "star fox 64": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "state io": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "steak and jake": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "steak and jake midnight": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "stealing the diamond": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "stick war": "Physics-based action. Experience realistic movement and brutal impacts.",
    "stick war 2": "Physics-based action. Experience realistic movement and brutal impacts.",
    "street fighter 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "streets of rage": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "streets of rage 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "subway runner": "Endless runner. Dodge obstacles, collect coins, and survive as long as possible.",
    "subway surfers": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "sudoku": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "super bomberman": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "super hot": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "super mario 64 ds": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "super mario bros 2": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "super mario bros 3": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "super mario construct": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "super mario flash": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "super mario flash 2": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "super mario kart": "Kart racing with Mario and friends. Race on creative tracks using items and shortcuts.",
    "super mario land": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "super mario land 2": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "super mario rpg": "Turn-based RPG adventure. Explore paper craft worlds with strategic battles.",
    "super mario world": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "super meat boy": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "super metroid": "Sci-fi exploration. Navigate alien worlds gaining power-ups and abilities.",
    "super monkey ball jr": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "super princess peach": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "super smash bros": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "super tennis": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "super treadmill": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "superhero drop": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "superstar saga": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "swindler": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "swords and sandals": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "swords and sandals 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "territorial io": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "test subject arena": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "test subject complete": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "tetris": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "tetris ds": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "the binding of isaac": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "the impossible quiz 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "the legend of zelda": "Action-adventure classic. Explore dungeons, solve puzzles, save Hyrule from evil.",
    "the sims 2": "Simulation experience. Manage systems, make decisions, build and grow.",
    "the sims 3": "Simulation experience. Manage systems, make decisions, build and grow.",
    "theme hotel": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "there is no game": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "three line": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "thumb fighter": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "time shooter": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "time shooter 3": "Action shooter. Eliminate enemies, complete missions, upgrade arsenal.",
    "totally accurate battle sim": "Simulation experience. Manage systems, make decisions, build and grow.",
    "townscaper": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "tron": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "turok dinosaur hunter": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "twin shot": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "twin shot 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "ultimate flash sonic": "High-speed platformer. Race through levels at supersonic pace collecting rings.",
    "unfair mario": "Classic platformer. Jump, run, stomp enemies, and save Princess Peach.",
    "vectorman": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "vectorman 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "vex": "Stickman platformer. Navigate deadly traps with precise timing and skill.",
    "volley random": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "wall smash": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "wario land 4": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "wario land ii": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "wario's woods": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "warioware": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "warioware diy": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "warioware touched": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "watermelon game": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "waterworks": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "wave race 64": "High-speed racing. Compete on tracks, drift corners, upgrade vehicles.",
    "world's hardest game": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "worlds hardest game 2": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "worms world party": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "wubzzys adventure": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "xx142-b2.exe": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "yohoho io": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "yoshi's island": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "yoshi's story": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "zombocalypse": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "zombotron": "Exciting gameplay with unique challenges. Test your skills and have fun!",
    "zombotron 2": "Exciting gameplay with unique challenges. Test your skills and have fun!"
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
