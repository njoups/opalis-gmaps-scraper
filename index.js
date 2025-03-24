const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const keyword = 'barber';
  const location = 'Los Angeles';
  const url = `https://www.google.com/maps/search/${keyword}+in+${location}/`;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  await page.waitForTimeout(5000);

  const businesses = await page.evaluate(() => {
    const nodes = document.querySelectorAll('.hfpxzc');
    return Array.from(nodes).map(node => ({
      name: node.querySelector('.qBF1Pd')?.textContent || '',
      address: node.querySelector('.rllt__details div:nth-child(2)')?.textContent || '',
    }));
  });

  fs.writeFileSync('results.csv', 'Name,Address\n' +
    businesses.map(b => `"${b.name}","${b.address}"`).join('\n'));

  console.log('✅ Selesai! Data disimpan di results.csv');
  await browser.close();
})();
