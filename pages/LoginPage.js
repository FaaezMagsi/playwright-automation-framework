const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.email = page.getByTestId('email');
    this.password = page.getByTestId('password');
    this.submit = page.getByTestId('login-submit');
    this.error = page.getByTestId('login-error');
  }

  open() {
    return this.navigate('/auth/login');
  }

  async login(email, password) {
    await this.fill(this.email, email, 'email');
    await this.fill(this.password, password, 'password');
    await this.click(this.submit, 'login button');
  }
}

module.exports = { LoginPage };
