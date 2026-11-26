/** Takes a screenshot and attaches it to the test report. */
async function attachScreenshot(page, testInfo, name = 'screenshot') {
  const path = testInfo.outputPath(`${name.replace(/[^\w-]+/g, '_')}.png`);
  await page.screenshot({ path, fullPage: true });
  await testInfo.attach(name, { path, contentType: 'image/png' });
  return path;
}

module.exports = { attachScreenshot };
