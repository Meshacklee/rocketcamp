// src/types/index.ts
export interface User {
  id: string;
  email: string;
  isEmailConfirmed: boolean;
}

export interface Expense {
  _id: string;
  user: string;
  amount: number;
  description?: string;
  category: string;
  date: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ExpenseResponse {
  success: boolean;
  expense: Expense;
}

export interface ExpensesResponse {
  success: boolean;
  expenses: Expense[];
  count: number;
  total: number;
  page: number;
  pages: number;
}