interface StatCardProps {
  label: string;
  value: string | number;
  accent?: "blue" | "green" | "orange" | "purple";
}

export default function StatCard({ label, value, accent = "blue" }: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${accent}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
