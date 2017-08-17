import * as express from 'express';

const app = express();
app.use('/client', express.static('./dist/client'));

function pageHandler(name: string) {
  const template =
  `<html>
    <head>
      <script type="text/javascript" src="client/app.js"></script>
    </head>
    <body>
      <ul>
        <li><a href="/">home</a></li>
        <li><a href="/foo">foo</a></li>
      </ul>
      <div id="app">${name}</div>
    </body>
  </html>`;
  return function serveApp(req: express.Request, res: express.Response) {
    res.set('Content-Type', 'text/html');
    res.send(template);
  }
}

app.get('/', pageHandler('home'));
app.get('/foo', pageHandler('foo'));

app.listen(3000, function () {
  console.log('Transmogrifier app listening on port 3000!')
});