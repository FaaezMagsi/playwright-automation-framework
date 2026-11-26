const crypto = require('crypto');

const unique = () => `${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}`;

/** Builds a new user from a template so tests never share or lock an account. */
function buildUser(template) {
  const id = unique();
  return {
    ...template,
    address: { ...template.address },
    email: `qa.${id}@example.com`,
    // Generated per run: Toolshop rejects passwords found in known breaches.
    password: `Qa!${id}#Z9`,
  };
}

module.exports = { unique, buildUser };
