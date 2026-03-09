import { useAuth } from "../auth/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../components/ui/card";

export function HomePage() {
  const { user, accountId, role } = useAuth();

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.display_name ?? user?.email}</CardTitle>
          <CardDescription>
            Account: {accountId} &middot; Role: {role}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is the authenticated home page. Use the sidebar to navigate.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
