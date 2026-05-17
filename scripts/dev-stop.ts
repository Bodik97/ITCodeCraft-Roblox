const WEB_PORT = 5173;
const API_PORT = Number(process.env.PORT ?? "5001");

function pidsOnPort(port: number): number[] {
  const result = Bun.spawnSync(["lsof", "-ti", `tcp:${port}`]);
  if (result.exitCode !== 0) return [];
  const text = result.stdout.toString().trim();
  if (!text) return [];
  return text
    .split("\n")
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id));
}

let stopped = false;

for (const port of [WEB_PORT, API_PORT]) {
  const pids = pidsOnPort(port);
  if (pids.length === 0) continue;

  for (const pid of pids) {
    try {
      process.kill(pid, "SIGTERM");
      console.log(`Stopped PID ${pid} on port ${port}`);
      stopped = true;
    } catch {
      console.warn(`Could not stop PID ${pid} on port ${port}`);
    }
  }
}

if (!stopped) {
  console.log(`Nothing listening on ports ${WEB_PORT} or ${API_PORT}.`);
}
