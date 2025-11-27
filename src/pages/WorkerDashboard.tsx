import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/authStore";
import { Package, MapPin, Clock, CheckCircle } from "lucide-react";

const WorkerDashboard = () => {
  const { user, allotments } = useAuthStore();

  // Get allotments assigned to this worker
  const myAllotments = allotments.filter(a => 
    a.workers.some(w => w.name.toLowerCase() === user?.name.toLowerCase()) &&
    a.status === 'approved'
  );

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="pt-24 px-4 max-w-4xl mx-auto">
        <div className="glass-card p-6 mb-6 text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-primary mb-2">Welcome, {user?.name}!</h2>
          <p className="text-muted-foreground">Phone: {user?.phone}</p>
        </div>

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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkerDashboard;
