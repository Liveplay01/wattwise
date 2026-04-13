interface MetricRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export default function MetricRow({ label, value, highlight = false }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "text-primary font-medium" : "text-foreground font-medium"}>
        {value}
      </span>
    </div>
  );
}
