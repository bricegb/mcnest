async function fetchServers() {
  const res = await fetch('/api/status');
  const servers = await res.json();
  const container = document.getElementById("servers");
  container.innerHTML = "";

  servers.forEach(server => {
    const div = document.createElement("div");
    div.className = "server";
    div.innerHTML = `
      <h2>${server.name}</h2>
      <p>Players: ${server.players.online} / ${server.players.max}</p>
      <p>Status: ${server.online ? "✅ Online" : "❌ Offline"}</p>
    `;
    container.appendChild(div);
  });
}
fetchServers();