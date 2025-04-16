import { readFile } from 'fs/promises';

export default async function handler(req, res) {
  const servers = JSON.parse(await readFile('./data/servers.json', 'utf-8'));
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
  res.end(JSON.stringify(responses));
}