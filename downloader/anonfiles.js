const cheerio = require('cheerio');
const fetch = require('node-fetch');

async function Anonfiles(url) {
  return new Promise(async(resolve, reject) => {
    try {
      const res = await fetch(url);
      const data = await res.text();
      const $ = cheerio.load(data);
      //if ($('div#error-container > div:nth-child(2) > h1').text())
      if (data.includes('The file you are looking for does not exist!')) return resolve({
        status: false,
        type: 'error',
        result: {
          message: 'file does not exist'
        }
      })
      const name = $('div.row.top-wrapper > div:nth-child(2) > h1').text();
      const type = name.split('.')[1];
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
          message: error
        }
      });
    }
  });
}

module.exports = { Anonfiles };