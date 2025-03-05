export interface MaterialEntry {
  id: number;
  event_id: number;
  contributor_name: string;
  material_type: string;
  weight: number;
  description: string;
  place: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  event_type: string;
}