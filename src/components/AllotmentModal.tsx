import { useState } from "react";
import { Disaster } from "@/hooks/useDisasters";
import { workers } from "@/data/workers";
import { useAuthStore } from "@/store/authStore";
import { X, Plus, Trash2, Check, CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";

interface AllotmentModalProps {
  disaster: Disaster;
  onClose: () => void;
}

interface Product {
  name: string;
  quantity: number;
  pricePerUnit: number;
}

const locationOptions = [
  { name: 'Andul Station', area: 'Andul' },
  { name: 'Howrah Station', area: 'Howrah' },
  { name: 'Sealdah Station', area: 'Kolkata' },
  { name: 'Bandel Junction', area: 'Hooghly' },
  { name: 'Chinsurah Depot', area: 'Chinsurah' },
  { name: 'Diamond Harbour', area: 'South 24 Parganas' },
];

const AllotmentModal = ({ disaster, onClose }: AllotmentModalProps) => {
  const { user, addAllotment, addCitizenNotification } = useAuthStore();
  const [selectedWorkers, setSelectedWorkers] = useState<typeof workers>([]);
  const [pickupLocation, setPickupLocation] = useState(locationOptions[0].name);
  const [destinationLocation, setDestinationLocation] = useState(disaster.location);
  const [products, setProducts] = useState<Product[]>([
    { name: 'Relief Kit', quantity: 10, pricePerUnit: 500 }
  ]);
  const [frequency, setFrequency] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const toggleWorker = (worker: typeof workers[0]) => {
    setSelectedWorkers(prev => 
      prev.find(w => w.phone === worker.phone)
        ? prev.filter(w => w.phone !== worker.phone)
        : [...prev, worker]
    );
  };

  const addProduct = () => {
    setProducts([...products, { name: '', quantity: 1, pricePerUnit: 0 }]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof Product, value: string | number) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const totalCost = products.reduce((sum, p) => sum + (p.quantity * p.pricePerUnit), 0) * frequency;

  const handleSubmit = () => {
    if (selectedWorkers.length === 0) {
      toast.error('Please select at least one worker');
      return;
    }
    if (products.some(p => !p.name || p.quantity <= 0)) {
      toast.error('Please fill all product details');
      return;
    }

    const allotmentId = crypto.randomUUID();

    // Admin creates = directly approved, Local admin = needs main admin approval
    const status = user?.role === 'admin' ? 'approved' : 'pending_main';

    addAllotment({
      disasterId: disaster.id,
      disasterTitle: disaster.title,
      location: disaster.location,
      workers: selectedWorkers.map(w => ({ name: w.name, phone: w.phone })),
      pickupLocation,
      destinationLocation,
      products,
      totalCost,
      status,
      createdBy: user?.name || 'Unknown'
    });

    // Add citizen notification for nearby citizens (5km radius)
    addCitizenNotification({
      message: `🚨 Help is on the way! ${selectedWorkers.length} relief worker(s) have been dispatched for ${disaster.title}`,
      destination: destinationLocation,
      allotmentId: allotmentId
    });

    setSubmitted(true);
    toast.success('Allotment submitted successfully!');
    
    // Show success card for 3 seconds then close
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  // Success Screen
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div className="glass-card w-full max-w-md p-8 text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle2 size={48} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Allotment Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            {selectedWorkers.length} worker(s) have been notified for this relief operation.
          </p>
          
          <div className="p-4 rounded-xl bg-muted/50 mb-4">
            <p className="text-sm font-medium text-foreground mb-2">Workers Notified:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedWorkers.map(w => (
                <span key={w.phone} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                  {w.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-success">
            <Send size={16} />
            <span className="text-sm">Notifications sent to all selected workers</span>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Citizens within 5km radius of {destinationLocation} will also be notified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Allot Help</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Disaster Info */}
        <div className="p-4 rounded-xl bg-muted/50 mb-6">
          <h3 className="font-semibold text-foreground">{disaster.title}</h3>
          <p className="text-sm text-muted-foreground">{disaster.location} • {disaster.affectedArea}</p>
        </div>

        {/* Worker Selection */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-foreground">Select Workers ({selectedWorkers.length} selected)</h3>
          <div className="max-h-48 overflow-y-auto space-y-2 p-2 rounded-xl bg-muted/30">
            {workers.map((worker) => (
              <div
                key={worker.phone}
                onClick={() => toggleWorker(worker)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                  selectedWorkers.find(w => w.phone === worker.phone)
                    ? 'bg-primary/20 border border-primary'
                    : 'bg-muted/50 hover:bg-muted'
                }`}
              >
                <div>
                  <p className="font-medium text-foreground">{worker.name}</p>
                  <p className="text-sm text-muted-foreground">{worker.phone}</p>
                </div>
                {selectedWorkers.find(w => w.phone === worker.phone) && (
                  <Check size={20} className="text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Pickup Location</label>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full p-3 rounded-lg glass-input text-foreground"
            >
              {locationOptions.map(loc => (
                <option key={loc.name} value={loc.name} className="bg-card text-foreground">
                  {loc.name} ({loc.area})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Destination Location</label>
            <input
              type="text"
              value={destinationLocation}
              onChange={(e) => setDestinationLocation(e.target.value)}
              className="w-full p-3 rounded-lg glass-input text-foreground"
            />
          </div>
        </div>

        {/* Products */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Products / Supplies</h3>
            <button onClick={addProduct} className="flex items-center gap-1 text-primary hover:text-primary/80">
              <Plus size={16} /> Add Item
            </button>
          </div>
          <div className="space-y-3">
            {products.map((product, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <input
                  type="text"
                  placeholder="Item name"
                  value={product.name}
                  onChange={(e) => updateProduct(index, 'name', e.target.value)}
                  className="flex-1 p-2 rounded-lg glass-input text-foreground"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={product.quantity}
                  onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-20 p-2 rounded-lg glass-input text-foreground"
                />
                <input
                  type="number"
                  placeholder="Price/unit"
                  value={product.pricePerUnit}
                  onChange={(e) => updateProduct(index, 'pricePerUnit', parseInt(e.target.value) || 0)}
                  className="w-28 p-2 rounded-lg glass-input text-foreground"
                />
                <button onClick={() => removeProduct(index)} className="p-2 text-destructive hover:bg-destructive/20 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-foreground">Delivery Frequency (trips)</label>
          <input
            type="number"
            value={frequency}
            onChange={(e) => setFrequency(parseInt(e.target.value) || 1)}
            min={1}
            className="w-32 p-3 rounded-lg glass-input text-foreground"
          />
        </div>

        {/* Total Cost */}
        <div className="p-4 rounded-xl bg-primary/20 border border-primary/30 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-foreground">Total Estimated Cost:</span>
            <span className="text-2xl font-bold text-primary">₹{totalCost.toLocaleString()}</span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl glass-button text-primary-foreground font-semibold text-lg"
        >
          Submit Allotment
        </button>
      </div>
    </div>
  );
};

export default AllotmentModal;
