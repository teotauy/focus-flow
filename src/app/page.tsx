import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronDown, Settings } from 'lucide-react';

const CalendarProductivityApp = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [isTodayOpen, setIsTodayOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mockEvents, setMockEvents] = useState([
    {
      id: 1,
      title: "Team Standup",
      startTime: "09:00",
      endTime: "09:30",
      duration: 30,
      description: "Daily team sync and planning",
      status: "current"
    },
    {
      id: 2,
      title: "Deep Work: Feature Development",
      startTime: "10:00",
      endTime: "12:00",
      duration: 120,
      description: "Focus time for coding the new dashboard component",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Lunch Break",
      startTime: "12:00",
      endTime: "13:00",
      duration: 60,
      description: "Time to recharge",
      status: "upcoming"
    },
    {
      id: 4,
      title: "Client Review Meeting",
      startTime: "14:00",
      endTime: "15:00",
      duration: 60,
      description: "Present progress and gather feedback",
      status: "upcoming"
    }
  ]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Breathing exercise logic
  useEffect(() => {
    let breathingTimer;
    if (isBreathing) {
      breathingTimer = setInterval(() => {
        setBreathingPhase(prev => {
          if (prev === 'inhale') return 'hold';
          if (prev === 'hold') return 'exhale';
          setBreathingCount(count => count + 1);
          return 'inhale';
        });
      }, 4000);
    }
    return () => clearInterval(breathingTimer);
  }, [isBreathing]);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathingCount(0);
    setBreathingPhase('inhale');
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setBreathingPhase('inhale');
    setShowBreathingModal(false);
  };

  const getCurrentEvent = () => {
    return mockEvents.find(event => event.status === 'current');
  };

  const getNextEvent = () => {
    const currentIndex = mockEvents.findIndex(event => event.status === 'current');
    return mockEvents[currentIndex + 1] || null;
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return 'Ready';
    }
  };

  const getBreathingScale = () => {
    switch (breathingPhase) {
      case 'inhale': return 'scale-150';
      case 'hold': return 'scale-150';
      case 'exhale': return 'scale-75';
      default: return 'scale-100';
    }
  };

  const currentEvent = getCurrentEvent();
  const nextEvent = getNextEvent();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* Settings Button */}
      <div className="absolute top-8 right-8">
        <button
          onClick={() => setShowSettings(true)}
          className="text-gray-400 hover:text-black transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <main className="max-w-4xl mx-auto px-8 py-16 flex-1">
        
        {/* Current Task */}
        <div className="mb-24">
          {currentEvent ? (
            <div className="text-center">
              <div className="mb-8">
                <h1 className="text-5xl font-light text-black mb-4">{currentEvent.title}</h1>
                <p className="text-xl text-gray-600 font-light">{currentEvent.description}</p>
              </div>
              
              <div className="flex justify-center space-x-16 mb-8">
                <div>
                  <div className="text-3xl font-light text-black">{currentEvent.duration}</div>
                  <div className="text-sm text-gray-500 font-medium">MINUTES</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-black">{currentEvent.startTime}</div>
                  <div className="text-sm text-gray-500 font-medium">STARTS</div>
                </div>
              </div>

              <div className="w-64 mx-auto mb-8">
                <div className="w-full h-1 bg-gray-100 rounded">
                  <div className="bg-black h-1 rounded" style={{width: '65%'}}></div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowBreathingModal(true)}
                  className="text-gray-500 hover:text-black transition-colors font-light"
                >
                  Need to get back on track?
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-5xl font-light text-black mb-4">Nothing scheduled</h1>
              <p className="text-xl text-gray-600 font-light">Take a moment to plan</p>
            </div>
          )}
        </div>

        {/* Minimal Controls */}
        <div className="flex justify-center space-x-12 text-center">
          
          {/* Next Up */}
          {nextEvent && (
            <div className="text-gray-500">
              <div className="font-light">Next</div>
              <div className="text-black font-light">{nextEvent.title}</div>
              <div className="text-sm">{nextEvent.startTime}</div>
            </div>
          )}

        </div>

        {/* Today Schedule - Minimal Dropdown */}
        {isTodayOpen && (
          <div className="mt-16 max-w-sm mx-auto">
            <div className="space-y-4">
              {mockEvents.map((event) => (
                <div key={event.id} className="flex justify-between items-center">
                  <span className={`font-light ${
                    event.status === 'current' ? 'text-black' : 'text-gray-500'
                  }`}>
                    {event.title}
                  </span>
                  <span className="text-gray-400 text-sm font-light">
                    {event.startTime}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Bottom Controls */}
      <div className="pb-16">
        <div className="text-center">
          <button
            onClick={() => setIsTodayOpen(!isTodayOpen)}
            className="inline-flex items-center text-gray-500 hover:text-black transition-colors font-light"
          >
            Today
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isTodayOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Breathing Modal - Ultra Minimal */}
      {showBreathingModal && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="mb-16">
              <div className={`w-24 h-24 rounded-full mx-auto border border-black transition-transform duration-4000 ease-in-out ${
                isBreathing ? getBreathingScale() : 'scale-100'
              }`}></div>
            </div>
            
            <div className="mb-16">
              <div className="text-2xl font-light text-black mb-2">
                {isBreathing ? getBreathingInstruction() : 'Ready'}
              </div>
              {isBreathing && (
                <div className="text-gray-500 font-light">
                  {breathingCount + 1}
                </div>
              )}
            </div>

            <div className="space-x-8">
              <button
                onClick={isBreathing ? stopBreathing : startBreathing}
                className="text-gray-500 hover:text-black transition-colors font-light"
              >
                {isBreathing ? 'Stop' : 'Start'}
              </button>
              <button
                onClick={() => setShowBreathingModal(false)}
                className="text-gray-500 hover:text-black transition-colors font-light"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="max-w-2xl mx-auto px-8 py-16">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-16">
              <h1 className="text-3xl font-light text-black">Settings</h1>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-black transition-colors font-light"
              >
                Close
              </button>
            </div>

            {/* Calendar Integration */}
            <div className="mb-16">
              <h2 className="text-xl font-light text-black mb-8">Calendar Integration</h2>
              
              <div className="flex space-x-4 mb-8">
                <button className="px-6 py-3 border border-gray-200 rounded hover:border-gray-400 transition-colors font-light text-sm">
                  Add Google Calendar
                </button>
                <button className="px-6 py-3 border border-gray-200 rounded hover:border-gray-400 transition-colors font-light text-sm">
                  Add Outlook Calendar
                </button>
                <button className="px-6 py-3 border border-gray-200 rounded hover:border-gray-400 transition-colors font-light text-sm">
                  Add iCloud Calendar
                </button>
              </div>

              {/* Connected Calendars */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-light">Work Calendar</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500 font-light">Default for tasks</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-light">Personal Calendar</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500 font-light">Default for events</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-light">Family</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Account */}
            <div className="mb-16">
              <h2 className="text-xl font-light text-black mb-8">Account</h2>
              <a 
                href="#" 
                className="text-gray-500 hover:text-black transition-colors font-light"
              >
                Billing & Subscription →
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CalendarProductivityApp;