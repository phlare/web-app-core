import { describe, expect, it } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ToastProvider } from "../../src/components/Toast";
import { useToast } from "../../src/components/useToast";

function ToastTrigger() {
  const toast = useToast();
  return (
    <button onClick={() => toast.error("Something failed")}>
      Trigger Error
    </button>
  );
}

describe("Toast", () => {
  it("renders an error toast when triggered", async () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );

    await act(async () => {
      screen.getByText("Trigger Error").click();
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Something failed");
  });
});
