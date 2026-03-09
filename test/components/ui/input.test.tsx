import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "../../../src/components/ui/input";

describe("Input", () => {
  it("renders with the correct type", () => {
    render(<Input type="email" aria-label="Email" />);
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "type",
      "email"
    );
  });
});
