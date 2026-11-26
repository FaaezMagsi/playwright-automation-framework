const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const cache = new Map();

/** Validates data against schemas/<name>.json. */
function validateSchema(name, data) {
  if (!cache.has(name)) cache.set(name, ajv.compile(require(`../schemas/${name}.json`)));
  const validate = cache.get(name);
  const valid = validate(data);
  return { valid, errors: valid ? '' : ajv.errorsText(validate.errors) };
}

module.exports = { validateSchema };
