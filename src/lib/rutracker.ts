import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';
import { RuTrackerRawFileEntryCore } from './definitions';
import { parseSize } from './utils';

// TODO: add timeouts between actions
export default class RuTracker {
  private rootURL: string = 'https://rutracker.org';
  private browser!: Browser;
  private page!: Page;

  public constructor() {
  }

  public async initSession(): Promise<void> {
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();

    const username = process.env.RUTRACKER_USERNAME;
    const password = process.env.RUTRACKER_PASSWORD;
    if (username === undefined || password === undefined) {
      throw new Error('Username or password empty');
    }
    await this.login(username, password);
  }

  public async resumeSession(): Promise<void> {
  }

  public async pauseSession(): Promise<void> {
    fs.writeFileSync('cookies.json', JSON.stringify(await this.browser.cookies()));
    await this.browser.close();
  }

  private async login(username: string, password: string): Promise<void> {
    if (await this.isSignedIn()) {
      return;
    }
    await this.page.goto(this.rootURL);
    await this.page.locator('a ::-p-text(Вход)').click();
    await this.page.locator('#top-login-uname').fill(username);
    await this.page.locator('#top-login-pwd').fill(password);
    await this.page.locator('#top-login-btn').click();
  }

  private async isSignedIn(): Promise<boolean> {
    if (this.page === undefined) {
      return false;
    }
    return await this.page.$('#logged-in-username') !== null;
  }

  public async search(term: string): Promise<Array<RuTrackerRawFileEntryCore>> {
    if (!await this.isSignedIn()) {
      throw new Error('Not signed in');
    }
    const URL = `${this.rootURL}/forum/tracker.php?nm=${encodeURIComponent(term)}`;
    await this.page.goto(URL);
    // await this.page.waitForSelector('#search-results');

    // const entries = await this.page.$$eval('#search-results tbody tr', rows => {
    //   return rows.map(row => {
    //     const cells = row.querySelectorAll('td');
    //     return {
    //       id: parseInt(cells[0].id),
    //       category: cells[2].textContent,
    //       description: cells[3].textContent,
    //       size: parseSize(cells[5].textContent || ''),
    //       seeds: parseInt(cells[6].textContent || ''),
    //       leeches: parseInt(cells[7].textContent || ''),
    //       downloads: parseInt(cells[8].textContent || ''),
    //       date: new Date('1999-01-01') // TODO
    //     } as RuTrackerFileEntry;
    //   });
    // });
    // return entries;
    return new Array();
  }
}

async function main() {
  const rt = new RuTracker();
  await rt.initSession();
  await new Promise(resolve => setTimeout(resolve, 1500));
  await rt.search('gattaca');
}
main();