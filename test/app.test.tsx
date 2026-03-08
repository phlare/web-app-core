import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "../src/App";

describe("App", () => {
  it("renders the heading and API URL", () => {
    render(<App apiBaseUrl="http://localhost:4000" />);
    expect(screen.getByText("web-app-core")).toBeInTheDocument();
    expect(screen.getByText(/localhost:4000/)).toBeInTheDocument();
  });
});
