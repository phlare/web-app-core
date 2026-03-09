import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { toast } from "sonner";
import { act } from "@testing-library/react";
import { Toaster } from "../../src/components/ui/sonner";

describe("Toaster (sonner)", () => {
  it("renders a toast when triggered", async () => {
    render(<Toaster />);

    await act(async () => {
      toast.error("Something failed");
    });

    expect(await screen.findByText("Something failed")).toBeInTheDocument();
  });
});
