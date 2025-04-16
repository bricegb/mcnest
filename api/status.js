import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/servers.json');

export default async function handler(req, res) {
  try {
    const json = await readFile(dataPath, 'utf-8');
    const servers = JSON.parse(json);

    const responses = await Promise.all(servers.map(async (srv) => {
      try {
        const data = await fetch(`https://api.mcstatus.io/v2/status/java/${srv.ip}`);
        const result = await data.json();
        return {
          ...srv,
          players: result.players,
          online: result.online
        };
      } catch (e) {
        return {
          ...srv,
          players: { online: 0, max: 0 },
          online: false
        };
      }
    }));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(responses));
  } catch (err) {
    res.status(500).json({ error: "Server crashed", message: err.message });
  }
}
