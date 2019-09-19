const { request } = require('https')

const cheerio = require('cheerio')
const iconv = require('iconv-lite')

const getBody = (url, options) => {
  if (!options.charset) {
    options.charset = 'utf-8'
  }
  return new Promise((resolve, reject) => {
    const reqParams = {
      method: options.method || 'get',
      encoding: null,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    console.log(reqParams)
    const req = request(url, reqParams, (res) => {
      // res.setEncoding('utf8')
      let body = []
      let length = 0
      res.on('data', (chunk) => {
        body.push(chunk)
        length += chunk.length
      })

      res.on('end', () => {
        body = Buffer.concat(body, length)
        body = iconv.decode(body, options.charset).toString()
        // const { window } = new JSDOM(body)
        if (options.test) {
          console.log(body)
        }
        resolve(cheerio.load(body))
      })
    })
    req.setTimeout(3000)
    if (options.body) {
      req.write(options.body)
    }
    req.end()
  })
}

module.exports = {
  getBody
}
