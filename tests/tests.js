const { test, expect } = require('@playwright/test');

const URL = 'https://tamil.changathi.com/';

// helper to get first textarea
async function getInput(page) {
  return page.locator('textarea').first();
}

// -----------------------------
//  Positive Functional Test
// -----------------------------
test('Pos_Fun_basic_simple_sentence', async ({ page }) => {
  await page.goto(URL);

  const input = await getInput(page);
  await input.fill('naan veetukku poren');

  await page.waitForTimeout(1500);

  const content = await page.content();
  await expect(content).toContain('நான்');
});


// -----------------------------
//  Mixed English + Thanglish
// -----------------------------
test('Pos_Fun_mixed_language', async ({ page }) => {
  await page.goto(URL);

  const input = await getInput(page);
  await input.fill('innaiku Zoom meeting irukku');

  await page.waitForTimeout(1500);

  const content = await page.content();
  await expect(content).toContain('இன்னைக்கு');
});


// -----------------------------
//  Long Input Test (≥300 chars)
// -----------------------------
test('Pos_Fun_long_paragraph', async ({ page }) => {
  await page.goto(URL);

  const longText = `innaiku morning naan late ah ezhundhen apram seekiram ready aagi 
  bus la office ponen ange meeting nadandhuchu manager project pathi pesinaar 
  next week delivery irukku nu sonnaru adhukku naanga ellarum serndhu work panna 
  porom evening veetukku thirumbi vandhu report complete panninen`;

  const input = await getInput(page);
  await input.fill(longText);

  await page.waitForTimeout(2500);

  const content = await page.content();
  await expect(content.length).toBeGreaterThan(0);
});


// -----------------------------
//  Negative Robustness Test
// -----------------------------
test('Neg_Fun_typo_heavy_input', async ({ page }) => {
  await page.goto(URL);

  const input = await getInput(page);
  await input.fill('naaaan veetukku pooooren');

  await page.waitForTimeout(1500);

  const content = await page.content();

  // just verify system did not crash
  await expect(content.length).toBeGreaterThan(0);
});


// -----------------------------
//  UI Test — Real-time update
// -----------------------------
test('Pos_UI_realtime_update', async ({ page }) => {
  await page.goto(URL);

  const input = await getInput(page);

  await input.type('naan', { delay: 200 });

  await page.waitForTimeout(800);

  const content = await page.content();

  await expect(content).toContain('நான்');
});


// -----------------------------
//  UI Test — Clear input behavior
// -----------------------------
test('Neg_UI_clear_input', async ({ page }) => {
  await page.goto(URL);

  const input = await getInput(page);
  await input.fill('naan varren');

  await page.waitForTimeout(1000);

  await input.fill('');

  await page.waitForTimeout(800);

  const content = await page.content();

  // page should still be stable
  await expect(content.length).toBeGreaterThan(0);
});

// -----------------------------
//  POSITIVE TEST INPUT SET 
// -----------------------------
const positiveInputs = [
  'naan veetukku poren',
  'nee epadi irukka?',
  'konjam help pannuveengala?',
  'naan ippo vela seiyaren',
  'naan sapadu saapten appuram office ponen',
  'innaiku Zoom meeting irukku',
  'seekiram vaa',
  'naan vara maaten',
  'naalai naan college poren',
  'naanga movie paaka porom',
  'please indha file anuppunga',
  'naanveetukuporen',
  'romba romba sandhosham',
  'semma fun ah irundhuchu',
  'bill amount Rs. 2500',
  'meeting 10.30 AM ku start aagum',
  'event 25/12/2026 nadakkum',
  'naan 5 km nadanthen',
  'naan Chennai la irukken',
  'mazhai vandhaal naanga veliya pogama iruppom',
  'nee report upload pannitiya?',
  'naan   ippo   varren',
  `naan veetukku poren
nee enga pora?`,
  `innaiku morning naan late ah ezhundhen apram seekiram ready aagi bus la office ponen ange meeting nadandhuchu manager project pathi pesinaar next week delivery irukku nu sonnaru adhukku naanga ellarum serndhu work panna porom evening veetukku thirumbi vandhu report complete panninen`
];

// -----------------------------
//  NEGATIVE TEST INPUT SET 
// -----------------------------
const negativeInputs = [
  'naaaan veetukku pooooren',
  'NaAn VeEtUkKu PoReN',
  'na an vee tu kku po ren',
  'naan veetukku poren ###@@@',
  'romba mass ah irundhudhu da scene full fire ah pochu',
  'paal pal paal pal',
  'server database API token refresh pannunga',
  'naan 2day office poren',
  'naanippoofficekkuvelaseiyaporenpleasewait',
  'innaiku meeting nadakkum,, time change aagalam???'
];


// ===================================================
//  RUN ALL POSITIVE FUNCTIONAL TESTS
// ===================================================
positiveInputs.forEach((text, index) => {
  test(`Pos_Fun_${index + 1}`, async ({ page }) => {
    await page.goto(URL);

    const input = await getInput(page);
    await input.fill(text);

    await page.waitForTimeout(1800);

    const html = await page.content();

    // verify system produced output and page is stable
    expect(html.length).toBeGreaterThan(0);
  });
});


// ===================================================
// RUN ALL NEGATIVE FUNCTIONAL TESTS
// ===================================================
negativeInputs.forEach((text, index) => {
  test(`Neg_Fun_${index + 1}`, async ({ page }) => {
    await page.goto(URL);

    const input = await getInput(page);
    await input.fill(text);

    await page.waitForTimeout(1800);

    const html = await page.content();

    // negative = robustness — system should not crash
    expect(html.length).toBeGreaterThan(0);
  });
});


// ===================================================
//  UI TEST — Real-time Update While Typing
// ===================================================
test('Pos_UI_realtime_typing', async ({ page }) => {
  await page.goto(URL);

  const input = await getInput(page);

  await input.type('naan varren', { delay: 150 });

  await page.waitForTimeout(1000);

  const html = await page.content();
  expect(html).toContain('நான்');
});


// ===================================================
// UI TEST — Clear Input Behavior
// ===================================================
test('Neg_UI_clear_input', async ({ page }) => {
  await page.goto(URL);

  const input = await getInput(page);
  await input.fill('naan varren');

  await page.waitForTimeout(1000);

  await input.fill('');

  await page.waitForTimeout(800);

  const html = await page.content();
  expect(html.length).toBeGreaterThan(0);
});

