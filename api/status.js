const fs = require('fs');
const path = require('path');
const https = require('https');

module.exports = async (req, res) => {
  const dataPath = path.join(__dirname, '../data/servers.json');

  try {
    const json = fs.readFileSync(dataPath, 'utf-8');
    const servers = JSON.parse(json);

    const results = await Promise.all(
      servers.map(server => {
        return new Promise((resolve) => {
          https.get(`https://api.mcstatus.io/v2/status/java/${server.ip}`, (resp) => {
            let data = '';
            resp.on('data', chunk => data += chunk);
            resp.on('end', () => {
              try {
                const status = JSON.parse(data);
                resolve({
                  ...server,
                  online: status.online,
                  players: status.players
                });
              } catch (err) {
                resolve({
                  ...server,
                  online: false,
                  players: { online: 0, max: 0 }
                });
              }
            });
          }).on("error", () => {
            resolve({
              ...server,
              online: false,
              players: { online: 0, max: 0 }
            });
          });
        });
      })
    );

    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(results));
  } catch (err) {
    res.status(500).json({ error: "Could not load servers.json", message: err.message });
  }
};
