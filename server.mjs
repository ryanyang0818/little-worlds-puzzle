import http from 'node:http';
import { readFile } from 'node:fs/promises';
const port = Number(process.env.PORT || 8765);
const files = new Map([
  ['/', ['index.html', 'text/html']], ['/index.html', ['index.html', 'text/html']],
  ['/puzzle.css', ['puzzle.css', 'text/css']], ['/puzzle.js', ['puzzle.js', 'text/javascript']],
  ['/models.js', ['models.js', 'text/javascript']],
  ['/vendor/three.module.js', ['vendor/three.module.js', 'text/javascript']],
  ['/vendor/three.core.js', ['vendor/three.core.js', 'text/javascript']],
]);
// 僅提供遊戲的靜態檔案，不公開其他專案資料。
async function handleRequest(request, response) {
  const file = files.get(new URL(request.url, 'http://localhost').pathname);
  if (!file || request.method !== 'GET') {
    response.writeHead(404);
    response.end('Not found');
    return;
  }
  try {
    const content = await readFile(new URL(file[0], import.meta.url));
    response.writeHead(200, {
      'Content-Type': `${file[1]}; charset=utf-8`, 'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff', 'Permissions-Policy': 'camera=(), microphone=()',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'",
    });
    response.end(content);
  } catch {
    response.writeHead(500);
    response.end('Unable to load game');
  }
}
// 在本機啟動不需要金鑰的立體拼圖遊戲。
function onListening() {
  console.log(`Little Worlds: http://127.0.0.1:${port}`);
}
http.createServer(handleRequest).listen(port, '127.0.0.1', onListening);
