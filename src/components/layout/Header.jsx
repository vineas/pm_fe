/* ===========================
   Header Component
   =========================== */

export default function Header({ currentUser }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900">
            PM-Tools Permata Maju Bersama
          </h1>

          {/* User Info */}
          {currentUser && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{currentUser.name}</span>

              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                {currentUser?.role?.replace("_", " ").toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
