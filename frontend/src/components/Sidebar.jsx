import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Projects", href: "#projects" },
  { label: "Tasks", href: "#tasks" },
  { label: "Settings", href: "#settings" },
];

export const Sidebar = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  const navigate = useNavigate();
  async function handleLogout() {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if(!confirmed){return};

     
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      navigate("/login");
    } catch (error) {
      console.log("Error during logout:", error);
    }
  }

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <aside className="flex min-h-[calc(100vh-48px)] w-60 shrink-0 flex-col bg-slate-900 p-4 text-white">
      <p className="mb-6 px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
        Workspace
      </p>
      <nav aria-label="Main navigation" className="flex flex-col gap-2">
        {navigationItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-current={currentHash === item.href ? "page" : undefined}
            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              currentHash === item.href
                ? "bg-violet-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="mt-auto rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        onClick={handleLogout}
      >
        Logout
      </button>
    </aside>
  );
};
