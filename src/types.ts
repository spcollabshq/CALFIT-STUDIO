/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'holistic';
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  image: string;
  benefits: string[];
  whoIsItFor: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  bio: string;
  image: string;
  socials: {
    instagram?: string;
    twitter?: string;
  };
}

export interface ClassSession {
  id: string;
  serviceId: string;
  trainerId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  availableSlots: number;
  totalSlots: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  billing: string;
  features: string[];
  isPopular?: boolean;
}

export interface UserBooking {
  id: string;
  classId: string;
  status: 'confirmed' | 'cancelled' | 'attended';
  bookingDate: Date;
}
