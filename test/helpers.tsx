import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { ToastProvider } from "../src/components/Toast";

export function renderWithProviders(ui: ReactNode) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}
