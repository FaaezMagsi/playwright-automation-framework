const { test, expect } = require('../../fixtures/test');
const products = require('../../data/products.json');

test.describe('Cart and checkout', () => {
  let productName;

  async function addFirstProduct(homePage, productPage) {
    await homePage.open();
    productName = await homePage.openFirstAvailableProduct();
    await productPage.addToCart();
  }

  test('product can be added to the cart', async ({ homePage, productPage, header, cartPage }) => {
    await addFirstProduct(homePage, productPage);
    await expect(header.cartQuantity).toHaveText('1');
    await header.openCart();
    await expect(cartPage.titles.first()).toContainText(productName);
  });

  test('product can be removed from the cart', async ({ homePage, productPage, header, cartPage }) => {
    await addFirstProduct(homePage, productPage);
    await header.openCart();
    await expect(cartPage.titles).toHaveCount(1);
    await cartPage.removeFirstItem();
    await expect(cartPage.titles).toHaveCount(0);
  });

  test('signed-in user can complete checkout', async ({ loginPage, accountPage, homePage, productPage, header, cartPage, checkoutPage, newUser }, testInfo) => {
    await loginPage.open();
    await loginPage.login(newUser.email, newUser.password);
    await expect(accountPage.title).toBeVisible();
    await addFirstProduct(homePage, productPage);
    await header.openCart();
    await cartPage.proceed();
    await checkoutPage.confirmSignedIn();
    await checkoutPage.completeAddress(newUser.address);
    await checkoutPage.pay(products.payment.method);
    await checkoutPage.placeOrder();
    await expect(checkoutPage.orderConfirmation).toContainText(/INV-\d+/);
    await checkoutPage.takeScreenshot(testInfo, 'order confirmation');
  });
});
