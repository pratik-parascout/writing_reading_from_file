const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  const url = req.url
  const method = req.method

  if (url === '/') {
    fs.readFile('message.txt', 'utf-8', (err, data) => {
      const storedMessage = err ? '' : data

      res.write('<html>')
      res.write('<head><title>Writing and Reading from a File</title></head>')
      res.write('<body><ul>')

      if (storedMessage) {
        res.write(`<li>${storedMessage}</li>`)
      }

      res.write(
        '<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Submit</button></form>'
      )
      res.write('</ul></body>')
      res.write('</html>')
      return res.end()
    })
  } else if (url === '/message' && method === 'POST') {
    const body = []
    req.on('data', (chunk) => {
      body.push(chunk)
    })

    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString()
      const message = decodeURIComponent(parsedBody.split('=')[1])

      fs.writeFile('message.txt', message, (err) => {
        if (err) {
          console.error(err)
        }
        res.statusCode = 302
        res.setHeader('Location', '/')
        return res.end()
      })
    })
  }
})

server.listen(4000, () => {
  console.log('Server is listening on port 4000')
})
