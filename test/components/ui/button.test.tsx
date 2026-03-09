import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../../../src/components/ui/button";

describe("Button", () => {
  it("renders with default variant", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole("button", { name: "Outline" });
    expect(button.className).toContain("border");
  });
});
