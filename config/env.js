// Central configuration. Environment variables override the defaults.
require('dotenv').config({ quiet: true });

module.exports = {
  baseUrl: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
  apiUrl: process.env.API_URL || 'https://api.practicesoftwaretesting.com',
  // Public demo account published by the Toolshop project. Used only to delete test-created data.
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@practicesoftwaretesting.com',
    password: process.env.ADMIN_PASSWORD || 'welcome01',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  timeouts: { test: 90_000, expect: 15_000, action: 20_000, navigation: 45_000 },
};
