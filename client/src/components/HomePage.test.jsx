import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";

import api from "../api/client";
import HomePage from "./HomePage";

vi.mock("../api/client", () => ({
  default: { get: vi.fn() },
}));
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));

beforeEach(() => {
  vi.mocked(api.get).mockReset();
});

test("keeps movie search available when featured content fails", async () => {
  vi.mocked(api.get).mockRejectedValue(new Error("offline"));

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );

  expect(
    screen.getByRole("heading", { name: "Find a story worth your time." })
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/Featured content is temporarily unavailable/)
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Explore movies" })).toHaveAttribute(
    "href",
    "/search"
  );
});
