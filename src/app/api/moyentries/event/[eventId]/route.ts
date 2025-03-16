import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const eventId = params.eventId;

  try {
    // Make a request to your backend API
    const response = await axios.get(`${process.env.BACKEND_API_URL || 'http://localhost:3000'}/api/moyentries/event/${eventId}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching MOY entries from backend:', error);
    
    // For testing purposes, return mock data if the API call fails
    const mockEntries = [
      {
        id: 1,
        event_id: Number(eventId),
        contributor_name: "Ramesh Kumar",
        amount: 5000.00,
        notes: "Best wishes for the wedding",
        place: "Chennai",
        created_at: "2023-12-20T10:00:00.000Z",
        updated_at: "2023-12-20T10:00:00.000Z"
      },
      {
        id: 2,
        event_id: Number(eventId),
        contributor_name: "Priya Sharma",
        amount: 3000.00,
        notes: "Congratulations on your special day",
        place: "Coimbatore",
        created_at: "2023-12-21T11:30:00.000Z",
        updated_at: "2023-12-21T11:30:00.000Z"
      },
      {
        id: 3,
        event_id: Number(eventId),
        contributor_name: "Suresh Patel",
        amount: 7500.00,
        notes: "Wishing you happiness",
        place: "Madurai",
        created_at: "2023-12-22T09:15:00.000Z",
        updated_at: "2023-12-22T09:15:00.000Z"
      }
    ];
    
    return NextResponse.json(mockEntries);
  }
}