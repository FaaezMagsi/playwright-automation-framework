const { test, expect } = require('../../fixtures/test');
const products = require('../../data/products.json');

test.describe('Product catalogue', () => {
  test.beforeEach(async ({ homePage }) => { await homePage.open(); });

  for (const { term } of products.searches) {
    test(`search returns matching products: ${term}`, async ({ homePage }) => {
      await homePage.search(term);
      await expect(homePage.searchTerm).toHaveText(term);
      await expect(homePage.productNames.first()).toContainText(new RegExp(term, 'i'));
    });
  }

  test('category filter narrows the product list', async ({ homePage }) => {
    const { name, expectedInName } = products.category;
    await homePage.filterByCategory(name);
    const pattern = new RegExp(expectedInName, 'i');
    await expect(async () => {
      const names = await homePage.productNames.allInnerTexts();
      expect(names.length).toBeGreaterThan(0);
      for (const item of names) expect(item).toMatch(pattern);
    }).toPass();
  });

  test('product details page shows name, price and description', async ({ homePage, productPage }) => {
    const name = await homePage.openFirstProduct();
    await expect(productPage.name).toHaveText(name);
    await expect(productPage.price).toHaveText(/\d+\.\d{2}/);
    await expect(productPage.description).not.toBeEmpty();
  });
});
