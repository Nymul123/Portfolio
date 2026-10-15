import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_FILE = path.resolve(__dirname, 'server-portfolio-data.json');

// Default initial data structure
const DEFAULT_INITIAL_DATA = {
  profile: {
    name: "Nymul Hossain",
    displayTitle: "Computer Science Engineer & Software Developer",
    location: "Dhaka, Bangladesh",
    email: "nymul.hossain.dev@gmail.com",
    phone: "+880 1712-345678",
    whatsapp: "+8801712345678",
    avatar: null,
    bio: "Computer Science & Engineering graduate specializing in software architecture, web applications, and embedded engineering. Driven by clean code, system performance, and algorithmic problem-solving.",
    heroRoles: [
      "Computer Science Engineer",
      "Software Developer",
      "Full-Stack Engineer"
    ],
    socials: {
      github: "https://github.com/nymul-hossain",
      linkedin: "https://linkedin.com/in/nymul-hossain",
      email: "mailto:nymul.hossain.dev@gmail.com",
      facebook: "https://facebook.com/nymul.hossain"
    },
    metrics: []
  },
  education: [],
  skills: [],
  projects: [],
  achievements: [],
  research: [],
  resume: {
    summary: "Computer Science Engineer with a strong foundation in algorithms, systems engineering, full-stack web development, and embedded IoT hardware.",
    experience: []
  }
};

// Helper: Read persistent data
function readDataFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      if (content.trim()) {
        const parsed = JSON.parse(content);
        return {
          ...DEFAULT_INITIAL_DATA,
          ...parsed,
          profile: {
            ...DEFAULT_INITIAL_DATA.profile,
            ...parsed.profile,
            socials: {
              ...DEFAULT_INITIAL_DATA.profile.socials,
              ...(parsed.profile?.socials || {})
            }
          },
          education: Array.isArray(parsed.education) ? parsed.education : [],
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
          research: Array.isArray(parsed.research) ? parsed.research : []
        };
      }
    }
  } catch (err) {
    console.error('Error reading server data file:', err);
  }

  // Initialize file with defaults if not present
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_INITIAL_DATA, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error creating server data file:', err);
  }
  return DEFAULT_INITIAL_DATA;
}

// Helper: Write persistent data
function writeDataFile(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing server data file:', err);
    return false;
  }
}

async function startServer() {
  const app = express();

  // Allow up to 50MB for compressed avatar and thumbnail payloads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API: Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API: Get portfolio data (Accessible to any visitor on any device/browser)
  app.get('/api/portfolio', (_req: Request, res: Response) => {
    const data = readDataFile();
    res.json({ success: true, data });
  });

  // API: Update portfolio data (Stored centrally on server disk)
  app.post('/api/portfolio', (req: Request, res: Response) => {
    const { data, credentials } = req.body;

    // Validate credentials
    const isAuthorized = 
      credentials?.password === '12124545943007' ||
      credentials?.username === 'Nymul1178' ||
      req.headers.authorization === 'Bearer 12124545943007';

    if (!isAuthorized) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid admin credentials' });
    }

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid portfolio data payload' });
    }

    const ok = writeDataFile(data);
    if (ok) {
      return res.json({ success: true, message: 'Saved successfully to server', data });
    } else {
      return res.status(500).json({ success: false, error: 'Failed to write to server storage' });
    }
  });

  // API: Login verification
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === 'Nymul1178' && password === '12124545943007') {
      return res.json({ success: true, isOwner: true, token: '12124545943007' });
    }
    return res.status(401).json({ success: false, error: 'Invalid User ID or Password' });
  });

  // Vite development mode vs production static
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
