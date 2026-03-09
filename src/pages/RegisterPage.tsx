import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../auth/useAuth";
import { ApiError } from "../lib/api-error";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../components/ui/card";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register({
        email,
        password,
        ...(displayName && { display_name: displayName }),
        ...(accountName && { account_name: accountName })
      });
      await navigate({ to: "/" });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create account</CardTitle>
          <CardDescription>Get started with a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="display-name" className="text-sm font-medium">
                Display name{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>
              <Input
                id="display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="account-name" className="text-sm font-medium">
                Account name{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>
              <Input
                id="account-name"
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
