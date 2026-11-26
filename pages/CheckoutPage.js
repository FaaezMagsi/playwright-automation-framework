const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.proceedSignedIn = page.getByTestId('proceed-2');
    this.proceedAddress = page.getByTestId('proceed-3');
    this.street = page.getByTestId('street');
    this.city = page.getByTestId('city');
    this.state = page.getByTestId('state');
    this.country = page.getByTestId('country');
    this.postalCode = page.getByTestId('postal_code');
    this.houseNumber = page.getByTestId('house_number');
    this.paymentMethod = page.getByTestId('payment-method');
    this.confirmButton = page.getByTestId('finish');
    this.paymentSuccess = page.getByTestId('payment-success-message');
    this.orderConfirmation = page.locator('#order-confirmation');
  }

  async confirmSignedIn() {
    await this.click(this.proceedSignedIn, 'proceed (signed in)');
  }

  async completeAddress(address) {
    await this.waits.visible(this.street);
    // Fill only what the saved profile did not supply.
    const fields = [
      [this.postalCode, address.postal_code], [this.houseNumber, address.house_number],
      [this.street, address.street], [this.city, address.city], [this.state, address.state],
    ];
    for (const [field, value] of fields) {
      if (!(await field.inputValue())) await this.fill(field, value, 'billing address field');
    }
    await this.click(this.proceedAddress, 'proceed to payment');
  }

  async pay(method) {
    await this.select(this.paymentMethod, method, `payment method ${method}`);
    await this.click(this.confirmButton, 'check payment');
    await this.waits.visible(this.paymentSuccess);
  }

  async placeOrder() {
    await this.click(this.confirmButton, 'confirm order');
  }
}

module.exports = { CheckoutPage };
