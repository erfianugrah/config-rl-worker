import {
  API_ENDPOINTS,
  HTTP_METHODS,
  HTTP_STATUS,
  CONTENT_TYPES,
  STORAGE_KEYS,
  DEFAULTS,
} from './config-variables.js';

export class ConfigStorage {
  constructor(state, env) {
    this.state = state;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === HTTP_METHODS.POST && path === API_ENDPOINTS.CONFIG) {
      const config = await request.json();

      // Ensure rules have an order field
      config.rules = config.rules.map((rule, index) => ({
        ...rule,
        order: rule.order || index + 1,
      }));

      // Sort rules by order before saving
      config.rules.sort((a, b) => a.order - b.order);

      await this.state.storage.put(STORAGE_KEYS.CONFIG, JSON.stringify(config));
      return new Response('Config saved', { status: HTTP_STATUS.OK });
    } else if (request.method === HTTP_METHODS.GET && path === API_ENDPOINTS.CONFIG) {
      const config = await this.state.storage.get(STORAGE_KEYS.CONFIG);
      return new Response(config || DEFAULTS.EMPTY_CONFIG, {
        headers: { 'Content-Type': CONTENT_TYPES.JSON },
      });
    }

    return new Response('Not Found', { status: HTTP_STATUS.NOT_FOUND });
  }
}
