const cheerio = require('cheerio');
const fetch = require('node-fetch');
const path = require('path');

async function Bayfiles(url) {
  return new Promise(async(resolve, reject) => {
    try {
      const res = await fetch(url);
      const $ = cheerio.load(await res.text());
      const name = $('div.row.top-wrapper > div:nth-child(2) > h1').text();
      const type = (path.extname(name)).split('.')[1];
      const size = $('div#download-wrapper > div.col-xs-12 > a#download-url').text();
      const size2 = size.replace('Download', '').replace('(', '').replace(')', '').trim();
      const link = $('div#download-wrapper > div.col-xs-12 > a#download-url').attr('href').replace(/ /g, '%20');
      
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
          type,
          mimetype: mime,
          size: size2,
          link
        }
      };
      resolve(result);
    }
    catch(error) {
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

module.exports = { Bayfiles };