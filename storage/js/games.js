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
    // Popular Games
    "OvO": "A fast-paced parkour platformer where you run, jump, slide, and dive through challenging levels. Master precision movement and timing to overcome obstacles.",
    "OvO 2": "The sequel to the hit parkour game with new levels, mechanics, and challenges. Test your reflexes with even trickier obstacles and faster gameplay.",
    "OvO 3 Dimensions": "Take parkour to new heights in this 3D evolution of the classic OvO series. Navigate through dimensional obstacles with enhanced movement mechanics.",
    "Retro Bowl": "Lead your football team to glory in this retro-styled American football game. Manage your roster, call plays, and win championships.",
    "Retro Bowl College": "Experience college football in retro style. Recruit players, manage your college team, and compete for the championship.",
    "2048": "Combine numbered tiles to reach 2048. A simple yet addictive puzzle game that tests your strategy and planning skills.",
    "Slope": "Race down an endless slope avoiding obstacles and staying on the track. Test your reflexes in this fast-paced 3D running game.",
    "Slope 2": "The sequel with improved graphics and new challenging tracks. Navigate through treacherous slopes at breakneck speeds.",
    "Run 3": "Navigate through space tunnels in this addictive endless runner. Jump between platforms and avoid falling into the void.",
    "Jetpack Joyride": "Fly through a laboratory dodging obstacles with your jetpack. Collect coins and power-ups in this action-packed side-scroller.",
    "Friday Night Funkin": "Rhythm game where you battle opponents in musical rap battles. Hit the right notes to win over your girlfriend's dad.",
    "Temple Run 2": "Endless running game where you escape from temple guardians. Swipe to turn, jump, and slide through ancient ruins.",
    "Stickman Hook": "Swing through levels using grappling hooks. Master the physics-based movement to reach the finish line.",
    
    // Vex Series
    "Vex 1": "The original stickman platformer with deadly traps and challenging levels. Precision timing is key to survival.",
    "Vex 2": "More levels, more traps, more challenge. Navigate through increasingly difficult obstacle courses.",
    "Vex 3": "Third installment with new mechanics and harder levels. Can you survive all the deadly traps?",
    "Vex 3 XMAS": "Holiday-themed version of Vex 3 with festive obstacles and winter wonderland levels.",
    "Vex 4": "Continue the challenging platformer series with new zones and achievements to unlock.",
    "Vex 5": "The fifth adventure featuring new levels, mechanics, and challenges for veteran players.",
    "Vex 6": "Latest in the series with enhanced graphics and even more challenging obstacle courses.",
    "Vex 7": "The newest Vex adventure with fresh levels and the toughest challenges yet.",
    
    // FNAF Series
    "Five Nights at Freddy's": "Survive five nights as a security guard in a haunted pizza restaurant. Monitor cameras and conserve power to survive.",
    "Five Nights at Freddy's 2": "Return to Freddy Fazbear's Pizza with new animatronics and gameplay mechanics. Survive the night shifts.",
    "Five Nights at Freddy's 3": "Thirty years after the first restaurant closed, face the horrors in a horror attraction based on the legend.",
    "Five Nights at Freddy's 4": "Face your childhood nightmares in this terrifying fourth installment. Defend against nightmare animatronics.",
    
    // Sports & Racing
    "Basketball Frvr": "Simple yet addictive basketball shooting game. Swipe to shoot hoops and beat your high score.",
    "Basket Battle": "Compete in fast-paced basketball matches. Score baskets and outplay your opponent.",
    "Crossy Road": "Why did the chicken cross the road? Guide characters across busy streets, rivers, and train tracks.",
    "Drift Boss": "Master the art of drifting around corners. Keep your car on the winding platform for as long as possible.",
    "Drift Hunters": "Customize and drift high-performance cars. Earn points through skillful drifting and upgrades.",
    
    // Puzzle Games
    "Color Water Sort 3D": "Sort colored water into tubes until each tube contains only one color. A relaxing puzzle challenge.",
    "Block Blast": "Match and clear blocks in this addictive puzzle game. Plan your moves to achieve high scores.",
    "Amaze": "Paint the entire maze by moving through it. Simple concept with increasingly complex puzzles.",
    "Bottle Jump 3D": "Flip and jump the bottle from object to object. Master the physics to land perfectly every time.",
    
    // Action & Adventure
    "Bowmasters": "Multiplayer archery battle game. Aim and shoot to defeat opponents with various characters and weapons.",
    "Gladihoppers": "Physics-based gladiator fighting game. Battle in the arena using various weapons and tactics.",
    "Ice Dodo": "Help the ice bird navigate through frozen landscapes. Avoid obstacles and collect items.",
    "Attack Hole": "Control a black hole that grows by consuming objects. Strategy meets chaos in this unique game.",
    "Bazooka Boy": "Shoot your way through levels using a bazooka. Destroy obstacles and enemies with explosive power.",
    "Ragdoll Hit": "Shoot the ragdoll character through obstacles and targets. Physics-based shooting with satisfying results.",
    
    // Platformers & Runners
    "Geometry Dash Lite (REMAKE)": "Rhythm-based platformer where you jump and fly through dangerous passages. Timing is everything.",
    "Stacky Dash": "Collect blocks and use them to build bridges across gaps. Balance speed with resource management.",
    "Tall Man Run": "Run through gates to grow taller or shorter. Navigate obstacles that require different heights.",
    "Supreme Duelist": "Fast-paced stickman fighting game. Outmaneuver and defeat your opponent in intense duels.",
    "Turbo Stars": "Race against opponents on wild tracks. Jump, duck, and dash your way to victory.",
    
    // Casual & Arcade
    "Pou": "Virtual pet game where you feed, clean, and play with your alien pet. Keep Pou happy and healthy.",
    "Sprunki": "Musical creativity game where you create beats and melodies. Mix different sounds and characters.",
    "Magic Tiles 3": "Tap the black tiles to the rhythm of the music. Test your reflexes and musical timing.",
    "Hide N Seek": "Classic hide and seek game with a twist. Either hide from seekers or find all the hiders.",
    "Bridge Race": "Collect blocks and build bridges faster than opponents. Strategic gathering and building.",
    "Color Match": "Match colors quickly in this fast-paced arcade game. Test your color recognition skills.",
    "Dig Deep": "Dig underground to collect treasures and resources. Manage your tools and explore depths.",
    "Monster Tracks": "Drive monster trucks over challenging terrain. Perform stunts and reach the finish line.",
    "Gobble": "Eat everything in your path to grow larger. Classic snake gameplay with a modern twist.",
    "Road of Fury": "Post-apocalyptic driving game with intense action. Shoot enemies and survive the wasteland.",
    "Driven Wild": "Racing game with wild tracks and crazy vehicles. Speed through challenging courses.",
    "Mob Control HTML5": "Control crowds and direct them to victory. Strategic crowd management and timing.",
    
    // Classic Games
    "Hydrovolter": "Fast-paced action game with electric powers. Navigate levels and defeat enemies.",
    "Wordle": "Daily word puzzle where you guess a five-letter word in six tries. Use logic and vocabulary skills.",
    "Cookie Clicker": "Incremental game where you click to bake cookies. Unlock upgrades and automation.",
    "Tetris": "Classic block-stacking puzzle game. Rotate and place falling pieces to clear lines.",
    "Snake": "Guide the snake to eat food and grow longer. Avoid hitting walls or yourself.",
    "Solitaire": "Classic card game. Stack cards in descending order and alternating colors.",
    "Pac-Man": "Iconic maze game where you eat pellets while avoiding ghosts. Eat power pellets to turn the tables.",
    "Space Invaders": "Classic arcade shooter. Defend Earth from descending alien invaders.",
    
    // Adventure Games
    "Happy Wheels": "Physics-based ragdoll game with brutal levels. Choose characters and navigate deadly obstacle courses.",
    "Learn to Fly": "Help the penguin achieve flight through various contraptions. Upgrade equipment to fly farther.",
    "Learn to Fly 2": "Sequel with more upgrades, levels, and ways to help the penguin soar.",
    "Learn to Fly 3": "Latest installment with the most features and challenging objectives yet.",
    "Fancy Pants Adventure": "Stylish stick figure platformer with smooth animations. Run, jump, and slide through colorful worlds.",
    "Fancy Pants Adventure 2": "Second adventure with new levels, enemies, and more fluid movement.",
    "Fancy Pants Adventure 3": "Epic conclusion with the biggest adventure and most challenges.",
    
    // Fighting Games
    "Super Smash Flash": "Fan-made fighting game featuring characters from various games. Battle in platform-fighter action.",
    "Stick War": "Control an army of stick figures in strategic warfare. Build units and conquer territories.",
    "Stick War 2": "Enhanced sequel with more units, upgrades, and strategic depth.",
    
    // Cooking Games
    "Papa's Burgeria": "Manage a burger restaurant. Take orders, grill patties, and serve customers perfectly.",
    "Papa's Pizzeria": "Run a pizza shop. Prepare, cook, and serve pizzas to demanding customers.",
    "Papa's Freezeria": "Create delicious sundaes at an ice cream shop. Mix ingredients and satisfy sweet tooths.",
    "Cooking Mama": "Cook various dishes following step-by-step instructions. Master culinary skills in mini-games.",
    
    // Multiplayer & IO Games
    "Agar.io": "Grow your cell by eating smaller cells. Avoid larger ones in this multiplayer arena.",
    "Slither.io": "Snake game in a multiplayer arena. Grow longer while avoiding other snakes.",
    
    // Default description for games not in database
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
