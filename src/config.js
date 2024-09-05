// index.js
import { serveConfigurationUI } from './config-ui.js';

export class ConfigurationDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/config') {
      return request.method === 'GET' ? this.getConfig() : this.setConfig(request);
    }

    // Serve the HTML configuration page for any other route
    return serveConfigurationUI(this.env);
  }

  async getConfig() {
    const config = await this.state.storage.get('rateLimit');
    if (!config) {
      return new Response(
        JSON.stringify({
          maxTokens: 60,
          refillTime: 60000,
          useClientIp: true,
          useAsn: false,
          useJa4: false,
          useJa3: false,
          usePath: false,
          useHostname: false,
          headers: [],
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    return new Response(config, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async setConfig(request) {
    const config = await request.json();
    if (!config.maxTokens || !config.refillTime) {
      return new Response('Invalid configuration', { status: 400 });
    }

    // Ensure refillTime is stored in seconds
    config.refillTime = parseInt(config.refillTime, 10);
    if (isNaN(config.refillTime) || config.refillTime <= 0) {
      return new Response('Invalid refillTime value', { status: 400 });
    }

    await this.state.storage.put('rateLimit', JSON.stringify(config));
    return new Response('Configuration updated', { status: 200 });
  }
}

export default {
  async fetch(request, env, ctx) {
    const id = env.CONFIGURATION_DO.idFromName('config');
    const obj = env.CONFIGURATION_DO.get(id);
    return obj.fetch(request);
  },
};
