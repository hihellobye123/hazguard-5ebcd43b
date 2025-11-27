import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/authStore";
import { MapPin, Phone, MessageCircle, Navigation, Users, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// Simulated worker locations (in production, this would come from GPS tracking)
const generateWorkerLocation = (destinationLat: number, destinationLng: number, radius: number) => {
  // Generate random point within radius (in km)
  const r = radius * Math.sqrt(Math.random());
  const theta = Math.random() * 2 * Math.PI;
  const lat = destinationLat + (r / 111) * Math.cos(theta);
  const lng = destinationLng + (r / (111 * Math.cos(destinationLat * Math.PI / 180))) * Math.sin(theta);
  return { lat, lng };
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// West Bengal destination coordinates (simplified)
const locationCoordinates: { [key: string]: { lat: number; lng: number } } = {
  "Kolkata Central": { lat: 22.5726, lng: 88.3639 },
  "Howrah Station": { lat: 22.5839, lng: 88.3422 },
  "Salt Lake": { lat: 22.5800, lng: 88.4200 },
  "Andul": { lat: 22.5600, lng: 88.1200 },
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
  disasterTitle: string;
  status: 'en_route' | 'nearby' | 'arrived';
}

const CitizenDashboard = () => {
  const { user, allotments } = useAuthStore();
  const [trackedWorkers, setTrackedWorkers] = useState<TrackedWorker[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("Kolkata Central");
  const [searchRadius] = useState(10); // 10km radius

  // Get approved allotments and simulate worker locations
  useEffect(() => {
    const approvedAllotments = allotments.filter(a => a.status === 'approved');
    
    const workers: TrackedWorker[] = [];
    
    approvedAllotments.forEach(allotment => {
      const destCoords = locationCoordinates[allotment.destinationLocation] || locationCoordinates.default;
      const userCoords = locationCoordinates[selectedLocation] || locationCoordinates.default;
      
      allotment.workers.forEach(worker => {
        // Simulate worker position (random position around destination, within 15km)
        const workerPos = generateWorkerLocation(destCoords.lat, destCoords.lng, 15);
        const distance = calculateDistance(userCoords.lat, userCoords.lng, workerPos.lat, workerPos.lng);
        
        if (distance <= searchRadius) {
          workers.push({
            name: worker.name,
            phone: worker.phone,
            distance: Math.round(distance * 10) / 10,
            lat: workerPos.lat,
            lng: workerPos.lng,
            destination: allotment.destinationLocation,
            disasterTitle: allotment.disasterTitle,
            status: distance < 1 ? 'arrived' : distance < 5 ? 'nearby' : 'en_route',
          });
        }
      });
    });

    // Sort by distance
    workers.sort((a, b) => a.distance - b.distance);
    setTrackedWorkers(workers);
  }, [allotments, selectedLocation, searchRadius]);

  const handleCall = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`;
    toast.success(`Calling ${name}...`);
  };

  const handleMessage = (phone: string, name: string) => {
    window.location.href = `sms:${phone}`;
    toast.success(`Opening message to ${name}...`);
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
          <p className="text-muted-foreground">Track relief workers in your area</p>
        </div>

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
          <p className="text-xs text-muted-foreground mt-2">
            Showing workers within {searchRadius}km radius
          </p>
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
            <p className="text-sm text-muted-foreground mt-2">
              Try selecting a different location or check back later.
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
                    onClick={() => handleMessage(worker.phone, worker.name)}
                    className="flex-1 py-3 rounded-xl bg-primary/20 text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/30 transition-colors"
                  >
                    <MessageCircle size={18} />
                    Message
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
            <p>• Distance is calculated from your selected location</p>
            <p>• You can directly call or message workers for assistance</p>
            <p>• Location updates automatically every few minutes</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CitizenDashboard;
