// Handling of native browser dialogs (alert/confirm/prompt) and in-page popups.
const logger = require('./logger');

/** Accepts (or dismisses) every native dialog so a test can never hang on one. */
function autoHandleDialogs(page, { accept = true } = {}) {
  page.on('dialog', async (dialog) => {
    logger.info(`Dialog (${dialog.type()}): "${dialog.message()}" -> ${accept ? 'accept' : 'dismiss'}`);
    await (accept ? dialog.accept() : dialog.dismiss());
  });
}

/** Waits for a toast popup, closes it and returns its text. */
async function handleToast(page) {
  const toast = page.getByRole('alert').filter({ hasText: /\S/ }).first();
  await toast.waitFor({ state: 'visible' });
  const text = (await toast.innerText()).trim();
  logger.info(`Popup: "${text}"`);
  await toast.click();
  await toast.waitFor({ state: 'hidden' });
  return text;
}

module.exports = { autoHandleDialogs, handleToast };
