const http = require("http");
const url = require("url");

function getId(url, timestamp, serverUrl) {
    if (timestamp) {
        const transactions = fetch(`${serverUrl}/query{transactions(tags:{name:"page:url",values:[${url}]}){edges{node{id tags{name value}}}}}`).data.data.transactions.edges;
        for (i of transactions) {
            const node = i.node;
            archives += {id: node.id, timeDistance: Math.abs(timestamp - node.tags[4].value)};
        }
        return archives.sort((a, b) => a.timeDistance - b.timeDistance)[0].id;
    }
    else return fetch(`${serverUrl}{transactions(tags:{name:"page:url",values:[${url}]}){edges{node{id}}}}`).data.data.transactions.edges[0].node.id;
}

http.createServer(function (req, res) {
  res.writeHead(200, {"Content-Type": "text/html"});
  const q = url.parse(req.url, true).query;
  fetch(`${serverUrl}/${getId(q.url, q.timestamp, serverUrl)}`);
}).listen(8080);