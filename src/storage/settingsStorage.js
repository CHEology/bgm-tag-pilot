import { DEFAULT_CONFIG } from '../config.js';

export function loadSettings() {
  try {
    const raw = window.localStorage?.getItem(DEFAULT_CONFIG.storageKey);
    if (!raw) {
      return cloneDefaultSettings();
    }

    return {
      ...cloneDefaultSettings(),
      ...JSON.parse(raw),
    };
  } catch {
    return cloneDefaultSettings();
  }
}

export function saveSettings(settings) {
  try {
    window.localStorage?.setItem(DEFAULT_CONFIG.storageKey, JSON.stringify(settings));
  } catch {
    // Ignore storage failures. TagPilot should keep working as a local preview tool.
  }
}

function cloneDefaultSettings() {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG.defaultSettings));
}
