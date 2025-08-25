import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${now.toISOString()}&endDateTime=${endOfDay.toISOString()}&$orderby=start/dateTime`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Microsoft Graph API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    const events = data.value?.map((event: { id: string; subject?: string; start?: { dateTime: string }; end?: { dateTime: string }; bodyPreview?: string; location?: { displayName: string }; isAllDay?: boolean }) => ({
      id: event.id,
      title: event.subject || "Untitled",
      startTime: event.start?.dateTime,
      endTime: event.end?.dateTime,
      description: event.bodyPreview || "",
      location: event.location?.displayName || "",
      isAllDay: event.isAllDay || false,
    })) || [];

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Microsoft Calendar API error:", error);
    return NextResponse.json({ error: "Failed to fetch calendar events" }, { status: 500 });
  }
}
