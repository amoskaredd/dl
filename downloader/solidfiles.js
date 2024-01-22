const agent = require('superagent');
const cheerio = require('cheerio');

async function Solidfiles(url) {
  return new Promise(async(resolve, reject) => {
    try {
      const res = await agent.get(url);
      const $ = cheerio.load(res.text);
      const script = $('body > script:nth-child(15)');
      const data = JSON.parse(script.html().replace("angular.module('sf.viewer').constant('viewerOptions', ","").replace(");",''));
      const name = data.nodeName;
      const type = data.filetype
      const section = $('#content > div > div.middle > div.right > article:nth-child(1) > section.box-content.meta > p').text().trim();
      const size = section.split('-')[0];
      const uploaded = (section.split('-')[1]).trim();
      const link = data.downloadUrl;
      
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
          uploaded,
          link
        }
      };
      resolve(result);
    } catch(error) {
      console.log(error)
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

module.exports = { Solidfiles };