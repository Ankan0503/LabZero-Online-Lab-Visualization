import axios from 'axios';
import { ElementData } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const getElements = async (): Promise<ElementData[]> => {
  try {
    const response = await axios.get<ElementData[]>(`${API_URL}/elements/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching elements:", error);
    throw error;
  }
};
