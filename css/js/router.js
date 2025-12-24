import { renderTerminal } from "./views-terminal.js";
import { renderVault } from "./views-vault.js";
import { renderGovernance } from "./views-governance.js";
import { renderAgents } from "./views-agents.js";

const routes = {
  terminal: renderTerminal,
  vault: renderVault,
  governance: renderGovernance,
  agents: renderAgents,
};

export function renderRoute(routeName, ctx) {
  const fn = routes[routeName] || routes.terminal;
  fn(ctx);
}
