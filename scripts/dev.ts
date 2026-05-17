const root = new URL("..", import.meta.url).pathname;

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

function formatKillHint(): string {
  return "  bun run dev:stop";
}

const blocked = [
  { name: "frontend (Vite)", port: WEB_PORT, pids: pidsOnPort(WEB_PORT) },
  { name: "API", port: API_PORT, pids: pidsOnPort(API_PORT) },
].filter((entry) => entry.pids.length > 0);

if (blocked.length > 0) {
  console.error("Cannot start dev — port(s) already in use:\n");
  for (const { name, port, pids } of blocked) {
    console.error(`  ${name}: port ${port} (PID ${pids.join(", ")})`);
  }
  console.error(`\nStop the old process(es), then retry:\n${formatKillHint()}`);
  process.exit(1);
}

const children = [
  Bun.spawn({
    cmd: ["bun", "run", "dev"],
    cwd: `${root}/artifacts/api-server`,
    stdout: "inherit",
    stderr: "inherit",
    env: { ...process.env, NODE_ENV: "development" },
  }),
  Bun.spawn({
    cmd: ["bun", "run", "dev"],
    cwd: `${root}/artifacts/itcodecraft`,
    stdout: "inherit",
    stderr: "inherit",
  }),
];

const shutdown = (signal: NodeJS.Signals) => {
  for (const child of children) {
    child.kill(signal);
  }
};

process.on("SIGINT", () => {
  shutdown("SIGINT");
  process.exit(130);
});
process.on("SIGTERM", () => {
  shutdown("SIGTERM");
  process.exit(143);
});

const [apiExit, webExit] = await Promise.all(
  children.map((child) => child.exited),
);

if (apiExit !== 0) process.exit(apiExit);
if (webExit !== 0) process.exit(webExit);
