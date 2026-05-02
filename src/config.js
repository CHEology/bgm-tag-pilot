export const DEFAULT_CONFIG = {
  appName: 'Bangumi TagPilot',
  displayName: 'Bangumi 智能标签助手',
  version: '0.1.0',
  storageKey: 'bangumi-tagpilot-settings',
  logPrefix: '[TagPilot]',
  maxSuggestions: 12,
  defaultSettings: {
    enabled: true,
    rules: {
      subjectType: true,
      publicTags: true,
    },
  },
};
