import { html } from './config-html.js';
import { uiScript } from './config-utils.js';
import { CONTENT_TYPES } from './config-variables.js';

// Combine HTML and script
const updatedHtml = html.replace('</body>', `${uiScript}</body>`);

export function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/' && request.method === 'GET') {
    return new Response(updatedHtml, {
      headers: { 'Content-Type': CONTENT_TYPES.HTML },
    });
  }

  const configStorageId = env.CONFIG_STORAGE.idFromName('global');
  const configStorage = env.CONFIG_STORAGE.get(configStorageId);
  return configStorage.fetch(request);
}
