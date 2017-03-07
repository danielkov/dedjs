#!/usr/bin/env node

const { createServer } = require('http')

const apps = {}

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json')
    let rBody = []
    let jBody
    req.on('data', (chunk) => {
      rBody.push(chunk)
    })
    .on('end', () => {
      rBody = Buffer.concat(rBody).toString()
      try {
        jBody = JSON.parse(rBody)
        if (jBody.request === 'Handshake') {
          apps[jBody.id] = []
          res.end(JSON.stringify({success: true, message: 'Successfully initialized DedJS.'}))
        }
        else if (jBody.request === 'Mark') {
          apps[jBody.id].push(parseStack(jBody.data))
          res.end(JSON.stringify({success: true, message: 'Undead mark logged.'}))
        }
      } catch (e) {
        res.statusCode = 400
        res.end(JSON.stringify({success: false, message: `Can't parse request body.`}))
      }
    })
  }
  else if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html')
    let appId = req.url.replace('/', '')
    if (apps[appId] !== undefined) {
      res.end(renderReport({title: `Report for ${appId}.`, message: 'Here is your report:', data: apps[appId]}))
    }
    else {
      res.end(renderHome())
    }
  }
})

.listen(process.argv.slice(2)[0] || 0)

.on('listening', () => {
  console.log(`
DedJS is now listening at: http://localhost:${server.address().port}

Make sure you initialize it with the correct port.
  `)
})

function parseStack (stack) {
  let s = stack.split('\n')
  let r = {
    title: '',
    details: []
  }
  s.map(l => {
    l = l.trim()
    if(l.startsWith('at')) {
      let n = l.split(':')
      let o = {
        details: n[0],
        line: parseInt(n[1]),
        character: parseInt(n[2])
      }
      r.details.push(o)
    }
    else {
      r.title = l
    }
  })
  return r;
}

function renderHome (d) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>DedJS</title>
      <link href="https://fonts.googleapis.com/css?family=Muli" rel="stylesheet">
      <style>
        html, body {
          margin: 0;
          font-size: 20px;
        }
        * {
          font-family: 'Muli', sans-serif;
          -webkit-font-smoothing: antialiased;
          box-sizing: border-box;
        }
        h1,h2,h3 {
          margin: 0;
        }
        .site-header {
          width: 100%;
          height: 80px;
          background: #4e5967;
          color: white;
          box-shadow: 0px 0px 5px rgba(0,0,0,.6);
          display: flex;
          align-items: center;
        }
        .site-header-title {
          padding: 0px 30px;
          text-shadow: 0px 2px 2px rgba(0,0,0,.3)
        }
        .header-button {
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border: 1px solid white;
          border-radius: 4px;
        }
        .header-button:hover {
          background: white;
          color: #4e5967;
        }
        img {
          max-width: 100%;
          max-height: 100%;
        }
        .github-logo {
          width: 60px;
          height: 60px;
        }
        main {
          max-width: 90%;
          width: 800px;
          margin: auto;
          display: flex;
          align-items: center;
          flex-direction: column;
        }
        main > h1 {
          width: 100%;
          padding: 50px 0;
        }
        .data-item {
          width: 100%;
          background: #edeeef;
          padding: 30px 40px;
          text-align: center;
        }
        ul {
          padding: 0;
          margin: 0;
        }
        li {
          list-style-type: none;
        }
        .data-item:hover {
          background: #dbdde0;
        }
        .data-item * {
          margin-bottom: 15px;
        }
        .char {
          color: #3281c6;
        }
        .line {
          color: #ed1c24;
        }
        .report-item {
          display: block;
          width: 100%;
          text-align: center;
          padding: 30px 40px;
          background: #edeeef;
          margin-bottom: 20px;
          border-radius: 5px;
          color: #4e5967;
          text-decoration: none;
        }
        .report-item:hover {
          background: #dbdde0;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <header class="site-header">
        <h1 class="site-header-title">DedJS</h1>
        <nav>
          <a href="/" class="header-button">All Reports</a>
        </nav>
      </header>
      <main>
        <h1>Available reports:</h1>
        ${renderReports()}
      </main>
    </body>
  </html>
  `
}

function renderReports () {
  let r = ''
  for (var report in apps) {
    if (apps.hasOwnProperty(report)) {
      r +=`
    <a href="/${report}" class="report-item"><div>
      <h2>${report}</h2>
      <p>Results: <span class="char">${apps[report].length}</span></p>
    </div></a>
      `
    }
  }
  return r === '' ? 'No reports found.' : r
}

function renderReport (d) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>DedJS</title>
      <link href="https://fonts.googleapis.com/css?family=Muli" rel="stylesheet">
      <style>
        html, body {
          margin: 0;
          font-size: 20px;
        }
        * {
          font-family: 'Muli', sans-serif;
          -webkit-font-smoothing: antialiased;
          box-sizing: border-box;
        }
        h1,h2,h3 {
          margin: 0;
        }
        .site-header {
          width: 100%;
          height: 80px;
          background: #4e5967;
          color: white;
          box-shadow: 0px 0px 5px rgba(0,0,0,.6);
          display: flex;
          align-items: center;
        }
        .site-header-title {
          padding: 0px 30px;
          text-shadow: 0px 2px 2px rgba(0,0,0,.3)
        }
        .header-button {
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border: 1px solid white;
          border-radius: 4px;
        }
        .header-button:hover {
          background: white;
          color: #4e5967;
        }
        img {
          max-width: 100%;
          max-height: 100%;
        }
        .github-logo {
          width: 60px;
          height: 60px;
        }
        main {
          max-width: 90%;
          width: 800px;
          margin: auto;
          display: flex;
          align-items: center;
          flex-direction: column;
        }
        main > h1 {
          width: 100%;
          padding: 50px 0;
        }
        .data-item {
          width: 100%;
          background: #edeeef;
          padding: 30px 40px;
          text-align: center;
        }
        ul {
          padding: 0;
          margin: 0;
        }
        li {
          list-style-type: none;
        }
        .data-item:hover {
          background: #dbdde0;
        }
        .data-item * {
          margin-bottom: 15px;
        }
        .char {
          color: #3281c6;
        }
        .line {
          color: #ed1c24;
        }
      </style>
    </head>
    <body>
      <header class="site-header">
        <h1 class="site-header-title">DedJS</h1>
        <nav>
          <a href="/" class="header-button">All Reports</a>
        </nav>
      </header>
      <main>
          <h1>Here is your report:</h1>
          ${renderItems(d.data)}
        </main>
    </body>
  </html>
`
}

function renderItems (d) {
  let str = ''
  d.forEach(da => {
    let s = ''
    da.details.forEach(dat => {
      s += `<li>${escapeHtml(dat.details)} line: <span class="line">${dat.line}</span> character: <span class="char">${dat.character}</span></li>`
    })
    str +=`<div class="data-item">
  <h3>${da.title}</h3>
  <ul>
    ${s}
  </ul>
</div>`
  })
  return str === '' ? 'No undead code so far.' : str
}

function escapeHtml(unsafe) {
  return unsafe
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");
 }
