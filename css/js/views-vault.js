export function renderVault(ctx) {
  const { contentEl } = ctx;

  contentEl.innerHTML = `
    <div class="panel" style="max-width: 820px;">
      <div class="panel-head">VAULT STAKING</div>
      <div class="panel-body">
        <div class="muted">
          This module is ready for your staking vault contract (stake/unstake/claim).
          After you paste the vault address + ABI into <strong>js/config.js</strong>, we’ll wire these buttons.
        </div>

        <div style="height:16px"></div>

        <div class="input-box">
          <div class="input-label">STAKE AMOUNT (PFXAI)</div>
          <input id="stakeAmount" type="number" placeholder="0.00" />
        </div>

        <div class="row">
          <button class="primary-btn" id="stakeBtn">STAKE</button>
          <button class="ghost-btn" id="unstakeBtn">UNSTAKE</button>
          <button class="ghost-btn" id="claimBtn">CLAIM</button>
        </div>

        <div id="vaultStatus" class="muted small" style="margin-top:12px;"></div>
      </div>
    </div>
  `;
}
