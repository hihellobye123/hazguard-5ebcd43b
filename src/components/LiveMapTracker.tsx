import { useState, useEffect } from "react";
import { RefreshCw, MapPin, Navigation } from "lucide-react";

interface LiveMapTrackerProps {
  workerName: string;
  workerLat: number;
  workerLng: number;
  destinationLat: number;
  destinationLng: number;
  destination: string;
}

const LiveMapTracker = ({ 
  workerName, 
  workerLat, 
  workerLng, 
  destinationLat, 
  destinationLng,
  destination 
}: LiveMapTrackerProps) => {
  const [currentLat, setCurrentLat] = useState(workerLat);
  const [currentLng, setCurrentLng] = useState(workerLng);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate worker movement towards destination every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      
      // Simulate movement towards destination
      const latDiff = destinationLat - currentLat;
      const lngDiff = destinationLng - currentLng;
      
      // Move 5-15% closer to destination
      const movePercent = 0.05 + Math.random() * 0.1;
      
      setCurrentLat(prev => prev + latDiff * movePercent);
      setCurrentLng(prev => prev + lngDiff * movePercent);
      setLastUpdate(new Date());
      
      setTimeout(() => setIsRefreshing(false), 1000);
    }, 20000);

    return () => clearInterval(interval);
  }, [currentLat, currentLng, destinationLat, destinationLng]);

  // Google Maps embed URL with markers
  const mapUrl = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${currentLat},${currentLng}&destination=${destinationLat},${destinationLng}&mode=driving`;

  // Fallback map URL (without API key)
  const fallbackMapUrl = `https://maps.google.com/maps?q=${currentLat},${currentLng}&z=14&output=embed`;

  const manualRefresh = () => {
    setIsRefreshing(true);
    const latDiff = destinationLat - currentLat;
    const lngDiff = destinationLng - currentLng;
    const movePercent = 0.05 + Math.random() * 0.1;
    
    setCurrentLat(prev => prev + latDiff * movePercent);
    setCurrentLng(prev => prev + lngDiff * movePercent);
    setLastUpdate(new Date());
    
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Navigation size={16} className="text-primary" />
            Live Location: {workerName}
          </h4>
          <p className="text-xs text-muted-foreground">
            Heading to {destination}
          </p>
        </div>
        <button
          onClick={manualRefresh}
          disabled={isRefreshing}
          className={`p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all ${
            isRefreshing ? 'animate-spin' : ''
          }`}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Map iframe */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden border border-border">
        <iframe
          src={fallbackMapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Live location of ${workerName}`}
        />
        
        {isRefreshing && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground">
              <RefreshCw size={16} className="animate-spin" />
              Updating location...
            </div>
          </div>
        )}
      </div>

      {/* Location info */}
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-success" />
          <span className="text-muted-foreground">
            {currentLat.toFixed(4)}, {currentLng.toFixed(4)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Updated: {lastUpdate.toLocaleTimeString()}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        🔄 Auto-refreshes every 20 seconds
      </p>
    </div>
  );
};

export default LiveMapTracker;
