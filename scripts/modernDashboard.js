let currentActiveCard = null;
let currentActiveAudio = null;
let currentActiveButton = null;

/*****************************************************
 * HELPER FUNCTIONS FOR HISTORY
 *****************************************************/
function isSongInHistory(category, songName) {
  const history = JSON.parse(localStorage.getItem('songHistory') || '[]');
  return history.some(item => item.category === category && item.name === songName);
}

function addSongToHistory(category, songName) {
  const history = JSON.parse(localStorage.getItem('songHistory') || '[]');
  history.push({ category, name: songName });
  localStorage.setItem('songHistory', JSON.stringify(history));
}
/*****************************************************
 * CATEGORY SONGS:
 * For each category, update the 20 song names below with
 * the exact file names (without the .mp3 extension) you imported.
 *****************************************************/
const categorySongs = {
  pop:       ["Ariel Shalom - Dont Waste My Time", "Captain Joz - Chosen", "Dan Zeitune - Never Let Go", "Danny Shields - What Is Next", "Elena - Timeless", "Emily Lewis - LOML Cliché", "Jimit - CRUSH", "Kalari - Sharam", "K-MISA - La vie en C", "Lemon - Dreamscape", "Marnino Toussaint - One Favor", "Mel M - Nothing to Do", "messwave - uh ugh", "Oliver Michael - Down", "REYPA - COQUETTE3", "Roza - Leash Off", "Sheer Haimov - Sweat", "Wake the Wild - Press Play", "WEARETHEGOOD - Bad Girls", "Yarin Primak - Hey You - Yarin Primak Remix"],
  rock:      ["Ace - The Convincer", "AlexGrohl - Our New Adventure", "AlexGrohl - Popular Monster", "Artlist Musical Logos - Astral Annihilation", "Charly Twins - All the Good Stuff", "Charly Twins - You Got Me", "CustomMelody - Headbanger", "Dizzy - Back to Basic", "Ikoliks - Start the Ignition", "Janes Party - Cigarette Buzz - Instrumental Version", "Leva - Jet Stream", "MooveKa - Swingin  Rockin", "Noa Mazar - Sweatshirts", "ORKAS - Here They Come", "Rex Banner - Merry Go Round", "Rex Banner - Take U There - Instrumental Version", "RocknStock - Unstoppable", "Semo - Slam", "The North - Firing on All Cylinders", "X ARI - Wild and Free - Instrumental Version"],
  jazz:      ["Alexander Levin - Lexington Avenue", "Amit Katzengold - Pass the Mayo", "Amos Ever Hadani - Heavy Traffic", "Aves - Coffee Stop", "Colonel Mustard - Swing Science", "Danny Shields - Paving the Way", "Gil Felix - Abraços e Beijo - Instrumental Version", "Jonathan Hadas - The Nutcracker Medley", "Kobi Salomon - Swan Lake Jazzed Up", "Kyle Cox - Do You Think That Santa Celebrates Halloween - Instrumental Version", "Louis Adrien - Skip Little Jimmy", "Retrophonic - Le Paris Village - Instrumental Version", "Semo - The Microwave Dance", "Southside Aces - Mr Inside Voice", "The BaldyBrothers - Milk and Chocolate", "The BaldyBrothers - This Afternoon", "Will Padgett - Room for Cream", "Ziggy - Busy Bee Bop", "Ziggy - Four Men Job", "Ziv Moran - Boulangerie"],
  funk:      ["Artlist Musical Logos - Deep Feelings", "Avni Vibes - Evening Elegance", "Bonjour Bonjour  - Danza della Tarantella", "CTRL S - Brisa Do Mar", "Dor Hadad - River Banks", "Gil Felix - A Verdade e a Historia - Instrumental Version", "Gil Kita - March of the Dwarves", "idokay - Pass the Damn Turkey", "Kashido - The Good Days", "Kobi Salomon - Mélodie", "Lance Conrad - Scooby Doobie Dah", "Liron Yuval - Liberation", "Louis Adrien - Happiest Day", "Nigun Quartet - Dance Nigun", "Simon Berggren - Ephemeraldas Ballroom", "T Bless  the Professionals - Jiggin the Jig", "The Original Orchestra - The Swindler", "The Original Orchestra - The Swindler", "Ziggy - Floor Plan", "Ziv Moran - Easy-Peasy"],
  hiphop:    ["Couture - Mission Life", "Couture - Special Delivery", "Curtis Cole - Facades", "feinsmecker - Show Proof", "Frank Bentley - ALWAYS WIN", "Frank Bentley - Get Dangerous", "Giorgio Vitté - Marseille", "Jaylikethealphabet - BREAD", "Juval - Find a Way", "Mad Jino - Bad Girls", "Mkada - Wait a Minute", "Moza Kaliza - Eyes", "Nyron - Damage feat Until The Very End", "Olmi - Wanderlust", "Superlative - The Game Is Mine feat HMD", "Vic Sage - Better Than Ever", "WEARETHEGOOD - DANGEROUS BAD GUYS ANTHEM", "WEARETHEGOOD - HIGHBEAMS", "Wes Harris - Champion", "ZISO - Trendsetter"],
  latin:     ["Amos Ever Hadani - El Perico", "Captain Joz - Sunny Snack", "Curtis Cole - Me llamaste loca", "Dan Zeitune - Never Let Go - Instrumental Version", "djnoone - Ojitos", "Donner  Tie - Canto de Olho", "Ehekatl Arizmendi - Palenque del Diablo", "Gil Felix - Abraços e Beijo", "Giorgio Vitté - Que Pasa", "Gitkin - Chichala", "Joca Perpignan - Tambor mandou chamar", "Konstantin Garbuzyuk - Papi feat Vynth", "La Nata - Karma", "Marnino Toussaint - One Favor - No Lead Vocals", "Metro the Savage - Copera", "Raz Burg - Moonlit Fiesta", "Royal X - Dinero", "Tania Matus - Extraño", "Yarin Primak - Taka Riddim", "ZISO - Pura Vida"],
  rb:        ["ATELLER - Letters to Myself Stay Here", "Aves - God Is a Girl", "Aves - Gratitude", "Aves - Rewind - No Lead Vocals", "Aves - Rewind", "Chaun Davis - Be Mine", "dannyminus - Hello Sunshine", "FrozenjaZz - Satin and Kashmir - Instrumental Version", "Gaela Braun - Hero - No Lead Vocals", "Jimit - Feel Better", "Just for Kicks - Dinner", "Just for Kicks - Liquid Love", "Kazuya - 7 Answers", "Roy Young - Give It Up", "Roy Young - My Lonely Room", "Ryan Prewett - Change feat Chris Hatfield", "Ryan Prewett - Hit the Ground Running", "Selamo - Everything Youre Asking", "Semo - Better - Instrumental Version", "The Magnetic Buzz - Dont Let the Summer End"],
  electronic:["2050 - Electric Boost", "Ariel Shalom - Give Me Your Eyes", "Captain Joz - Now Move", "dannyminus - Energy", "epshy - Thats What You Get", "Evgeny Bardyuzha - Augmentation", "Flint - To the Victor", "Giorgio Vitté - Enter Night", "Just for Kicks - Lab Meat", "kawauso - duh", "March the Machine - I Feel Okay", "messwave - I’ve Been Thinking", "messwave - Timeless", "Oliver Michael - Wake Me Up", "R-CHY - Drop La La La", "Sunny Fruit - Love Gets Me High", "Third Dimension - Moments feat Marcel Aquila", "WEARETHEGOOD - Just Watch - Instrumental Version", "ZISO - Free Fall", "Zooki - Valentine 3024"],
  american:  ["Adam Simons - Canyon Song", "Adam Simons - One of These Days - No Lead Vocals", "Alex Mastronardi - Dusty Trails", "ALTR - Wild West", "Assaf Ayalon - My Heart Is Blue Black", "Bobby Quick - Our Hometown", "Bobby Quick - Wanted", "Echo LaRoux - Trust Myself", "Eric Hunker - When It All Ends", "Free As a Bird - Down Down Down feat Charla Peterson", "J Fitz - Find a Pathway Home", "Josh Tarp - Iowa", "Mack Waylon - Giving up on Settling Down", "Marshall Mcferrin - Just Another Honky Tonk", "Southern Call - Black Motorcycle", "Tennessee Pistols - Always Hope", "The Likes Of Us - Can’t Lose You", "The Parnells - Will We or Wont We", "Unknown River - Poor Broke and Living Free", "WEARETHEGOOD - Lonely Road"],
  acoustic:  ["ALTR - Distant", "Ben Strawn - Slow Living - Instrumental Version", "Bunker Buster - Life Goes On - Instrumental Version", "Elijah Aaron - Love Unfolding", "Elijah Aaron - Where We Go - Instrumental Version", "Evert Z - Life in the Countryside", "James Edward - Gone - Instrumental Version", "Josh Tarp - Mountaintop - Instrumental Version", "Louis Island - Glad You Came - Instrumental Version", "Louis Island - These Days - Instrumental Version", "Michael Shynes - Wilder - Instrumental Version", "ORKAS - Like a River - Instrumental Version", "Peaks  Valleys - Take Me Back", "Sean Magwire - Erase This Day - Instrumental Version", "Southern Call - End of the Line - Instrumental Version", "Steven Beddall - Ill Be Fine - Instrumental Version", "Straight White Teeth - Signal Flare - Instrumental Version", "The Likes Of Us - Lost in You - Instrumental Version", "The North - Follow You", "Yahel Doron - Open Sky"],
  chill:     ["Adi Goldstein - Snowfall", "Aves - Grand Avenue", "Aves - Reflection", "Couture - Special Delivery - No Lead Vocals", "Danny Shields - Paving the Way", "Flint - Hymn of the Bed", "Flint - The Living Room", "Jozeque - Afterlife", "Jozeque - Grounded Above", "Jozeque - Morning Caffe", "Kitrano - Sunday", "Le Marigold - Aaraam", "Magiksolo - Biscuit", "Magiksolo - Memory", "Magiksolo - Omari", "Ramol - Turbulence", "Samurai Royal - Coffee Break - Instrumental Version", "Samurai Royal - Lay Your Hands on Me Luv Set Me Free - Instrumental Version", "Samurai Royal - Magic Hour", "warmkeys - Like the Old Days"],
  classical: ["Ada Ragimov - Ave Maria", "Ardie Son - Flame", "AVIVA H - Salut Damour Loves Greeting", "Bishara Haroni - Toccata in D minor", "Brooklyn Classical - Waltz in A-Flat Major Op 39 No 15", "Carmel Quartet - Air on the G String", "DaniHaDani - Lev 2", "Kashido - Habanera Carmen", "Kobi Salomon - Sicilienne", "Mats Raynard - Ferris Wheel", "Pablo Suarez - Shiver", "Ran Raiten - Unresolved Resolutions", "Raviv Leibzirer - Für Elise", "Roy Dahan - Leaves", "Roy Zu-Arets - Dense Forest", "SEA - Rebuild", "Shatzlan - What Tears Are Shed at the Depths of the Damp Monastery Prelude in Em Op 28 No 4", "Tomer Lavie - On ne sait jamais", "Yoed Nir - Cello Suite No1 in G Major BWV 1007 - I Prelude", "Ziv Moran - Ebb and Flow"]
};

/*****************************************************
 * CATEGORY COLORS:
 * Distinct background color for each category card.
 *****************************************************/
const categoryColors = {
  pop: "#ff9999",
  rock: "#99ccff",
  jazz: "#ffcc99",
  funk: "#ffff99",
  hiphop: "#cc99ff",
  latin: "#ff99cc",
  rb: "#99ff99",
  electronic: "#66ccff",
  american: "#ffcc66",
  acoustic: "#cccccc",
  chill: "#99ffff",
  classical: "#ff9966"
};

/*****************************************************
 * GET RANDOM ELEMENTS
 *****************************************************/
function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/*****************************************************
 * CREATE SONG CARD
 *****************************************************/
function createSongCard(category, songName) {
  const card = document.createElement('div');
  card.className = 'song-card';

  // Title element
  const titleDiv = document.createElement('div');
  titleDiv.className = 'song-title';
  titleDiv.innerText = songName;

  // Pause/Play button (starts as "Play")
  const pauseBtn = document.createElement('button');
  pauseBtn.className = 'pause-btn';
  pauseBtn.innerText = 'Play';

  // Volume slider
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.className = 'adjustment-line';
  slider.min = '0';
  slider.max = '100';
  slider.value = '100';

  // Audio setup (looping = true, no auto-play)
  const audio = new Audio(`/music/${category}/${songName}.mp3`);
  audio.loop = true;

  // Toggle Pause/Play with active card handling and add to history (only first time)
  pauseBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    // If another card is active and it's not this one, reset it.
    if (currentActiveCard && currentActiveCard !== card) {
      if (currentActiveAudio && !currentActiveAudio.paused) {
        currentActiveAudio.pause();
      }
      if (currentActiveButton) {
        currentActiveButton.innerText = "Play";
      }
      currentActiveCard.classList.remove('active-card');
      currentActiveCard = null;
      currentActiveAudio = null;
      currentActiveButton = null;
    }

    if (audio.paused) {
      // If this song not in history yet, add it
      if (!isSongInHistory(category, songName)) {
        addSongToHistory(category, songName);
      }
      audio.play();
      pauseBtn.innerText = 'Pause';
      card.classList.add('active-card');
      currentActiveCard = card;
      currentActiveAudio = audio;
      currentActiveButton = pauseBtn;
    } else {
      audio.pause();
      pauseBtn.innerText = 'Play';
      card.classList.remove('active-card');
      if (currentActiveCard === card) {
        currentActiveCard = null;
        currentActiveAudio = null;
        currentActiveButton = null;
      }
    }
  });

  // Volume control
  slider.addEventListener('input', () => {
    audio.volume = slider.value / 100;
  });

  card.appendChild(titleDiv);
  card.appendChild(pauseBtn);
  card.appendChild(slider);

  return card;
}

/*****************************************************
 * TOGGLE HAMBURGER MENU
 *****************************************************/
function toggleMenu() {
  const menu = document.getElementById('menuContent');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

/*****************************************************
 * SHOW RANDOM SONGS
 * Arranged in a centered grid.
 *****************************************************/
function showRandom() {
  document.querySelector('.main-cards').style.display = 'none';
  const songDisplay = document.getElementById('songDisplay');
  songDisplay.style.display = 'block';
  songDisplay.innerHTML = '';
  songDisplay.style.position = 'relative';

  // Use the .song-grid layout
  songDisplay.classList.add('song-grid');

  let randomSongs = [];
  Object.keys(categorySongs).forEach(category => {
    const picks = getRandomElements(categorySongs[category], 2);
    picks.forEach(songName => {
      randomSongs.push({ category, name: songName });
    });
  });

  randomSongs.forEach(song => {
    const songCard = createSongCard(song.category, song.name);
    songDisplay.appendChild(songCard);
  });

  addBackButton();
}

/*****************************************************
 * SHOW CATEGORIES
 * Each category card has its own distinct color.
 * Also arranged in a centered grid layout.
 *****************************************************/
function showCategories() {
  document.querySelector('.main-cards').style.display = 'none';
  const songDisplay = document.getElementById('songDisplay');
  songDisplay.style.display = 'block';
  songDisplay.innerHTML = '';
  songDisplay.style.position = 'relative';

  // Use the .song-grid layout
  songDisplay.classList.add('song-grid');

  const categories = Object.keys(categorySongs);
  categories.forEach(category => {
    const categoryCard = document.createElement('div');
    categoryCard.className = 'song-card category-card';
    // Distinct background color
    categoryCard.style.backgroundColor = categoryColors[category] || "#444";
    categoryCard.innerText = category.charAt(0).toUpperCase() + category.slice(1);
    categoryCard.onclick = () => showCategorySongs(category);
    songDisplay.appendChild(categoryCard);
  });

  addBackButton();
}

/*****************************************************
 * SHOW SONGS BY CATEGORY
 * Also arranged in a centered grid layout.
 *****************************************************/
function showCategorySongs(category) {
  const songDisplay = document.getElementById('songDisplay');
  songDisplay.style.display = 'block';
  songDisplay.innerHTML = `<h2>${category.toUpperCase()} Songs</h2>`;
  songDisplay.style.position = 'relative';

  // Use the .song-grid layout
  songDisplay.classList.add('song-grid');

  const songs = categorySongs[category] || [];
  songs.forEach(songName => {
    const songCard = createSongCard(category, songName);
    songDisplay.appendChild(songCard);
  });

  addBackButton();
}

/*****************************************************
 * SHOW RECOMMENDATION
 * Also arranged in a centered grid layout.
 *****************************************************/
function showRecommendation() {
  const history = JSON.parse(localStorage.getItem('songHistory') || '[]');
  const distinctCategories = {};
  history.forEach(item => {
    distinctCategories[item.category] = true;
  });
  const categoryKeys = Object.keys(distinctCategories);
  const distinctCount = categoryKeys.length;
  const songsPerCategory = distinctCount > 0 ? Math.floor(20 / distinctCount) : 0;

  const songDisplay = document.getElementById('songDisplay');
  songDisplay.style.display = 'block';
  songDisplay.innerHTML = `<h2>Recommended Songs</h2>`;
  songDisplay.style.position = 'relative';

  // Use the .song-grid layout
  songDisplay.classList.add('song-grid');

  categoryKeys.forEach(category => {
    if (categorySongs[category]) {
      const picks = getRandomElements(categorySongs[category], songsPerCategory);
      picks.forEach(songName => {
        const songCard = createSongCard(category, songName);
        songDisplay.appendChild(songCard);
      });
    }
  });

  addBackButton();
}

/*****************************************************
 * PLAY SONG:
 * (Legacy function – not used by song cards since each card handles its own playback.)
 *****************************************************/
function playSong(category, songName) {
  const audio = new Audio(`/music/${category}/${songName}.mp3`);
  audio.loop = true;
  audio.play();

  if (!isSongInHistory(category, songName)) {
    addSongToHistory(category, songName);
  }
}

/*****************************************************
 * ADD BACK BUTTON
 *****************************************************/
function addBackButton() {
  const songDisplay = document.getElementById('songDisplay');

  const backBtn = document.createElement('button');
  backBtn.innerText = 'Back';
  backBtn.style.position = 'absolute';
  backBtn.style.top = '10px';
  backBtn.style.left = '10px';
  backBtn.style.padding = '10px 20px';
  backBtn.style.background = '#5d5df0';
  backBtn.style.color = '#fff';
  backBtn.style.border = 'none';
  backBtn.style.borderRadius = '5px';
  backBtn.style.cursor = 'pointer';
  backBtn.style.boxShadow = '0 3px 8px rgba(0,0,0,0.6)';

  backBtn.onclick = () => {
    // Hide the song display, remove grid layout, show main cards again
    songDisplay.style.display = 'none';
    songDisplay.innerHTML = '';
    songDisplay.classList.remove('song-grid');
    document.querySelector('.main-cards').style.display = 'flex';
  };

  songDisplay.appendChild(backBtn);
}

/*****************************************************
 * LOAD HISTORY
 *****************************************************/
function loadHistory() {
  const history = JSON.parse(localStorage.getItem('songHistory') || '[]');
  const container = document.getElementById('historyContainer');
  container.innerHTML = '<h2>Song History</h2>';
  if (history.length === 0) {
    container.innerHTML += '<p>No songs played yet.</p>';
  } else {
    history.forEach(item => {
      const songCard = createSongCard(item.category, item.name);
      container.appendChild(songCard);
    });
  }
}