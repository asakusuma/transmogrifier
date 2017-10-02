import * as express from 'express';
import { readFileSync } from 'fs';
import { isAdjunct } from './shared/shared';

const app = express();
//app.use('/client', express.static('./dist/client'));
app.use('/client/almond.js', express.static('./lib/almond.js'));

function sendAppJs(res: express.Response, name: string, delay: number = 0) {
  const js = readFileSync(`./dist/client/${name}.js`);
  res.set('Content-Type', 'text/javascript');
  setTimeout(() => {
    res.send(js);
  }, delay);
}

function renderPage(name: string, color: string, isAdjunctString: string, appJs: string, moduleName: string, childAppName?: string) {
  const iframe = childAppName ? `<iframe id="transmogrifier-portal" frameborder="0" seamless="true" style="display:none;" scrolling="no" src="http://localhost:3000/?appName=${childAppName}"></iframe>` : '';
  return `<html>
      <head>
        <style>
          html, body {
            color: ${color};
            background-color: #FFF;
          }
          #transmogrifier-portal {
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            position: absolute;
            width: 100%;
            height: 100%;
          }
        </style>
        <script type="text/javascript" src="client/almond.js"></script>
      </head>
      <body>
        <ul>
          <li><a href="/">home</a></li>
          <li><a href="/bulls">bulls</a></li>
          <li><a href="/warriors">warriors</a></li>
          <li><a href="/wizards">wizards</a></li>
          <li><a href="/cavs">cavs</a></li>
          <li><a href="/nets">nets</a></li>
          <li><a href="/pistons">pistons</a></li>
          <li><a href="/knicks">knicks</a></li>
        </ul>
        <div id="app">${name}</div>
        ${iframe}
        <script type="text/javascript" src="${appJs}"></script>
        <script>
          var boot = require('${moduleName}');
          boot['default'](window, document.getElementById('transmogrifier-portal'), ${isAdjunctString});
        </script>
      </body>
    </html>`;
}

function pageHandler(name: string, isAdj: boolean = false) {
  return function serveApp(req: express.Request, res: express.Response, appName?: AppName) {
    const isAdjunct = isAdj || (appName && appName === 'adjunct');
    const isAdjunctString = isAdjunct  ? 'true' : 'false';
    const color = isAdjunct ? 'orange' : 'blue';
    const childAppName: AppName = appName ? null : (!isAdjunct ? 'adjunct' : 'incumbent');
    const appJs = childAppName ? 'parent.js' : 'child.js';
    const moduleName = childAppName ? 'client/parent' : 'client/child';

    const wait = childAppName ? 0: 2000;

    setTimeout(() => {
      res.set('Content-Type', 'text/html');
      res.send(renderPage(name, color, isAdjunctString, appJs, moduleName, childAppName));
    }, wait);
  }
}

interface Handler {
  match: (s: string) => boolean;
  callback: (req: express.Request, res: express.Response, appName?: AppName) => void;
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

const handlers = generateHandlers(['home', 'bulls', 'warriors', 'wizards', 'cavs', 'nets', 'pistons', 'knicks']);

app.get('/sw.js', function(req, res) {
  res.status(404).send();
});

app.get('/parent.js', function(req, res) {
  sendAppJs(res, 'parent');
});
app.get('/child.js', function(req, res) {
  sendAppJs(res, 'child', 2000);
});

type AppName = 'adjunct' | 'incumbent';

function sanitizeAppNameDirective(directive: string): AppName {
  if (typeof directive !== 'string' || !directive) {
    return null;
  }
  if (directive === 'adjunct') {
    return 'adjunct';
  }
  return 'incumbent';
}

app.get('*', function(req, res) {
  let responded = false;
  const forceAppName = req.query.appName;
  for (let i = 0; i < handlers.length; i++) {
    if (handlers[i].match(req.path)) {
      handlers[i].callback(req, res, sanitizeAppNameDirective(forceAppName));
      responded = true;
    }
  }

  if (!responded) {
    res.status(404).end();
  }
});

app.listen(3000, function () {
  console.log('Transmogrifier app listening on port 3000!')
});