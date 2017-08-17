import * as express from 'express';
import { isAdjunct } from './shared/shared';

const app = express();
app.use('/client', express.static('./dist/client'));
app.use('/client/almond.js', express.static('./lib/almond.js'));

function pageHandler(name: string, isAdjunct: boolean = false) {
  const isAdjunctString = isAdjunct ? 'true' : 'false';
  const color = isAdjunct ? 'orange' : 'blue';
  const template =
  `<html>
    <head>
      <style>
        html, body {
          color: ${color};
        }
      </style>
      <script>
        window.IS_ADJUNCT = "${isAdjunctString}";
      </script>
      <script type="text/javascript" src="client/almond.js"></script>
      <script type="text/javascript" src="client/index.js"></script>
      <script>
        require('client/app');
      </script>
    </head>
    <body>
      <ul>
        <li><a href="/">home</a></li>
        <li><a href="/foo">foo</a></li>
        <li><a href="/bar">bar</a></li>
        <li><a href="/baz">baz</a></li>
      </ul>
      <div id="app">${name}</div>
    </body>
  </html>`;
  return function serveApp(req: express.Request, res: express.Response) {
    res.set('Content-Type', 'text/html');
    res.send(template);
  }
}

interface Handler {
  match: (s: string) => boolean;
  callback: (req: express.Request, res: express.Response) => void;
}

function generateHandlers(routes: string[]): Handler[] {
  return routes.map((name) => {
    const path = name === 'home' ? '' : name;
    const routeRegexp = new RegExp(`^\/?${path}\/?$`);
    return {
      match(pathname: string) {
        return !!routeRegexp.exec(pathname);
      },
      callback: pageHandler(name, isAdjunct(name))
    }
  });
}

const handlers = generateHandlers(['home', 'foo', 'bar', 'baz']);

app.get('*', function(req, res) {
  let responded = false;
  for (let i = 0; i < handlers.length; i++) {
    if (handlers[i].match(req.path)) {
      console.log('Matched', req.path, );
      handlers[i].callback(req, res);
      responded = true;
    }
  }

  if (!responded) {
    res.status(404);
  }
});

app.listen(3000, function () {
  console.log('Transmogrifier app listening on port 3000!')
});