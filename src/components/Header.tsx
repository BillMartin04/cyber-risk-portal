import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { PORTAL_DATE } from '../data';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-logo" onClick={() => navigate('/')}>
        <div className="header-logo-icon">
          <ShieldCheck size={18} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <div className="header-logo-text">Lumina</div>
          <div className="header-logo-sub">CyberLens for GRC</div>
        </div>
      </div>

      <div className="header-spacer" />

      <div className="header-badge">
        <div className="status-dot" />
        Live
      </div>

      <div className="header-date">{PORTAL_DATE}</div>

      <div className="header-user">
        <div className="header-avatar">SB</div>
      </div>
    </header>
  );
}
