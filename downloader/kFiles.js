const axios = require('axios');
const cheerio = require('cheerio');

async function kFiles(url) {
    return new Promise(async(resolve, reject) => {
      try {
    let krakenPage = await axios.get(url)
    let $ = cheerio.load(krakenPage.data)
    let token = $("#dl-token").val()
    let krakenId = url.split("/").filter(x => /[A-Z]/g.test(x))[0]
    // return { token, krakenId }
    let postdata = await axios({
      url: "https://krakenfiles.com/download/" + krakenId,
      method: "post",
      headers: {
        "Accept": "/",
        "X-Requested-With": "XMLHttpRequest",
        "Hash": krakenId
      },
      data: new URLSearchParams(Object.entries({ token }))
    })
    const fileName = $("body > div.nk-app-root > div > div.nk-content.nk-content-fluid > div > div > div > div.nk-block.invest-block > div > div.col-lg-8 > div.invest-field.form-group > div > div.coin-item.file-title > div.coin-info > span > h5").text().trim()
    const link = postdata.data.url
    const uploadDate = $("body > div.nk-app-root > div > div.nk-content.nk-content-fluid > div > div > div > div.nk-block.invest-block > div > div.col-xl-4.col-lg-5.general-information > div.invest-field.card.card-bordered.ml-lg-4.ml-xl-0 > div > div:nth-child(1) > ul > li:nth-child(1) > div.lead-text").text().trim()
    const fileSize = $("body > div.nk-app-root > div > div.nk-content.nk-content-fluid > div > div > div > div.nk-block.invest-block > div > div.col-xl-4.col-lg-5.general-information > div.invest-field.card.card-bordered.ml-lg-4.ml-xl-0 > div > div:nth-child(1) > ul > li:nth-child(3) > div.lead-text").text().trim()
    const fileType = $("body > div.nk-app-root > div > div.nk-content.nk-content-fluid > div > div > div > div.nk-block.invest-block > div > div.col-xl-4.col-lg-5.general-information > div.invest-field.card.card-bordered.ml-lg-4.ml-xl-0 > div > div:nth-child(1) > ul > li:nth-child(4) > div.lead-text").text().trim()
    let mime;
    if (fileName.includes(".mp4")) mime = 'video/mp4';
    if (fileName.includes(".mkv")) mime = 'video/mkv';
    if (fileName.includes(".mp3")) mime = 'audio/mp3';
    if (fileName.includes(".pdf")) mime = 'application/pdf';
    if (fileName.includes(".zip")) mime = 'application/zip';
    if (fileName.includes(".rar")) mime = 'application/vnd.rar';
    if (fileName.includes(".apk")) mime = 'application/vnd.android.package-archive';

    const result = { fileName, link, uploadDate, fileType: mime, fileSize }
    
    resolve(result);
} catch(error) {
  console.log(error)
  return ({
    status: false,
    type: 'error',
    result: {
      message: 'error'
    }
})
}
});
  
}

module.exports = { kFiles }