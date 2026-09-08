import { Link } from "react-router-dom";

interface RoleCardProps {
  number: string;
  title: string;
  description: string;
  to: string;
}

function RoleCard({
  number,
  title,
  description,
  to,
}: RoleCardProps) {
  return (
    <Link to={to} className="role-card">

      <span className="role-number">
        {number}
      </span>

      <div className="role-card-content">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <span className="role-arrow">
        →
      </span>

    </Link>
  );
}

export default RoleCard;