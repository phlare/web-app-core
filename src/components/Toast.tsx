import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { ToastContext } from "./ToastContext";

interface Toast {
  id: string;
  type: "success" | "error";
  message: string;
}

const AUTO_DISMISS_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, AUTO_DISMISS_MS);
  }, []);

  const success = useCallback(
    (message: string) => addToast("success", message),
    [addToast]
  );
  const error = useCallback(
    (message: string) => addToast("error", message),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`rounded px-4 py-3 text-sm text-white shadow-lg ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
