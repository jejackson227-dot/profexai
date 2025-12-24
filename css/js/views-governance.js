export function renderGovernance(ctx) {
  ctx.contentEl.innerHTML = `
    <div class="panel" style="max-width: 920px;">
      <div class="panel-head">GOVERNANCE</div>
      <div class="panel-body">
        <div class="muted">
          Proposal feed + voting will go here (Governor contract + token voting power).
          After you provide the Governor contract address + ABI, we’ll hook this up.
        </div>
      </div>
    </div>
  `;
}
