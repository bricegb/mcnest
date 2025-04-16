async function fetchServers() {
  const res = await fetch('/api/status');
  const servers = await res.json();
  const container = document.getElementById("servers");
  container.innerHTML = "";

  servers.forEach(server => {
    const div = document.createElement("div");
    div.className = "server";
    div.innerHTML = `
      <img class="banner" src="${server.banner}" alt="banner" />
      <div class="server-info">
        <h2>${server.name}</h2>
        <div class="tags">
          ${server.tags.map(tag => `<span class="tag">${tag}</span>`).join(" ")}
        </div>
        <p>Players: ${server.players.online} / ${server.players.max}</p>
        <p>Status: ${server.online ? "✅ Online" : "❌ Offline"}</p>
        <p>IP: ${server.ip}</p>
        ${server.website ? `<a href="${server.website}" target="_blank">🌐 Website</a>` : ""}
        ${server.discord ? `<a href="${server.discord}" target="_blank">💬 Discord</a>` : ""}
      </div>
    `;
    container.appendChild(div);
  });
}
fetchServers();
setInterval(fetchServers, 5 * 60 * 1000);
