import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const eventId = params.eventId;

  try {
    // Make a request to your backend API
    const response = await axios.get(`${process.env.BACKEND_API_URL || 'http://localhost:3000'}/api/events/${eventId}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching event details from backend:', error);
    
    // For testing purposes, return mock data if the API call fails
    // Remove this in production and handle errors properly
    const mockEvent = {
      id: Number(eventId),
      name: "Sample Event",
      date: "2023-12-25T10:00:00.000Z",
      location: "Chennai",
      event_type: "Wedding"
    };
    
    return NextResponse.json(mockEvent);
  }
}