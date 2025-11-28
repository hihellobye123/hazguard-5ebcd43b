import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/authStore";
import { Package, MapPin, Clock, CheckCircle, Bell, X, Play, Navigation } from "lucide-react";
import { toast } from "sonner";

const WorkerDashboard = () => {
  const { user, allotments, startJourney } = useAuthStore();
  const [viewedAllotments, setViewedAllotments] = useState<string[]>(() => {
    const stored = localStorage.getItem(`viewed_${user?.phone}`);
    return stored ? JSON.parse(stored) : [];
  });
  const [startedJourneys, setStartedJourneys] = useState<string[]>(() => {
    const stored = localStorage.getItem(`journeys_${user?.phone}`);
    return stored ? JSON.parse(stored) : [];
  });

  // Get allotments assigned to this worker
  const myAllotments = allotments.filter(a => 
    a.workers.some(w => w.name.toLowerCase() === user?.name.toLowerCase()) &&
    a.status === 'approved'
  );

  // New notifications (not yet viewed)
  const newNotifications = myAllotments.filter(a => !viewedAllotments.includes(a.id));

  const dismissNotification = (id: string) => {
    const updated = [...viewedAllotments, id];
    setViewedAllotments(updated);
    localStorage.setItem(`viewed_${user?.phone}`, JSON.stringify(updated));
  };

  const dismissAll = () => {
    const allIds = myAllotments.map(a => a.id);
    setViewedAllotments(allIds);
    localStorage.setItem(`viewed_${user?.phone}`, JSON.stringify(allIds));
  };

  const handleStartJourney = (allotmentId: string) => {
    // Get user's location (simulated)
    const lat = 22.5726 + (Math.random() - 0.5) * 0.1;
    const lng = 88.3639 + (Math.random() - 0.5) * 0.1;
    
    startJourney(allotmentId, lat, lng);
    
    const updated = [...startedJourneys, allotmentId];
    setStartedJourneys(updated);
    localStorage.setItem(`journeys_${user?.phone}`, JSON.stringify(updated));
    
    toast.success('Journey started! Citizens can now track your location.');
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="pt-24 px-4 max-w-4xl mx-auto">
        <div className="glass-card p-6 mb-6 text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-primary mb-2">Welcome, {user?.name}!</h2>
          <p className="text-muted-foreground">Phone: {user?.phone}</p>
        </div>

        {/* New Assignment Notifications */}
        {newNotifications.length > 0 && (
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Bell className="text-warning animate-pulse" size={20} />
                New Assignments ({newNotifications.length})
              </h3>
              <button 
                onClick={dismissAll}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Mark all as read
              </button>
            </div>
            
            <div className="space-y-3">
              {newNotifications.map((allotment) => (
                <div 
                  key={allotment.id} 
                  className="relative glass-card p-5 border-2 border-warning/50 animate-pulse-glow"
                >
                  <button 
                    onClick={() => dismissNotification(allotment.id)}
                    className="absolute top-3 right-3 p-1 rounded hover:bg-muted"
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>

                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                      <Bell className="text-warning" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-warning font-medium mb-1">🚨 NEW ASSIGNMENT</p>
                      <h4 className="text-lg font-semibold text-foreground">{allotment.disasterTitle}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        You have been assigned to a disaster relief task
                      </p>
                      
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={14} className="text-success" />
                          <span className="text-muted-foreground">Pickup:</span>
                          <span className="font-medium text-foreground">{allotment.pickupLocation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={14} className="text-destructive" />
                          <span className="text-muted-foreground">Deliver to:</span>
                          <span className="font-medium text-foreground">{allotment.destinationLocation}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {allotment.products.map((p, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-primary/20 text-primary text-xs">
                            {p.name} × {p.quantity}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-muted-foreground mt-3">
                        Assigned: {new Date(allotment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h3 className="text-xl font-semibold text-foreground mb-4">Your Assigned Tasks</h3>

        {myAllotments.length === 0 ? (
          <div className="glass-card p-12 text-center animate-fade-in">
            <Package size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Tasks Assigned</h4>
            <p className="text-muted-foreground">You don't have any active assignments at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myAllotments.map((allotment) => (
              <div key={allotment.id} className="glass-card p-6 animate-fade-in">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">{allotment.disasterTitle}</h4>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/20 text-success text-xs">
                      <CheckCircle size={12} /> Approved
                    </span>
                  </div>
                  {!viewedAllotments.includes(allotment.id) && (
                    <span className="px-2 py-1 rounded-full bg-warning text-warning-foreground text-xs font-medium">
                      NEW
                    </span>
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <span className="text-muted-foreground">Pickup:</span>
                    <span className="font-medium text-foreground">{allotment.pickupLocation}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-destructive" />
                    <span className="text-muted-foreground">Destination:</span>
                    <span className="font-medium text-foreground">{allotment.destinationLocation}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-warning" />
                    <span className="text-muted-foreground">Assigned:</span>
                    <span className="font-medium text-foreground">
                      {new Date(allotment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium text-foreground mb-2">Items to Deliver:</p>
                  {allotment.products.map((p, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      • {p.name}: {p.quantity} units
                    </p>
                  ))}
                </div>

                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Team Members:</p>
                  <div className="flex flex-wrap gap-2">
                    {allotment.workers.map((w) => (
                      <span
                        key={w.phone}
                        className={`px-3 py-1 rounded-full text-xs ${
                          w.name.toLowerCase() === user?.name.toLowerCase()
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {w.name} {w.name.toLowerCase() === user?.name.toLowerCase() && '(You)'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Start Journey Button */}
                <div className="mt-4">
                  {startedJourneys.includes(allotment.id) || allotment.journeyStarted ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-success/20 text-success">
                      <Navigation size={18} className="animate-pulse" />
                      <span className="font-medium">Journey Active - Citizens can track you</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartJourney(allotment.id)}
                      className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                      <Play size={18} />
                      Start Journey
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkerDashboard;
