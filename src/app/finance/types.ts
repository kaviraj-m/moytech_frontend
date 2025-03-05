export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  event_type: string;
}

export interface FinanceEntry {
  id: number;
  event_id: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  date: string;
  category: string;
  created_at: string;
  updated_at: string;
}