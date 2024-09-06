import { handleRequest } from './ui.js';
import { ConfigStorage } from './config-storage.js';

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  },
};

export { ConfigStorage };
