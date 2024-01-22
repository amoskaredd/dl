const agent = require('superagent');
const cheerio = require('cheerio');
const path = require('path');

async function Racaty(url) {
  return new Promise(async(resolve, reject) => {
    try {
      const unxId = url.split('io/')[1] || url.split('net/')[1];
      const URL = `https://racaty.io/${unxId}`;
      const data = {
        'op': 'download2',
        'id': unxId,
        'rand': '',
        'referer': '',
        'method_free': '',
        'method_premium': ''
      };
      const res = await agent.post(URL).type('form').send(data);
      const $ = cheerio.load(res.text);
      const name = $('p.text-monospace:nth-child(2)').text();
      const size = $('p.text-monospace:nth-child(4)').text();
      const type = (path.extname(name)).split('.')[1];
      const span = ($('span').text().trim()).split('Uploaded:')[1];
      const uploaded = ((span.replace(/\D/g, ' ')).trim()).replace(/ /g, '-');
      const link = ($('#uniqueExpirylink').attr('href')).replace(/ /g, '%20')
     
    let mime;
    if (name.includes(".mp4")) mime = 'video/mp4';
    if (name.includes(".mkv")) mime = 'video/mkv';
    if (name.includes(".mp3")) mime = 'audio/mp3';
    if (name.includes(".pdf")) mime = 'application/pdf';
    if (name.includes(".zip")) mime = 'application/zip';
    if (name.includes(".rar")) mime = 'application/vnd.rar';
    if (name.includes(".apk")) mime = 'application/vnd.android.package-archive';

      const result = {
        status: true,
        type: 'scrape',
        result: {
          name,
          size,
          mimetype: mime,
          uploaded,
          link
        }
      };
      resolve(result);
    } catch(error) {
      console.log(error);
      return resolve({
        status: false,
        type: 'error',
        result: {
          message: 'unknow error'
        }
      });
    }
  });
}

module.exports = { Racaty };