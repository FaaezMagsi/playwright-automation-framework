const { BasePage } = require('./BasePage');

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstName = page.getByTestId('first-name');
    this.lastName = page.getByTestId('last-name');
    this.dob = page.getByTestId('dob');
    this.country = page.getByTestId('country');
    this.postalCode = page.getByTestId('postal_code');
    this.houseNumber = page.getByTestId('house_number');
    this.street = page.getByTestId('street');
    this.city = page.getByTestId('city');
    this.state = page.getByTestId('state');
    this.phone = page.getByTestId('phone');
    this.email = page.getByTestId('email');
    this.password = page.getByTestId('password');
    this.submit = page.getByTestId('register-submit');
    this.error = page.getByTestId('register-error');
  }

  open() {
    return this.navigate('/auth/register');
  }

  async register(user) {
    await this.fill(this.firstName, user.first_name, 'first name');
    await this.fill(this.lastName, user.last_name, 'last name');
    await this.fill(this.dob, user.dob, 'date of birth');
    await this.select(this.country, user.address.country, 'country');
    await this.fill(this.postalCode, user.address.postal_code, 'postal code');
    // Typing the house number triggers an address lookup that overwrites street/city/state.
    const lookup = this.page.waitForResponse((r) => r.url().includes('/postcode-lookup')).catch(() => null);
    await this.fill(this.houseNumber, user.address.house_number, 'house number');
    await lookup;
    await this.fill(this.street, user.address.street, 'street');
    await this.fill(this.city, user.address.city, 'city');
    await this.fill(this.state, user.address.state, 'state');
    await this.fill(this.phone, user.phone, 'phone');
    await this.fill(this.email, user.email, 'email');
    await this.fill(this.password.first(), user.password, 'password');
    await this.click(this.submit, 'register button');
  }
}

module.exports = { RegisterPage };
