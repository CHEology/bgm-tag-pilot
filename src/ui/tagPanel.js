export function createTagPanel({ mount, suggestions, onInsert }) {
  if (!mount || !Array.isArray(suggestions)) {
    return null;
  }

  if (Array.from(mount.children).some((child) => child.classList.contains('tagpilot-panel'))) {
    return null;
  }

  const panel = document.createElement('section');
  panel.className = 'tagpilot-panel';
  panel.setAttribute('aria-label', 'Bangumi TagPilot suggestions');

  const title = document.createElement('h3');
  title.textContent = 'TagPilot 标签建议';
  panel.append(title);

  const list = document.createElement('div');
  list.className = 'tagpilot-suggestion-list';

  for (const suggestion of suggestions) {
    const label = document.createElement('label');
    label.className = 'tagpilot-suggestion';
    label.title = suggestion.reason;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = suggestion.tag;

    const text = document.createElement('span');
    text.textContent = suggestion.tag;

    const reason = document.createElement('small');
    reason.textContent = suggestion.label ?? suggestion.ruleId;

    label.append(checkbox, text, reason);
    list.append(label);
  }

  if (suggestions.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'tagpilot-empty';
    empty.textContent = '暂无可插入的单词标签建议';
    list.append(empty);
  }

  const insertButton = document.createElement('button');
  insertButton.type = 'button';
  insertButton.disabled = true;
  insertButton.textContent = '插入选中';

  list.addEventListener('change', () => {
    insertButton.disabled = !list.querySelector('input[type="checkbox"]:checked');
  });

  insertButton.addEventListener('click', () => {
    const selectedTags = Array.from(list.querySelectorAll('input[type="checkbox"]:checked'))
      .map((input) => input.value);
    onInsert(selectedTags);
  });

  panel.append(list, insertButton);
  mount.append(panel);

  return panel;
}
