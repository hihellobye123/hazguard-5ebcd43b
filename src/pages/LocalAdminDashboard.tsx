import { useState } from "react";
import Navbar from "@/components/Navbar";
import AllotmentModal from "@/components/AllotmentModal";
import { useAuthStore } from "@/store/authStore";
import { Disaster } from "@/hooks/useDisasters";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

const LocalAdminDashboard = () => {
  const { allotments, updateAllotmentStatus } = useAuthStore();
  const [selectedAllotment, setSelectedAllotment] = useState<string | null>(null);

  const pendingForLocal = allotments.filter(a => a.status === 'pending_local');
  const submittedToMain = allotments.filter(a => a.status === 'pending_main');
  const approved = allotments.filter(a => a.status === 'approved');

  const handleAllot = (allotmentId: string) => {
    // Mark as pending main admin approval
    updateAllotmentStatus(allotmentId, 'pending_main');
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="pt-24 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-6">Local Admin Dashboard</h2>

        {/* Pending Allotments from Main Admin */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="text-warning" size={20} />
            Pending Allotments (Assigned by Main Admin)
          </h3>
          
          {pendingForLocal.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Clock size={40} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No pending allotments from Main Admin</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingForLocal.map((allotment) => (
                <div key={allotment.id} className="glass-card p-6 animate-fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">{allotment.disasterTitle}</h4>
                      <p className="text-sm text-muted-foreground">{allotment.location}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-warning/20 text-warning text-sm">
                      Action Required
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Pickup:</p>
                      <p className="font-medium text-foreground">{allotment.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Destination:</p>
                      <p className="font-medium text-foreground">{allotment.destinationLocation}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-muted-foreground text-sm mb-2">Workers:</p>
                    <div className="flex flex-wrap gap-2">
                      {allotment.workers.map((w) => (
                        <span key={w.phone} className="px-3 py-1 rounded-full bg-primary/20 text-sm text-foreground">
                          {w.name} • {w.phone}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 p-3 rounded-lg bg-muted/50">
                    <p className="text-muted-foreground text-sm mb-2">Products:</p>
                    {allotment.products.map((p, i) => (
                      <p key={i} className="text-foreground text-sm">
                        {p.name}: {p.quantity} units × ₹{p.pricePerUnit}/unit
                      </p>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-primary/20 mb-4">
                    <p className="text-xl font-bold text-primary">Total Cost: ₹{allotment.totalCost.toLocaleString()}</p>
                  </div>

                  <button
                    onClick={() => handleAllot(allotment.id)}
                    className="w-full py-3 rounded-xl glass-button text-primary-foreground font-semibold"
                  >
                    Confirm & Submit to Main Admin
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Submitted to Main Admin */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="text-primary" size={20} />
            Awaiting Main Admin Approval ({submittedToMain.length})
          </h3>
          
          {submittedToMain.length === 0 ? (
            <p className="text-muted-foreground text-sm">No pending submissions</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submittedToMain.map((allotment) => (
                <div key={allotment.id} className="glass-card p-4">
                  <h4 className="font-medium text-foreground">{allotment.disasterTitle}</h4>
                  <p className="text-sm text-muted-foreground">{allotment.workers.length} workers • ₹{allotment.totalCost.toLocaleString()}</p>
                  <span className="inline-block mt-2 px-2 py-1 rounded bg-warning/20 text-warning text-xs">
                    Pending Approval
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Approved */}
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="text-success" size={20} />
            Approved Allotments ({approved.length})
          </h3>
          
          {approved.length === 0 ? (
            <p className="text-muted-foreground text-sm">No approved allotments yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approved.map((allotment) => (
                <div key={allotment.id} className="glass-card p-4 border-success/30">
                  <h4 className="font-medium text-foreground">{allotment.disasterTitle}</h4>
                  <p className="text-sm text-muted-foreground">{allotment.workers.length} workers • ₹{allotment.totalCost.toLocaleString()}</p>
                  <span className="inline-block mt-2 px-2 py-1 rounded bg-success/20 text-success text-xs">
                    Approved ✓
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default LocalAdminDashboard;
