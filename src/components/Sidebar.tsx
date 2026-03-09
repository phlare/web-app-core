import { Link, useMatchRoute } from "@tanstack/react-router";
import { Home, Activity, X } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/health", label: "Health", icon: Activity }
] as const;

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const matchRoute = useMatchRoute();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <span className="text-lg font-semibold">App</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1 hover:bg-sidebar-accent md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = !!matchRoute({ to, fuzzy: to !== "/" });
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-sidebar-border p-4">
          <p className="truncate text-sm font-medium">
            {user?.display_name ?? user?.email ?? "User"}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start text-muted-foreground"
            onClick={() => void logout()}
          >
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
}
