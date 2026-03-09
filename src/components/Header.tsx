import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-14 items-center border-b border-border px-4 md:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-sm p-1.5 hover:bg-accent md:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>
    </header>
  );
}
