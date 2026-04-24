import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data
  const SERVICES = [
    {
      id: 'hiit',
      title: 'HIIT Training',
      category: 'cardio',
      duration: '45 mins',
      level: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1549576490-b0b4831daad2?q=80&w=2070&auto=format&fit=crop',
      description: 'High-intensity workouts for maximum results',
      fullDescription: 'Burn fat, build strength, and boost endurance...',
      benefits: ['Rapid fat loss', 'Improved cardiovascular health'],
      whoIsItFor: 'Perfect for those looking to maximize calories burned.'
    },
    {
      id: 'yoga',
      title: 'Morning Yoga',
      category: 'holistic',
      duration: '60 mins',
      level: 'Beginner',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1820&auto=format&fit=crop',
      description: 'Find your flow and start your day centered',
      fullDescription: 'Start your morning with a series of fluid movements...',
      benefits: ['Flexibility', 'Stress reduction'],
      whoIsItFor: 'Everyone looking for a mindful start.'
    },
    {
      id: 'crossfit',
      title: 'CrossFit WOD',
      category: 'strength',
      duration: '60 mins',
      level: 'Advanced',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
      description: 'Constantly varied functional movements',
      fullDescription: 'Our Workout of the Day (WOD) brings together weightlifting...',
      benefits: ['Raw strength', 'Gymnastic skills'],
      whoIsItFor: 'Fitness enthusiasts looking for a challenge.'
    }
  ];

  const TRAINERS = [
    { 
      id: 't1', 
      name: 'Alex Rivera', 
      specialty: 'CrossFit & Strength', 
      experience: '10+ Years', 
      image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fe?q=80&w=1974&auto=format&fit=crop',
      bio: 'Alex is a certified CrossFit Level 3 trainer with a passion for functional movement and competitive athletics.',
      socials: { instagram: '@arivera_fit' }
    },
    { 
      id: 't2', 
      name: 'Sarah Chen', 
      specialty: 'Yoga & Pilates', 
      experience: '8 Years', 
      image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop',
      bio: 'Sarah focuses on the intersection of mindfulness and mobility, helping students find strength through stillness.',
      socials: { instagram: '@sarah_flow' }
    },
    { 
      id: 't3', 
      name: 'Marcus Thorne', 
      specialty: 'HIIT & Cardio', 
      experience: '6 Years', 
      image: 'https://images.unsplash.com/photo-149175235542e-00bd77c60d21?q=80&w=2070&auto=format&fit=crop',
      bio: 'Marcus is known for his infectious energy and challenging HIIT sessions that push you to your absolute best.',
      socials: { twitter: '@mthorne_burn' }
    }
  ];

  const REVIEWS = [
    { id: 'r1', userName: 'Jessica M.', rating: 5, comment: 'CalFit has completely transformed my view on fitness. The trainers are world-class!', date: '2024-03-15' },
    { id: 'r2', userName: 'Rahul S.', rating: 4, comment: 'Amazing facilities and great community vibe. The HIIT classes are brutal but effective.', date: '2024-03-10' },
    { id: 'r3', userName: 'David K.', rating: 5, comment: 'Best CrossFit box in the city. The programming is top-notch.', date: '2024-03-25' }
  ];

  // API Routes
  app.get('/api/services', (req, res) => {
    res.json(SERVICES);
  });

  app.get('/api/trainers', (req, res) => {
    res.json(TRAINERS);
  });

  app.get('/api/reviews', (req, res) => {
    res.json(REVIEWS);
  });

  app.get('/api/schedule', (req, res) => {
    const schedule = [
      { id: 's1', serviceId: 'yoga', trainerId: 't2', day: 'Monday', startTime: '07:00 AM', endTime: '08:00 AM', availableSlots: 5, totalSlots: 15 },
      { id: 's2', serviceId: 'hiit', trainerId: 't3', day: 'Monday', startTime: '09:00 AM', endTime: '09:45 AM', availableSlots: 0, totalSlots: 20 },
      { id: 's3', serviceId: 'crossfit', trainerId: 't1', day: 'Tuesday', startTime: '06:00 PM', endTime: '07:00 PM', availableSlots: 12, totalSlots: 25 }
    ];
    res.json(schedule);
  });

  app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    console.log('Contact form received:', { name, email, message });
    res.json({ message: 'Message sent successfully' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
