import { AppPage } from './pages/app.po';
import { browser, logging } from 'protractor';

describe('Clinicaltrials monitor frontend', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display the website title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Clinicaltrials.gov monitor');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
