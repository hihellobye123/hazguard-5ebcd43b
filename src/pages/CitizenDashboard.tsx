import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/authStore";
import { MapPin, Phone, MessageCircle, Navigation, Users, AlertTriangle, Bell, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import ChatModal from "@/components/ChatModal";
import LiveMapTracker from "@/components/LiveMapTracker";

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// West Bengal destination coordinates (matching AllotmentModal locations)
const locationCoordinates: { [key: string]: { lat: number; lng: number } } = {
  "Kolkata Central": { lat: 22.5726, lng: 88.3639 },
  "Howrah Station": { lat: 22.5839, lng: 88.3422 },
  "Howrah": { lat: 22.5839, lng: 88.3422 },
  "Salt Lake": { lat: 22.5800, lng: 88.4200 },
  "Andul": { lat: 22.5600, lng: 88.1200 },
  "Andul Station": { lat: 22.5600, lng: 88.1200 },
  "Sealdah Station": { lat: 22.5645, lng: 88.3700 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Bandel Junction": { lat: 22.9300, lng: 88.3900 },
  "Hooghly": { lat: 22.9000, lng: 88.4000 },
  "Chinsurah Depot": { lat: 22.8700, lng: 88.3900 },
  "Chinsurah": { lat: 22.8700, lng: 88.3900 },
  "Diamond Harbour": { lat: 22.1900, lng: 88.1900 },
  "South 24 Parganas": { lat: 22.1600, lng: 88.4300 },
  "Durgapur": { lat: 23.5200, lng: 87.3100 },
  "Siliguri": { lat: 26.7271, lng: 88.3953 },
  "default": { lat: 22.5726, lng: 88.3639 },
};

interface TrackedWorker {
  name: string;
  phone: string;
  distance: number;
  lat: number;
  lng: number;
  destination: string;
  destinationLat: number;
  destinationLng: number;
  disasterTitle: string;
  status: 'en_route' | 'nearby' | 'arrived';
  allotmentId: string;
  journeyStarted: boolean;
}

const CitizenDashboard = () => {
  const { user, allotments, getCitizenNotifications, dismissCitizenNotification } = useAuthStore();
  const [trackedWorkers, setTrackedWorkers] = useState<TrackedWorker[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("Kolkata Central");
  const [searchRadius] = useState(5); // 5km radius
  const [chatWorker, setChatWorker] = useState<{ name: string; phone: string } | null>(null);
  const [expandedMap, setExpandedMap] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const notifications = getCitizenNotifications();

  // Get user's simulated coordinates
  const userCoords = locationCoordinates[selectedLocation] || locationCoordinates.default;

  // Filter notifications for nearby destinations (within 5km)
  const nearbyNotifications = notifications.filter(n => {
    const destCoords = locationCoordinates[n.destination] || locationCoordinates.default;
    const distance = calculateDistance(userCoords.lat, userCoords.lng, destCoords.lat, destCoords.lng);
    return distance <= searchRadius;
  });

  // Get approved allotments and simulate worker locations
  useEffect(() => {
    const updateWorkers = () => {
      const approvedAllotments = allotments.filter(a => a.status === 'approved');
      const workers: TrackedWorker[] = [];
      
      approvedAllotments.forEach(allotment => {
        const destCoords = locationCoordinates[allotment.destinationLocation] || locationCoordinates.default;
        
        allotment.workers.forEach(worker => {
          // Use stored worker location or simulate
          let workerLat = allotment.workerLat || destCoords.lat + (Math.random() - 0.5) * 0.1;
          let workerLng = allotment.workerLng || destCoords.lng + (Math.random() - 0.5) * 0.1;
          
          const distance = calculateDistance(userCoords.lat, userCoords.lng, workerLat, workerLng);
          
          if (distance <= searchRadius) {
            workers.push({
              name: worker.name,
              phone: worker.phone,
              distance: Math.round(distance * 10) / 10,
              lat: workerLat,
              lng: workerLng,
              destination: allotment.destinationLocation,
              destinationLat: destCoords.lat,
              destinationLng: destCoords.lng,
              disasterTitle: allotment.disasterTitle,
              status: distance < 1 ? 'arrived' : distance < 3 ? 'nearby' : 'en_route',
              allotmentId: allotment.id,
              journeyStarted: allotment.journeyStarted || false,
            });
          }
        });
      });

      workers.sort((a, b) => a.distance - b.distance);
      setTrackedWorkers(workers);
      setLastRefresh(new Date());
    };

    updateWorkers();
    const interval = setInterval(updateWorkers, 20000); // Refresh every 20 seconds
    return () => clearInterval(interval);
  }, [allotments, selectedLocation, searchRadius, userCoords.lat, userCoords.lng]);

  const handleCall = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`;
    toast.success(`Calling ${name}...`);
  };

  const openChat = (name: string, phone: string) => {
    setChatWorker({ name, phone });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arrived': return 'bg-success/20 text-success';
      case 'nearby': return 'bg-warning/20 text-warning';
      default: return 'bg-primary/20 text-primary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'arrived': return 'Arrived';
      case 'nearby': return 'Nearby';
      default: return 'En Route';
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="pt-24 px-4 max-w-4xl mx-auto">
        <div className="glass-card p-6 mb-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-primary mb-2">Citizen Dashboard</h2>
          <p className="text-muted-foreground">Track relief workers in your area (5km radius)</p>
        </div>

        {/* Help Coming Notifications */}
        {nearbyNotifications.length > 0 && (
          <div className="mb-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Bell className="text-warning animate-pulse" size={20} />
              Help is Coming! ({nearbyNotifications.length})
            </h3>
            <div className="space-y-3">
              {nearbyNotifications.map(notification => (
                <div 
                  key={notification.id}
                  className="relative glass-card p-4 border-2 border-success/50 bg-success/10"
                >
                  <button
                    onClick={() => dismissCitizenNotification(notification.id)}
                    className="absolute top-2 right-2 p-1 rounded hover:bg-muted"
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <Bell className="text-success" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{notification.message}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Destination: {notification.destination}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Selector */}
        <div className="glass-card p-4 mb-6 animate-fade-in">
          <label className="block text-sm font-medium text-foreground mb-2">
            <MapPin size={16} className="inline mr-2" />
            Your Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full h-12 px-4 rounded-lg bg-muted/50 border border-border text-foreground"
          >
            {Object.keys(locationCoordinates).filter(l => l !== 'default').map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              Showing workers within {searchRadius}km radius
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <RefreshCw size={12} />
              Updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Workers List */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users size={20} className="text-primary" />
            Relief Workers Nearby
          </h3>
          <span className="text-sm text-muted-foreground">
            {trackedWorkers.length} found
          </span>
        </div>

        {trackedWorkers.length === 0 ? (
          <div className="glass-card p-12 text-center animate-fade-in">
            <AlertTriangle size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Workers Nearby</h4>
            <p className="text-muted-foreground">
              No relief workers are currently within {searchRadius}km of your location.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {trackedWorkers.map((worker, index) => (
              <div 
                key={`${worker.phone}-${index}`} 
                className="glass-card p-5 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">{worker.name}</h4>
                    <p className="text-sm text-muted-foreground">{worker.disasterTitle}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(worker.status)}`}>
                    {getStatusText(worker.status)}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Navigation size={14} className="text-primary" />
                    <span className="text-foreground font-medium">{worker.distance} km away</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-destructive" />
                    <span className="text-muted-foreground">→ {worker.destination}</span>
                  </div>
                </div>

                {/* Live Map Toggle */}
                {worker.journeyStarted && (
                  <div className="mb-4">
                    <button
                      onClick={() => setExpandedMap(expandedMap === worker.allotmentId ? null : worker.allotmentId)}
                      className="w-full py-2 rounded-lg bg-muted/50 text-foreground text-sm flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                    >
                      <MapPin size={16} />
                      {expandedMap === worker.allotmentId ? 'Hide Live Map' : 'View Live Location'}
                    </button>
                    
                    {expandedMap === worker.allotmentId && (
                      <div className="mt-3">
                        <LiveMapTracker
                          workerName={worker.name}
                          workerLat={worker.lat}
                          workerLng={worker.lng}
                          destinationLat={worker.destinationLat}
                          destinationLng={worker.destinationLng}
                          destination={worker.destination}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Distance Progress Bar */}
                <div className="mb-4">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all"
                      style={{ width: `${Math.max(10, 100 - (worker.distance / searchRadius) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCall(worker.phone, worker.name)}
                    className="flex-1 py-3 rounded-xl bg-success/20 text-success font-medium flex items-center justify-center gap-2 hover:bg-success/30 transition-colors"
                  >
                    <Phone size={18} />
                    Call
                  </button>
                  <button
                    onClick={() => openChat(worker.name, worker.phone)}
                    className="flex-1 py-3 rounded-xl bg-primary/20 text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/30 transition-colors"
                  >
                    <MessageCircle size={18} />
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Information */}
        <div className="mt-8 glass-card p-6 animate-fade-in">
          <h4 className="text-lg font-semibold text-foreground mb-3">Need Help?</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Workers shown are part of active disaster relief operations</p>
            <p>• Live maps refresh every 20 seconds when journey is active</p>
            <p>• You can call or chat with workers directly</p>
            <p>• You'll receive notifications when help is dispatched to your area</p>
          </div>
        </div>
      </main>

      {/* Chat Modal */}
      {chatWorker && (
        <ChatModal
          workerName={chatWorker.name}
          workerPhone={chatWorker.phone}
          onClose={() => setChatWorker(null)}
        />
      )}
    </div>
  );
};

export default CitizenDashboard;
