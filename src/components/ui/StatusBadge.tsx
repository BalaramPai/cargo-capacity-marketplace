interface StatusBadgeProps {
  status: string;
  tone?: "blue" | "green" | "amber" | "red" | "slate";
}

export default function StatusBadge({ status, tone = "blue" }: StatusBadgeProps) {
  return <span className={`status-badge status-badge-${tone}`}>{status}</span>;
}
