import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-gray-900";

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex gap-8">
        <Link to="/" className={`py-4 ${isActive("/")}`}>
          Dashboard
        </Link>
        <Link to="/projects" className={`py-4 ${isActive("/projects")}`}>
          Projects
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
