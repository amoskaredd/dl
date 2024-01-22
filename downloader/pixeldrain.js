const axios = require('axios');

  async function pixeldrain(url) {
    try {
    const id = url.split('/').pop()

    const res = await axios({
      url: `https://pixeldrain.com/api/file/${id}/info`
    })

    if (res.status !== 200) {
      throw new Error(res.statusText)
    }

    if (!res.data?.success) {
      throw new Error('Response returned bad status')
    }
    
    const data = res.data
    const name = data.name
    let mime;
    if (name.includes(".mp4")) mime = 'video/mp4';
    if (name.includes(".mkv")) mime = 'video/mkv';
    if (name.includes(".mp3")) mime = 'audio/mp3';
    if (name.includes(".pdf")) mime = 'application/pdf';
    if (name.includes(".zip")) mime = 'application/zip';
    if (name.includes(".rar")) mime = 'application/vnd.rar';
    if (name.includes(".apk")) mime = 'application/vnd.android.package-archive';
    
    return {
        filename: name,
        link: url.replace('pixeldrain.com/u', 'pixeldrain.com/api/file') + '?download',
        size: data.size,
        mimetype: mime,
        views: data.views,
        downloads: data.downloads,
        createdAt: data.date_upload,
      }
    
  } catch (err) {
    throw err
  }
  }
  
  module.exports = { pixeldrain }