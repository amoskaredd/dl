const agent = require('superagent');
const cheerio = require('cheerio');
const path = require('path');

async function Hxfile(url) {
  return new Promise(async(resolve, reject) => {
    try {
      const unxId = url.split('co/')[1];
      const data = {
        'op': 'download2',
        'id': unxId,
        'rand': '',
        'referer': '',
        'method_free': '',
        'method_premium': ''
      };
      const res = await agent.post(url).type('form').send(data);
      const $ = cheerio.load(res.text);
      const name = $('.dfilename').text();
      const type = (path.extname(name)).split('.')[1];
      const size = $('.size > span:nth-child(2)').text();
      const downloaded = $('.downloads > span:nth-child(2)').text();
      const link = ($('.btn.btn-dow').attr('href')).replace(/ /g, '%20');
      
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
          size,
          downloaded,
          link
        }
      };
      resolve(result);
    } catch(error) {
      console.log(error);
      return ({
        status: false,
        type: 'error',
        result: {
          message: 'error'
        }
      });
    }
  });
}

module.exports = { Hxfile };