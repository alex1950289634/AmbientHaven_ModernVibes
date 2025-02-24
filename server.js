// =========================================
// server.js (Final Version with Mood Feature)
// =========================================
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');  // For file paths
const fs = require('fs');      // For checking file existence

const app = express();

// -- MIDDLEWARE SETUP ------------------------------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Serve MP3 Files from public/music
app.use('/music', express.static(path.join(__dirname, 'public/music')));

app.use(session({
  secret: 'YOUR_SECURE_RANDOM_SECRET_STRING',
  resave: false,
  saveUninitialized: false
}));

// -- IN-MEMORY USER STORAGE (DEMO ONLY) -------------------------------
const users = [];

// (Optional) Sound categories for Ambient Haven (not used in the new /song route)
const soundCategories = {
  'Focus & Productivity': [
    'music/focus/IrishCoast.mp3',
    'music/focus/CafeRestaurant.mp3'
  ],
  'Meditation & Relaxation': [
    'music/meditation/JapaneseGarden.mp3',
    'music/meditation/SingingBowls.mp3'
  ]
};

// (Optional) Sound map for single-sound pages (not used in the new /song route)
const soundMap = {
  'Irish Coast': 'music/focus/IrishCoast.mp3',
  'Cafe Restaurant': 'music/focus/CafeRestaurant.mp3'
};

// -- HELPER: CHECK IF USER IS AUTHENTICATED ---------------------------
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// -- ROUTES -----------------------------------------------------------

// Home -> Redirect to login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// GET: Login page
app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/choose'); // If already logged in, skip to choose
  }
  res.render('login', { error: null });
});

// POST: Process login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.render('login', { error: 'Invalid username or password' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    req.session.user = { username: user.username };
    return res.redirect('/choose');
  } else {
    return res.render('login', { error: 'Invalid username or password' });
  }
});

// GET: Register page
app.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/choose');
  }
  res.render('register', { error: null });
});

// POST: Register new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.render('register', { error: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.redirect('/login');
});

// GET: CHOOSE PAGE (our new "pop-up" style page with 2 circle options)
app.get('/choose', isAuthenticated, (req, res) => {
  res.render('choose');
});

// GET: Dashboard (Ambient Haven)
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard');
});

// GET: Modern Dashboard (Modern Vides)
app.get('/modern', isAuthenticated, (req, res) => {
  res.render('modernDashboard');
});

/*****************************************************
 * NEW MOOD FOLDERS FOR GET SOUNDS RECOMMENDATION
 *****************************************************/
const moodFolders = [
  'stressful',
  'angry',
  'sad',
  'happy',
  'anxious',
  'lonely',
  'bored',
  'tired'
];

/*****************************************************
 * GET /soundrecommend:
 * Displays a dropdown for the 8 mood categories
 *****************************************************/
app.get('/soundrecommend', isAuthenticated, (req, res) => {
  // Render your soundRecommend.ejs, passing moodFolders
  res.render('soundRecommend', { categories: moodFolders });
});

/*****************************************************
 * POST /soundrecommend:
 * Reads chosen mood from the form, scans that folder
 * for .mp3 files, then renders soundRecommendResult.ejs
 *****************************************************/
app.post('/soundrecommend', isAuthenticated, (req, res) => {
  const chosenMood = req.body.category; // e.g. "happy"
  const folderPath = path.join(__dirname, 'public', 'music', chosenMood);

  let soundFiles = [];
  if (fs.existsSync(folderPath)) {
    // Read all files in /public/music/<chosenMood> and filter .mp3
    const allFiles = fs.readdirSync(folderPath);
    soundFiles = allFiles.filter(file => file.toLowerCase().endsWith('.mp3'));
  }

  // Render the results page
  res.render('soundRecommendResult', {
    chosenMood,
    soundFiles
  });
});

// GET: Single Sound Page (For MP3 files in category folders)
app.get('/song', isAuthenticated, (req, res) => {
  const title = req.query.title;
  if (!title) {
    return res.send('Sound title not provided.');
  }

  // List of category subfolders in public/music where MP3 files are stored
  const subfolders = [
    "focus", "meditation", "sleep", "whiteNoise", "tinnitus", 
    "stress", "quietRooms", "adhd", "openSpace", "home", "baby", "relaxing"
  ];

  let foundPath = null;
  for (const folder of subfolders) {
    const possiblePath = path.join(__dirname, 'public', 'music', folder, `${title}.mp3`);
    if (fs.existsSync(possiblePath)) {
      foundPath = path.join('music', folder, `${title}.mp3`);
      break;
    }
  }

  if (foundPath) {
    // Render the sound page (soundPage.ejs) for MP3 playback
    res.render('soundPage', { title, filePath: `/${foundPath}` });
  } else {
    return res.send('Sound not found or invalid title.');
  }
});

// Serve MP3 for Modern Vibes Dashboard (unchanged)
app.get('/play/:category/:song', isAuthenticated, (req, res) => {
  const { category, song } = req.params;
  const filePath = path.join(__dirname, 'public/music', category, `${song}.mp3`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error serving ${song}:`, err);
      res.status(404).send('MP3 file not found.');
    }
  });
});

// ======================================
// HISTORY PAGE ROUTE
// ======================================
app.get('/history', isAuthenticated, (req, res) => {
  res.render('history');
});

// ======================================
// LOGOUT ROUTE
// ======================================
app.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login'); // Once logged out, go back to login page
  });
});

// -- START THE SERVER -------------------------------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

