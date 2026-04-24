/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, Trainer, ClassSession, MembershipPlan, Review } from './types';

export const SERVICES: Service[] = [
  {
    id: 'hiit',
    title: 'HIIT Training',
    description: 'High-intensity workouts for maximum results',
    fullDescription: 'Burn fat, build strength, and boost endurance with our signature High-Intensity Interval Training. This fast-paced class combines explosive movements with short recovery periods to keep your heart rate elevated and your metabolism metabolism firing long after you leave the studio.',
    category: 'cardio',
    duration: '45 mins',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=2025&auto=format&fit=crop',
    benefits: ['Rapid fat loss', 'Improved cardiovascular health', 'Muscle toning', 'Metabolic boost'],
    whoIsItFor: 'Perfect for those looking to maximize calories burned in minimum time. Not recommended for those with acute joint issues.'
  },
  {
    id: 'yoga',
    title: 'Morning Yoga',
    description: 'Find your flow and start your day centered',
    fullDescription: 'Start your morning with a series of fluid movements and deep stretches designed to wake up your body and calm your mind. Our Vinyasa-style yoga focuses on breath-to-movement synchronization to improve flexibility and mental clarity.',
    category: 'holistic',
    duration: '60 mins',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?q=80&w=2070&auto=format&fit=crop',
    benefits: ['Flexibility', 'Stress reduction', 'Core strength', 'Mental focus'],
    whoIsItFor: 'Everyone from absolute beginners to seasoned yogis looking for a mindful start to their day.'
  },
  {
    id: 'crossfit',
    title: 'CrossFit WOD',
    description: 'Constantly varied functional movements at high intensity',
    fullDescription: 'Our Workout of the Day (WOD) brings together weightlifting, gymnastics, and metabolic conditioning. Each session is different, challenging every aspect of your fitness in a supportive community environment.',
    category: 'strength',
    duration: '60 mins',
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e249a3ef?q=80&w=2070&auto=format&fit=crop',
    benefits: ['Raw strength', 'Gymnastic skills', 'Endurance', 'Community support'],
    whoIsItFor: 'Fitness enthusiasts looking for a challenge and a community-driven atmosphere.'
  },
  {
    id: 'pilates',
    title: 'Core Fusion Pilates',
    description: 'Sculpt and lengthen through controlled movements',
    fullDescription: 'Focus on your core power. This class combines traditional Pilates principles with modern strength training to build functional strength, improve posture, and create long, lean muscle mass.',
    category: 'flexibility',
    duration: '50 mins',
    level: 'All Levels',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
    benefits: ['Core stability', 'Better posture', 'Injury prevention', 'Full body toning'],
    whoIsItFor: 'Great for anyone looking to strengthen their midsection and improve overall stability.'
  }
];

export const TRAINERS: Trainer[] = [
  {
    id: 't1',
    name: 'Alex Rivera',
    specialty: 'CrossFit & Strength',
    experience: '10+ Years',
    bio: 'Alex is a certified CrossFit Level 3 trainer with a passion for functional movement and competitive athletics.',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fe?q=80&w=1974&auto=format&fit=crop',
    socials: { instagram: '@arivera_fit' }
  },
  {
    id: 't2',
    name: 'Sarah Chen',
    specialty: 'Yoga & Pilates',
    experience: '8 Years',
    bio: 'Sarah focuses on the intersection of mindfulness and mobility, helping students find strength through stillness.',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop',
    socials: { instagram: '@sarah_flow' }
  },
  {
    id: 't3',
    name: 'Marcus Thorne',
    specialty: 'HIIT & Cardio',
    experience: '6 Years',
    bio: 'Marcus is known for his infectious energy and challenging HIIT sessions that push you to your absolute best.',
    image: 'https://images.unsplash.com/photo-149175235542e-00bd77c60d21?q=80&w=2070&auto=format&fit=crop',
    socials: { twitter: '@mthorne_burn' }
  }
];

export const PLANS: MembershipPlan[] = [
  {
    id: 'basic',
    name: 'Basic Access',
    price: '₹1,999',
    billing: '/month',
    features: ['Access to gym floor', '2 group classes per week', 'Basic towel service', 'Standard gym hours']
  },
  {
    id: 'pro',
    name: 'Pro Performance',
    price: '₹3,499',
    billing: '/month',
    isPopular: true,
    features: ['Unlimited group classes', 'Free guest pass (monthly)', 'Full studio access (7 AM - 12 AM)', 'Locker priority', '1 Personal Training session']
  },
  {
    id: 'elite',
    name: 'Elite Studio',
    price: '₹5,999',
    billing: '/month',
    features: ['All Pro features', 'Unlimited Personal Training', 'Nutrition planning', 'Wellness spa access', 'Reserved parking']
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    userName: 'Jessica M.',
    rating: 5,
    comment: 'CalFit has completely transformed my view on fitness. The trainers are world-class!',
    date: '2024-03-15'
  },
  {
    id: 'r2',
    userName: 'Rahul S.',
    rating: 4,
    comment: 'Amazing facilities and great community vibe. The HIIT classes are brutal but effective.',
    date: '2024-03-10'
  }
];

export const SCHEDULE: ClassSession[] = [
  { id: 's1', serviceId: 'yoga', trainerId: 't2', day: 'Monday', startTime: '07:00 AM', endTime: '08:00 AM', availableSlots: 5, totalSlots: 15 },
  { id: 's2', serviceId: 'hiit', trainerId: 't3', day: 'Monday', startTime: '09:00 AM', endTime: '09:45 AM', availableSlots: 0, totalSlots: 20 },
  { id: 's3', serviceId: 'crossfit', trainerId: 't1', day: 'Tuesday', startTime: '06:00 PM', endTime: '07:00 PM', availableSlots: 12, totalSlots: 25 },
  { id: 's4', serviceId: 'pilates', trainerId: 't2', day: 'Wednesday', startTime: '10:00 AM', endTime: '11:00 AM', availableSlots: 8, totalSlots: 15 },
  { id: 's5', serviceId: 'hiit', trainerId: 't3', day: 'Friday', startTime: '05:30 PM', endTime: '06:15 PM', availableSlots: 4, totalSlots: 20 },
];
