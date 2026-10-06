'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const base = __dirname;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.jpeg':'image/jpeg','.jpg':'image/jpeg','.png':'image/png','.pdf':'application/pdf','.md':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  let filename;
  try {const url=new URL(req.url,'http://localhost');const raw=decodeURIComponent(url.pathname);filename=path.resolve(base,'.'+(raw==='/'?'/index.html':raw));} catch {res.writeHead(400);res.end('Bad request');return;}
  if(!filename.startsWith(base+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  fs.stat(filename,(err,stat)=>{
    if(err||!stat.isFile()){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','Content-Length':stat.size});
    if(req.method==='HEAD')res.end();else fs.createReadStream(filename).pipe(res);
  });
});
server.listen(8080,'127.0.0.1',()=>console.log('Open http://localhost:8080'));
