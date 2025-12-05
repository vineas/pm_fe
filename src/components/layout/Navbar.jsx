import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // tutup sidebar ketika route berubah
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-100 text-blue-600 font-semibold"
      : "text-gray-600 hover:bg-gray-100";

  return (
    <>
      {/* HAMBURGER BUTTON (mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-sm focus:outline-none"
        onClick={() => setOpen((s) => !s)}
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
      >
        {/* Hamburger / Close icon */}
        {!open ? (
          // hamburger
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ) : (
          // close
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>

      {/* OVERLAY (mobile) */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          } md:hidden`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* SIDEBAR */}
      <aside
        className={`
    fixed z-50 top-0 left-0 h-screen w-64 bg-white shadow-md transform transition-transform duration-200
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0`}
      >
        <div className="p-6 text-xl font-bold border-b flex items-center justify-between">
          <span>PM Tools</span>
          {/* optional: close icon on md:hidden */}
          <button
            className="md:hidden p-1 rounded focus:outline-none"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-2">
          <Link
            to="/"
            className={`px-4 py-3 rounded-lg transition ${isActive("/")}`}
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>

          <Link
            to="/projects"
            className={`px-4 py-3 rounded-lg transition ${isActive("/projects")}`}
            onClick={() => setOpen(false)}
          >
            Projects
          </Link>
        </nav>
      </aside>
    </>
  );
};


export default Navbar;
