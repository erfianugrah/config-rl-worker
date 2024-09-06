const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rate Limit Configuration</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        form { display: grid; gap: 10px; }
        button { cursor: pointer; }
        .fingerprint-options { display: flex; gap: 10px; }
        .fingerprint-list { border: 1px solid #ccc; padding: 10px; min-height: 100px; }
    </style>
</head>
<body>
    <h1>Rate Limit Configuration</h1>
    <form id="configForm">
        <h2>Rate Limit</h2>
        <label for="limit">Request Limit:</label>
        <input type="number" id="limit" name="rateLimit.limit" required>

        <label for="period">Time Period (seconds):</label>
        <input type="number" id="period" name="rateLimit.period" required>

        <h2>Request Matching</h2>
        <label for="hostname">Hostname:</label>
        <input type="text" id="hostname" name="requestMatch.hostname" required>

        <label for="path">Path (leave empty to match all paths):</label>
        <input type="text" id="path" name="requestMatch.path">

        <h2>Fingerprint</h2>
        <div class="fingerprint-options">
            <div>
                <h3>Baseline Parameters</h3>
                <select id="baselineFingerprint">
                    <option value="cf.tlsVersion">TLS Version</option>
                    <option value="cf.tlsCipher">TLS Cipher</option>
                    <option value="cf.ja4">JA4</option>
                    <option value="clientIP">Client IP</option>
                    <option value="cf.asn">ASN</option>
                    <option value="user-agent">User Agent</option>
                    <option value="cf-device-type">Device Type</option>
                </select>
                <button type="button" id="addBaseline">Add</button>
                <div id="baselineList" class="fingerprint-list"></div>
            </div>
            <div>
                <h3>Additional Parameters</h3>
                <select id="additionalFingerprint">
                    <option value="cf.asn">ASN</option>
                    <option value="user-agent">User Agent</option>
                    <option value="cf-device-type">Device Type</option>
                    <option value="cf.tlsVersion">TLS Version</option>
                    <option value="cf.tlsCipher">TLS Cipher</option>
                    <option value="cf.ja4">JA4</option>
                    <option value="clientIP">Client IP</option>
                </select>
                <button type="button" id="addAdditional">Add</button>
                <div id="additionalList" class="fingerprint-list"></div>
            </div>
        </div>

        <button type="submit">Save Configuration</button>
    </form>
    <div id="message"></div>
</body>
</html>
`;

const script = `
<script>
  const baselineList = document.getElementById('baselineList');
  const additionalList = document.getElementById('additionalList');
  const baselineSelect = document.getElementById('baselineFingerprint');
  const additionalSelect = document.getElementById('additionalFingerprint');

  function addToList(list, value) {
    const item = document.createElement('div');
    item.textContent = value;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => list.removeChild(item);
    item.appendChild(removeBtn);
    list.appendChild(item);
  }

  document.getElementById('addBaseline').onclick = () => addToList(baselineList, baselineSelect.value);
  document.getElementById('addAdditional').onclick = () => addToList(additionalList, additionalSelect.value);

  document.getElementById('configForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const config = {};
    for (let [key, value] of formData.entries()) {
      const keys = key.split('.');
      let current = config;
      for (let i = 0; i < keys.length; i++) {
        if (i === keys.length - 1) {
          current[keys[i]] = value;
        } else {
          current[keys[i]] = current[keys[i]] || {};
          current = current[keys[i]];
        }
      }
    }

    // Add fingerprint configuration
    config.fingerprint = {
      baseline: Array.from(baselineList.children).map(child => child.textContent.split('Remove')[0].trim()),
      additional: Array.from(additionalList.children).map(child => child.textContent.split('Remove')[0].trim())
    };

    try {
      const response = await fetch('/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        document.getElementById('message').textContent = 'Configuration saved successfully!';
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      document.getElementById('message').textContent = 'Error: ' + error.message;
    }
  });

  // Load existing configuration
  fetch('/config').then(response => response.json()).then(config => {
    for (const [section, values] of Object.entries(config)) {
      for (const [key, value] of Object.entries(values)) {
        const inputName = section + '.' + key;
        const input = document.querySelector('[name="' + inputName + '"]');
        if (input) {
          input.value = value;
        }
      }
    }

    // Load fingerprint configuration
    if (config.fingerprint) {
      if (config.fingerprint.baseline) {
        config.fingerprint.baseline.forEach(param => addToList(baselineList, param));
      }
      if (config.fingerprint.additional) {
        config.fingerprint.additional.forEach(param => addToList(additionalList, param));
      }
    }
  });
</script>
`;

// Combine HTML and script
const updatedHtml = html.replace('</body>', `${script}</body>`);

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/' && request.method === 'GET') {
    return new Response(updatedHtml, {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const configStorageId = env.CONFIG_STORAGE.idFromName('global');
  const configStorage = env.CONFIG_STORAGE.get(configStorageId);
  return configStorage.fetch(request);
}
