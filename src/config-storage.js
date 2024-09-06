export class ConfigStorage {
  constructor(state, env) {
    this.state = state;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'POST' && path === '/config') {
      const config = await request.json();
      await this.state.storage.put('config', JSON.stringify(config));
      return new Response('Config saved', { status: 200 });
    } else if (request.method === 'GET' && path === '/config') {
      const config = await this.state.storage.get('config');
      return new Response(config || '{}', {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  }
}
