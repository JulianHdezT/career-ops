import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('https://job-boards.greenhouse.io/anthropic/jobs/5099753008');
    const content = await page.content();
    if (content.includes('Apply for this job') || content.includes('Job Description')) {
      console.log('ACTIVE');
    } else {
      console.log('CLOSED');
    }
  } catch (e) {
    console.log('ERROR: ' + e.message);
  }
  await browser.close();
})();
