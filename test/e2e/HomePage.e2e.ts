/* eslint jest/expect-expect: off, jest/no-test-callback: off */
import { ClientFunction } from 'testcafe';

const getPageTitle = ClientFunction(() => document.title);
const assertNoConsoleErrors = async (t: any) => {
  const { error } = await t.getBrowserConsoleMessages();
  await t.expect(error).eql([]);
};

fixture`Home Page`.page('../../app/app.html').afterEach(assertNoConsoleErrors);

test('e2e', async (t) => {
  await t.expect(getPageTitle()).eql('Homura');
});

test('should open window and contain expected page title', async (t) => {
  await t.expect(getPageTitle()).eql('Homura');
});

test(
  'should not have any logs in console of main window',
  assertNoConsoleErrors
);
