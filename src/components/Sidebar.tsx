import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Settings,
  Plus,
  Download,
  ExternalLink,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/settings", icon: Settings, label: "Settings" },
    { path: "/create-proxies", icon: Plus, label: "Create" },
    { path: "/download-proxies", icon: Download, label: "Download" },
    { path: "/custom-proxies", icon: ExternalLink, label: "Custom" },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <button onClick={onToggle} className="toggle-btn">
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        {!collapsed && <h2 className="app-title">MTG Proxies</h2>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <item.icon size={20} />
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
