const ws = require('ws');
const casual = require('casual');
const PORT = 8082;

const wss = new ws.WebSocketServer({ port: PORT });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('WSS received: %s', data);
  });

  ws.send(
    JSON.stringify({
      type: 'notification',
      payload: {
        text: { code: 'DASHBOARD_PUBLIC', param: { name: 'Presentation du 33' } },
        creationDate: '2023-03-07T15:38:27.902353Z',
        link: null
      },
      id: casual.uuid
    })
  );

  ws.send(
    JSON.stringify({
      type: 'notification',
      payload: {
        text: { code: 'DASHBOARD_PRIVATE', param: { name: 'Presentation de vélo' } },
        creationDate: '2023-03-06T15:38:27.902353Z',
        link: null
      },
      id: casual.uuid
    })
  );

  ws.send(
    JSON.stringify({
      type: 'notification',
      payload: {
        text: { code: 'DASHBOARD_DELETED', param: { name: 'Les stations de vélo' } },
        creationDate: '2023-03-07T18:38:27.902353Z',
        link: '/admin'
      },
      id: casual.uuid
    })
  );

  ws.send(
    JSON.stringify({
      type: 'notification',
      payload: {
        text: { code: 'Ceci est une notification brut', title: 'En brut' },
        creationDate: '2023-03-08T15:38:27.902353Z',
        link: '/admin'
      },
      id: casual.uuid
    })
  );

  console.log('WSS connection established');
});

console.log(`WSS server listening on port http://localhost:${PORT}`);

module.exports = { wss };
