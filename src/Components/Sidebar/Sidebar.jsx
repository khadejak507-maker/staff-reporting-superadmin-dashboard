/* eslint-disable react/prop-types */
import { FiLogOut } from "react-icons/fi";
import { GrNotes } from "react-icons/gr";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: <GrNotes className="h-5 w-5" />, label: "Daily Report", link: "/" },
];

const Sidebar = ({ onClose = () => {} }) => {
  const location = useLocation();
  const isActive = (link) => location.pathname === link;

  return (
    // Full-height, full-colour sidebar — fills the whole left column.
    <div className="h-full min-h-[calc(100vh-5rem)] flex flex-col justify-between bg-primary text-white py-6">
      <div className="flex flex-col gap-2 px-3">
        {menuItems.map((item) => (
          <Link key={item.label} to={item.link} onClick={onClose}>
            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-colors ${
                isActive(item.link)
                  ? "bg-white text-primary font-semibold shadow-md"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Log out pinned to the bottom */}
      <div className="px-3">
        <Link to="/sign-in" onClick={onClose}>
          <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
            <FiLogOut className="text-xl" />
            <span className="font-medium">Log out</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
