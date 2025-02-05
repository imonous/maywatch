import puppeteer, { Page } from 'puppeteer';

async function initSession() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  const username = process.env.RUTRACKER_USERNAME;
  const password = process.env.RUTRACKER_PASSWORD;
  if (username === undefined || password === undefined) {
    throw new Error();
  }
  login(page, username, password);
}

async function resumeSession() {
}

async function pauseSession() {

}

async function login(page: Page, username: string, password: string) {
  await page.goto('https://rutracker.org/');
  await page.locator('a ::-p-text(Вход)').click();
  await page.locator('#top-login-uname').fill(username);
  await page.locator('#top-login-pwd').fill(password);
  await page.locator('#top-login-btn').click();
}

initSession();