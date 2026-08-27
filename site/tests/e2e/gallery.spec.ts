import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('catalog loads and filters without layout navigation', async ({ page }) => {
  await page.goto('./');

  await expect(page.getByRole('heading', { level: 1, name: 'Copilot Components' })).toBeVisible();
  await expect(page.locator('[data-component-card]')).toHaveCount(17);
  await page.getByRole('searchbox', { name: 'Search components' }).fill('Work IQ');
  await expect(page.locator('[data-component-card]:visible')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 3, name: 'Work IQ Answers' })).toBeVisible();
  await expect(page).toHaveURL(/\?q=Work(?:%20|\+)IQ$/);
});

test('events sample increments catalog and contributor counts', async ({ page }) => {
  await page.goto('./');

  await expect(page.locator('.catalog-stat')).toContainText('17community components');
  await expect(page.locator('#result-count')).toHaveText('Showing 17 components');
  await expect(page.getByRole('heading', { level: 3, name: 'SharePoint Events Copilot Agent' })).toBeVisible();

  await page.getByRole('combobox', { name: 'Contributor' }).selectOption('joaojmendes');
  await expect(page.locator('[data-component-card]:visible')).toHaveCount(2);
  await expect(page.locator('#result-count')).toHaveText('Showing 2 matching components');
  await expect(page).toHaveURL(/\?author=joaojmendes$/);

  await page.goto('./contributors/');
  const contributor = page.locator('.contributor-card').filter({ hasText: 'João Mendes' });
  await expect(contributor).toContainText('2 component samples');
});

test('component detail exposes source, download, and documentation', async ({ page }) => {
  await page.goto('./samples/apps-directory/');

  await expect(page.getByRole('heading', { level: 1, name: 'Apps directory' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download sample' })).toHaveAttribute('href', /download-partial/);
  await expect(page.getByRole('link', { name: /View source/ })).toHaveAttribute('href', /spfx-copilot-components/);
  await expect(page.getByRole('heading', { level: 2, name: 'Setup and implementation' })).toBeVisible();
});

test('home and detail pages have no automatically detectable accessibility violations', async ({ page }) => {
  for (const route of ['./', './samples/apps-directory/']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${route} accessibility violations`).toEqual([]);
  }
});

test('mobile navigation exposes all primary destinations', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'Mobile navigation behavior');
  await page.goto('./');
  await page.locator('.mobile-nav summary[aria-label="Open navigation"]').click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Getting started' })).toBeVisible();
});

test('public catalog matches the rendered component count', async ({ request }) => {
  const response = await request.get('./catalog.json');
  expect(response.ok()).toBeTruthy();
  const catalog = await response.json();
  expect(catalog.version).toBe(1);
  expect(catalog.components).toHaveLength(17);
  expect(catalog.components).toEqual(expect.arrayContaining([
    expect.objectContaining({
      slug: 'events',
      title: 'SharePoint Events Copilot Agent',
      sourceUrl: 'https://github.com/pnp/spfx-copilot-components/tree/main/samples/events',
      authors: [expect.objectContaining({ gitHubAccount: 'joaojmendes' })],
    }),
  ]));
  expect(catalog.excludedSamples).toEqual([
    { slug: 'm365-service-health', reason: 'Missing assets/sample.json' },
  ]);
});