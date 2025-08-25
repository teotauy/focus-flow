"use client";

import { useState, useEffect, useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Calendar, CheckCircle } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  isAllDay: boolean;
}

interface CalendarServiceProps {
  onEventsLoaded: (events: CalendarEvent[]) => void;
}

export default function CalendarService({ onEventsLoaded }: CalendarServiceProps) {
  const { data: session } = useSession();
  const [connectedCalendars, setConnectedCalendars] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const connectGoogleCalendar = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: window.location.href });
    } catch (error) {
      console.error('Failed to connect Google Calendar:', error);
    } finally {
      setLoading(false);
    }
  };



  const disconnectCalendar = async (provider: string) => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: window.location.href });
      setConnectedCalendars(prev => prev.filter(cal => cal !== provider));
    } catch (error) {
      console.error('Failed to disconnect calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarEvents = useCallback(async (provider: string) => {
    try {
      const response = await fetch(`/api/calendar/${provider}`);
      if (response.ok) {
        const data = await response.json();
        onEventsLoaded(data.events);
      }
    } catch (error) {
      console.error(`Failed to fetch ${provider} calendar events:`, error);
    }
  }, [onEventsLoaded]);

  useEffect(() => {
    if (session?.provider) {
      setConnectedCalendars(prev => 
        prev.includes(session.provider) ? prev : [...prev, session.provider]
      );
      fetchCalendarEvents(session.provider);
    }
  }, [session, fetchCalendarEvents]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Calendar Integration</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Google Calendar */}
        <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:border-indigo-500">
          <div className="flex-shrink-0">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Google Calendar</p>
              <p className="text-sm text-gray-500">Connect your Google Calendar</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            {connectedCalendars.includes('google') ? (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <button
                  onClick={() => disconnectCalendar('google')}
                  className="text-sm text-red-600 hover:text-red-800"
                  disabled={loading}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectGoogleCalendar}
                disabled={loading}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Connect
              </button>
            )}
          </div>
        </div>

        {/* Microsoft Calendar - Coming Soon */}
        <div className="relative rounded-lg border border-gray-300 bg-gray-50 px-6 py-5 shadow-sm flex items-center space-x-3 opacity-60">
          <div className="flex-shrink-0">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Microsoft Calendar</p>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Soon
            </span>
          </div>
        </div>

        {/* Apple Calendar - Coming Soon */}
        <div className="relative rounded-lg border border-gray-300 bg-gray-50 px-6 py-5 shadow-sm flex items-center space-x-3 opacity-60">
          <div className="flex-shrink-0">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Apple Calendar</p>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Soon
            </span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </div>
        </div>
      )}
    </div>
  );
}
