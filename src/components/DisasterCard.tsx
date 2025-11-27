import { Disaster } from "@/hooks/useDisasters";
import { MapPin, Clock, AlertTriangle } from "lucide-react";

interface DisasterCardProps {
  disaster: Disaster;
  onAllotHelp?: () => void;
  showAllotButton?: boolean;
}

const severityColors = {
  low: 'bg-success/20 text-success border-success/30',
  medium: 'bg-warning/20 text-warning border-warning/30',
  high: 'bg-destructive/20 text-destructive border-destructive/30',
  critical: 'bg-destructive text-destructive-foreground border-destructive'
};

const typeIcons: Record<string, string> = {
  'Flood': '🌊',
  'Cyclone': '🌀',
  'Landslide': '⛰️',
  'Thunderstorm': '⛈️',
  'Heatwave': '🌡️',
  'Earthquake': '🌍'
};

const DisasterCard = ({ disaster, onAllotHelp, showAllotButton = true }: DisasterCardProps) => {
  const timeAgo = new Date(disaster.date).toLocaleString();

  return (
    <div className="disaster-card animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{typeIcons[disaster.type] || '⚠️'}</span>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{disaster.title}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${severityColors[disaster.severity]}`}>
              <AlertTriangle size={12} className="mr-1" />
              {disaster.severity.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="status-live" title="Live" />
      </div>

      <p className="text-muted-foreground text-sm mb-4">{disaster.description}</p>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={14} className="text-primary" />
          <span>{disaster.location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-primary">📍</span>
          <span>Affected: {disaster.affectedArea}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={14} className="text-primary" />
          <span>{timeAgo}</span>
        </div>
      </div>

      {showAllotButton && (
        <button
          onClick={onAllotHelp}
          className="mt-4 w-full py-2.5 rounded-lg glass-button text-primary-foreground font-semibold transition-all hover:scale-[1.02]"
        >
          Allot Help
        </button>
      )}
    </div>
  );
};

export default DisasterCard;
