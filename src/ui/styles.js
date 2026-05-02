const STYLE_ID = 'bangumi-tagpilot-style';

export function injectStyles(root = document) {
  if (root.getElementById(STYLE_ID)) {
    return;
  }

  const style = root.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
.tagpilot-panel {
  border: 1px solid #e3e3e3;
  border-radius: 6px;
  margin: 10px 0;
  padding: 10px;
  background: #fff;
  color: #444;
  font-size: 12px;
}
.tagpilot-panel h3 {
  font-size: 13px;
  margin: 0 0 8px;
}
.tagpilot-suggestion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.tagpilot-suggestion {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  padding: 3px 6px;
  background: #f8f8f8;
  cursor: pointer;
}
.tagpilot-suggestion small {
  color: #888;
}
.tagpilot-panel button {
  border: 1px solid #aaa;
  border-radius: 4px;
  padding: 4px 8px;
  background: #f4f4f4;
  color: #333;
  cursor: pointer;
}
.tagpilot-panel button:disabled {
  cursor: default;
  opacity: 0.55;
}
.tagpilot-settings {
  margin: 8px 0;
  color: #666;
  font-size: 12px;
}
`;

  root.head?.append(style);
}
