import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithRouter } from "../helpers";
import { NotFoundPage } from "../../src/pages/NotFoundPage";

describe("NotFoundPage", () => {
  it("renders 404 message with a link home", async () => {
    renderWithRouter(<NotFoundPage />);

    await waitFor(() => {
      expect(screen.getByText("404")).toBeInTheDocument();
      expect(screen.getByText("Page not found")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute(
        "href",
        "/"
      );
    });
  });
});
