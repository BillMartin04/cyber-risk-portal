import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: Props) {
  return (
    <div className="breadcrumb">
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {i > 0 && <span className="breadcrumb-sep">›</span>}
          {item.to
            ? <Link to={item.to} className="breadcrumb-item">{item.label}</Link>
            : <span className="breadcrumb-current">{item.label}</span>
          }
        </span>
      ))}
    </div>
  );
}
