import { Link } from "@tanstack/react-router";
import { Button } from "../components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-lg text-muted-foreground">Page not found</p>
        <Button asChild className="mt-6">
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
