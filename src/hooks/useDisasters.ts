import { useState, useEffect, useCallback } from 'react';

export interface Disaster {
  id: string;
  title: string;
  type: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  description: string;
  affectedArea: string;
  coordinates?: { lat: number; lng: number };
}

// West Bengal districts for filtering
const westBengalDistricts = [
  'Kolkata', 'Howrah', 'Hooghly', 'North 24 Parganas', 'South 24 Parganas',
  'Nadia', 'Murshidabad', 'Malda', 'Birbhum', 'Burdwan', 'Bankura',
  'Purulia', 'Medinipur', 'Jalpaiguri', 'Darjeeling', 'Cooch Behar',
  'Alipurduar', 'Dakshin Dinajpur', 'Uttar Dinajpur', 'West Bengal'
];

// Simulated real-time disaster data for West Bengal
const generateMockDisasters = (): Disaster[] => {
  const disasterTypes = [
    { type: 'Flood', icon: '🌊' },
    { type: 'Cyclone', icon: '🌀' },
    { type: 'Landslide', icon: '⛰️' },
    { type: 'Thunderstorm', icon: '⛈️' },
    { type: 'Heatwave', icon: '🌡️' }
  ];

  const currentDisasters: Disaster[] = [
    {
      id: '1',
      title: 'Flood Alert - Hooghly River',
      type: 'Flood',
      location: 'Hooghly District',
      severity: 'high',
      date: new Date().toISOString(),
      description: 'Rising water levels in Hooghly River affecting nearby villages. Evacuation recommended.',
      affectedArea: 'Chinsurah, Bandel, Serampore',
      coordinates: { lat: 22.9, lng: 88.4 }
    },
    {
      id: '2',
      title: 'Cyclone Warning - Bay of Bengal',
      type: 'Cyclone',
      location: 'South 24 Parganas',
      severity: 'critical',
      date: new Date().toISOString(),
      description: 'Cyclonic storm approaching coastal areas. Wind speeds expected to reach 120 km/h.',
      affectedArea: 'Sundarbans, Diamond Harbour, Kakdwip',
      coordinates: { lat: 21.8, lng: 88.2 }
    },
    {
      id: '3',
      title: 'Landslide Risk - Darjeeling',
      type: 'Landslide',
      location: 'Darjeeling District',
      severity: 'medium',
      date: new Date().toISOString(),
      description: 'Heavy rainfall causing soil erosion in hilly areas. Multiple roads blocked.',
      affectedArea: 'Kurseong, Kalimpong, Mirik',
      coordinates: { lat: 27.0, lng: 88.3 }
    }
  ];

  // Randomly show 0-3 disasters to simulate real-time changes
  const count = Math.floor(Math.random() * 4);
  return currentDisasters.slice(0, Math.max(count, 1));
};

export const useDisasters = (refreshInterval = 300000) => { // 5 minutes default
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDisasters = useCallback(async () => {
    setLoading(true);
    try {
      // In production, this would call a real disaster API like:
      // - India Meteorological Department API
      // - NDMA (National Disaster Management Authority)
      // - ReliefWeb API
      
      // For now, using mock data that simulates real-time changes
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = generateMockDisasters();
      setDisasters(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching disasters:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisasters();
    const interval = setInterval(fetchDisasters, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchDisasters, refreshInterval]);

  return { disasters, loading, lastUpdated, refetch: fetchDisasters };
};
