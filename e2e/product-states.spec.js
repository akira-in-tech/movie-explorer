import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/auth/profile", async (route) => {
    await route.fulfill({ status: 401, json: { error: "Unauthorized" } });
  });
  await page.route("**/api/featured", async (route) => route.abort("failed"));
});

test("home remains useful when featured content is unavailable", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Find a story worth your time." })
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "Featured content is temporarily unavailable"
  );
  await expect(page.getByRole("link", { name: "Explore movies" })).toBeVisible();
});

test("login distinguishes a service outage from bad credentials", async ({
  page,
}) => {
  await page.route("**/api/auth/login", async (route) => route.abort("failed"));
  await page.goto("/login");

  await page.getByLabel("Username").fill("movie-fan");
  await page.getByLabel("Password").fill("not-a-real-password");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByRole("alert")).toContainText(
    "temporarily unavailable"
  );
});
