// Waits for the Jenkins build to finish, then saves screenshots of the real run.
const fs = require('fs');
const { chromium } = require('@playwright/test');

const BASE = process.env.JENKINS_URL || 'http://localhost:8080';
const PASSWORD = process.env.JENKINS_ADMIN_PASSWORD;
const JOB = `${BASE}/job/playwright-automation`;
const OUT = 'evidence';
const headers = { Authorization: `Basic ${Buffer.from(`admin:${PASSWORD}`).toString('base64')}` };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForBuild() {
  const deadline = Date.now() + 40 * 60 * 1000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${JOB}/lastBuild/api/json`, { headers });
      if (res.ok) {
        const build = await res.json();
        if (!build.building && build.result) return build;
      }
    } catch { /* Jenkins still starting */ }
    await sleep(10_000);
  }
  throw new Error('Jenkins build did not finish in time');
}

(async () => {
  fs.mkdirSync(`${OUT}/screenshots`, { recursive: true });
  const build = await waitForBuild();
  console.log(`Build #${build.number}: ${build.result}`);
  const log = await (await fetch(`${JOB}/${build.number}/consoleText`, { headers })).text();
  fs.writeFileSync(`${OUT}/jenkins-console.log`, log);
  fs.writeFileSync(`${OUT}/build.json`, JSON.stringify({ number: build.number, result: build.result, durationMs: build.duration }, null, 2));
  const zip = await fetch(`${JOB}/${build.number}/artifact/*zip*/archive.zip`, { headers });
  if (zip.ok) fs.writeFileSync(`${OUT}/jenkins-artifacts.zip`, Buffer.from(await zip.arrayBuffer()));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/login`);
  await page.locator('input[name="j_username"]').fill('admin');
  await page.locator('input[name="j_password"]').fill(PASSWORD);
  await page.locator('[name="Submit"]').click();
  await page.waitForLoadState('networkidle');

  const shots = [
    ['01-dashboard', `${BASE}/`],
    ['02-pipeline-stage-view', `${JOB}/`],
    ['03-build-summary', `${JOB}/${build.number}/`],
    ['04-console-output', `${JOB}/${build.number}/console`],
    ['05-archived-artifacts', `${JOB}/${build.number}/artifact/`],
    ['06-allure-overview', `${JOB}/${build.number}/allure/`],
    ['07-allure-suites', `${JOB}/${build.number}/allure/#suites`],
    ['08-job-configuration', `${JOB}/configure`],
  ];
  for (const [name, url] of shots) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
      await sleep(4000);
      if (name === '04-console-output') await page.keyboard.press('End');
      await page.screenshot({ path: `${OUT}/screenshots/${name}.png`, fullPage: name !== '04-console-output' });
      console.log(`Captured ${name}`);
    } catch (error) {
      console.log(`Could not capture ${name}: ${error.message}`);
    }
  }
  await browser.close();
})();
