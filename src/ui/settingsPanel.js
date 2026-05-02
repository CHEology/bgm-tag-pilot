export function createSettingsPanel({ mount, settings }) {
  if (!mount || !settings) {
    return null;
  }

  const panel = document.createElement('details');
  panel.className = 'tagpilot-settings';

  const summary = document.createElement('summary');
  summary.textContent = 'TagPilot rules';

  const note = document.createElement('p');
  note.textContent = 'Rule toggles will be added in a later version.';

  panel.append(summary, note);
  mount.append(panel);

  return panel;
}
