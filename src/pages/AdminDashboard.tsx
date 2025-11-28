import { useState } from "react";
import Navbar from "@/components/Navbar";
import DisasterCard from "@/components/DisasterCard";
import AllotmentModal from "@/components/AllotmentModal";
import WorkersTable from "@/components/WorkersTable";
import { useDisasters, Disaster } from "@/hooks/useDisasters";
import { useAuthStore } from "@/store/authStore";
import { RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle, Users } from "lucide-react";

const AdminDashboard = () => {
  const { disasters, loading, lastUpdated, refetch } = useDisasters(300000);
  const { allotments, updateAllotmentStatus } = useAuthStore();
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [activeTab, setActiveTab] = useState<'disasters' | 'allotments' | 'workers'>('disasters');

  const pendingAllotments = allotments.filter(a => a.status === 'pending_main');

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="pt-24 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Main Admin Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock size={14} />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <button
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('disasters')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'disasters' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Live Disasters
          </button>
          <button
            onClick={() => setActiveTab('allotments')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'allotments' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Pending Approvals
            {pendingAllotments.length > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                {pendingAllotments.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'workers' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Users size={16} />
            Workers List
          </button>
        </div>

        {activeTab === 'disasters' && (
          <>
            {loading ? (
              <div className="text-center py-20">
                <RefreshCw size={48} className="mx-auto animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Fetching live disaster data...</p>
              </div>
            ) : disasters.length === 0 ? (
              <div className="text-center py-20 glass-card">
                <AlertTriangle size={48} className="mx-auto text-success mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Active Disasters</h3>
                <p className="text-muted-foreground">There are no natural disasters currently reported in West Bengal.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {disasters.map((disaster) => (
                  <DisasterCard
                    key={disaster.id}
                    disaster={disaster}
                    onAllotHelp={() => setSelectedDisaster(disaster)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'allotments' && (
          <div className="space-y-4">
            {pendingAllotments.length === 0 ? (
              <div className="text-center py-20 glass-card">
                <CheckCircle size={48} className="mx-auto text-success mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">No pending allotments waiting for approval.</p>
              </div>
            ) : (
              pendingAllotments.map((allotment) => (
                <div key={allotment.id} className="glass-card p-6 animate-fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{allotment.disasterTitle}</h3>
                      <p className="text-sm text-muted-foreground">Created by: {allotment.createdBy}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-warning/20 text-warning text-sm font-medium">
                      Pending Approval
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
                    <p className="text-muted-foreground text-sm mb-2">Workers Assigned:</p>
                    <div className="flex flex-wrap gap-2">
                      {allotment.workers.map((w) => (
                        <span key={w.phone} className="px-3 py-1 rounded-full bg-muted text-sm text-foreground">
                          {w.name} ({w.phone})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-muted-foreground text-sm mb-2">Products:</p>
                    <div className="space-y-1">
                      {allotment.products.map((p, i) => (
                        <p key={i} className="text-sm text-foreground">
                          {p.name}: {p.quantity} × ₹{p.pricePerUnit} = ₹{p.quantity * p.pricePerUnit}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-primary/20 mb-4">
                    <p className="text-lg font-bold text-primary">Total: ₹{allotment.totalCost.toLocaleString()}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => updateAllotmentStatus(allotment.id, 'approved')}
                      className="flex-1 py-2 rounded-lg bg-success text-success-foreground font-semibold flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} /> Approve
                    </button>
                    <button
                      onClick={() => updateAllotmentStatus(allotment.id, 'rejected')}
                      className="flex-1 py-2 rounded-lg bg-destructive text-destructive-foreground font-semibold flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'workers' && <WorkersTable />}
      </main>

      {selectedDisaster && (
        <AllotmentModal
          disaster={selectedDisaster}
          onClose={() => setSelectedDisaster(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
