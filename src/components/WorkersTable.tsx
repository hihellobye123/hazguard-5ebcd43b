import { workers } from "@/data/workers";
import { Phone, User } from "lucide-react";

const WorkersTable = () => {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <User className="text-primary" size={24} />
        Registered Workers ({workers.length})
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">#</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Phone Number</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker, index) => (
              <tr 
                key={worker.phone} 
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 px-4 text-sm text-muted-foreground">{index + 1}</td>
                <td className="py-3 px-4">
                  <span className="font-medium text-foreground">{worker.name}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-muted-foreground font-mono">{worker.phone}</span>
                </td>
                <td className="py-3 px-4">
                  <a 
                    href={`tel:${worker.phone}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-success/20 text-success text-sm hover:bg-success/30 transition-colors"
                  >
                    <Phone size={14} />
                    Call
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkersTable;
