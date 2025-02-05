export interface User {
  id: string;
  email: string;
  name: string;
}

export interface MedicalHistory {
  age: number;
  weight: number;
  height: number;
  conditions: string[];
  allergies: string[];
  activityLevel: 'sedentary' | 'moderate' | 'active';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  availability: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
}