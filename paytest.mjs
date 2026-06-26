import { chromium } from 'playwright';

const API = 'http://localhost:8000';
const WEB = 'http://localhost:8082';

async function jpost(path, body) {
  const r = await fetch(API + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return r.json();
}
async function jget(path) { const r = await fetch(API + path); return r.json(); }

const ts = Date.now();
const email = `donorpay_${ts}@test.com`;

// 1. Seed a donor
const su = await jpost('/users/signup', { email, password: 'pass123' });
await jpost('/users/register', { Userid: su.UserID, name: 'Pay Donor', role: 'Donor', phone_number: '94' + String(ts).slice(-8), street: '1 St', city: 'Chennai', state: 'TN', postal_code: '600001' });
console.log('Seeded donor', email, 'uid', su.UserID);

// figure out which NGO will be first in the list, capture its wallet before
const ngos = await jget('/ngos/');
const firstNgo = ngos.ngos[0];
const before = (await jget(`/ngos/${firstNgo.ngoid}/wallet`)).walletbalance;
console.log('Target NGO:', firstNgo, 'wallet before:', before);

const browser = await chromium.launch();
const page = await browser.newPage();
const errs = [];
page.on('pageerror', e => errs.push(e.message));
let fail = 0; const ok = m => console.log('  PASS:', m); const bad = m => { console.log('  FAIL:', m); fail++; };

try {
  await page.goto(WEB, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  // login as donor
  const ins = page.locator('input');
  await ins.nth(0).fill(email); await ins.nth(1).fill('pass123');
  await page.getByText('Log-in', { exact: true }).last().click();
  await page.waitForTimeout(4000);
  let body = await page.textContent('body');
  if (body.includes('Donate')) ok('Donor home (NGO list with Donate) rendered'); else bad('No Donate button on home. body=' + body.replace(/\s+/g,' ').slice(0,200));

  // click first Donate
  await page.getByText('Donate', { exact: true }).first().click();
  await page.waitForTimeout(1500);
  body = await page.textContent('body');
  if (body.includes('Continue to Payment')) ok('Donate screen rendered'); else bad('Donate screen missing');

  // enter amount
  const amtInput = page.getByPlaceholder('Enter amount');
  await amtInput.fill('300');
  await page.getByText('Continue to Payment', { exact: true }).click();
  await page.waitForTimeout(1500);
  body = await page.textContent('body');
  if (body.includes('Complete Payment')) ok('Payment screen rendered'); else bad('Payment screen missing');

  // pay
  await page.getByText(/^Pay /).first().click();
  await page.waitForTimeout(3500);
  body = await page.textContent('body');
  if (body.includes('Payment Successful')) ok('Payment success screen shown'); else bad('No success screen. body=' + body.replace(/\s+/g,' ').slice(0,200));

  // verify DB wallet increased by 300
  const after = (await jget(`/ngos/${firstNgo.ngoid}/wallet`)).walletbalance;
  console.log('  wallet after:', after, '(before', before, ')');
  if (Math.abs(after - before - 300) < 0.01) ok('NGO wallet credited +300 in DB'); else bad(`wallet delta wrong: ${after - before}`);

} catch (e) { bad('Exception: ' + e.message); }
finally {
  console.log('page errors:', errs.length); errs.slice(0,5).forEach(e => console.log('   !', e.slice(0,140)));
  await browser.close();
  console.log(fail === 0 ? '\nRESULT: PAYMENT UI E2E PASSED' : `\nRESULT: ${fail} CHECK(S) FAILED`);
  process.exit(fail === 0 ? 0 : 1);
}
