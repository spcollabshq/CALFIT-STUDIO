import axios from 'axios';
import { Service, Trainer, ClassSession, Review } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

export const fetchServices = async (): Promise<Service[]> => {
  const { data } = await api.get('/services');
  return data;
};

export const fetchTrainers = async (): Promise<Trainer[]> => {
  const { data } = await api.get('/trainers');
  return data;
};

export const fetchSchedule = async (): Promise<ClassSession[]> => {
  const { data } = await api.get('/schedule');
  return data;
};

export const fetchReviews = async (): Promise<Review[]> => {
  const { data } = await api.get('/reviews');
  return data;
};

export const submitContactForm = async (formData: { name: string; email: string; message: string }) => {
  const { data } = await api.post('/contact', formData);
  return data;
};

export default api;
