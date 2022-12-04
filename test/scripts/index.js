//distance search for graphql queries
const url = require("url");

function getId(url, timestamp, serverUrl) {
  if (timestamp) {
      const transactions = fetch(`${serverUrl}/query{transactions(tags:{name:"page:url",values:[${url}]}){edges{node{id tags{name value}}}}}`).data.data.transactions.edges;
      for (i of transactions) {
          const node = i.node;
          archives += {id: node.id, timeDistance: Math.abs(timestamp - node.tags[4].value)};
      }
      res = archives.sort((a, b) => a.timeDistance - b.timeDistance)[0].id;
  }
  else res = fetch(`${serverUrl}{transactions(tags:{name:"page:url",values:[${url}]}){edges{node{id}}}}`).data.data.transactions.edges[0].node.id;
  return res;
}

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (first) {
      const q = url.parse(details.url, true).query;
      (async () => {return redirectUrl(`https://arweave.net/${getId(q.url, q.timestamp, serverUrl)}`)})();
    }
  }
);