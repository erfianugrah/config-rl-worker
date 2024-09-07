const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rate Limit Configuration</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8 text-center">Rate Limit Configuration</h1>
        <form id="configForm" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-4">Rate Limit</h2>
                <div class="flex space-x-4">
                    <div class="w-1/2">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="limit">
                            Request Limit:
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="limit" name="rateLimit.limit" type="number" required>
                    </div>
                    <div class="w-1/2">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="period">
                            Time Period (seconds):
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="period" name="rateLimit.period" type="number" required>
                    </div>
                </div>
            </div>

            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-4">Request Matching</h2>
                <div class="flex space-x-4">
                    <div class="w-1/2">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="hostname">
                            Hostname:
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="hostname" name="requestMatch.hostname" type="text" required>
                    </div>
                    <div class="w-1/2">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="path">
                            Path (leave empty to match all paths):
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="path" name="requestMatch.path" type="text">
                    </div>
                </div>
            </div>

            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-4">Fingerprint</h2>
                <div class="flex space-x-4">
                    <div class="w-1/2">
                        <h3 class="text-lg font-medium mb-2">Baseline Parameters</h3>
                        <select id="baselineFingerprint" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
                            <option value="cf.tlsVersion">TLS Version</option>
                            <option value="cf.tlsCipher">TLS Cipher</option>
                            <option value="cf.ja4">JA4</option>
                            <option value="clientIP">Client IP</option>
                            <option value="cf.asn">ASN</option>
                            <option value="user-agent">User Agent</option>
                            <option value="cf-device-type">Device Type</option>
                        </select>
                        <button type="button" id="addBaseline" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add</button>
                        <div id="baselineList" class="mt-4 p-2 border rounded min-h-[100px]"></div>
                    </div>
                    <div class="w-1/2">
                        <h3 class="text-lg font-medium mb-2">Additional Parameters</h3>
                        <select id="additionalFingerprint" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
                            <option value="cf.asn">ASN</option>
                            <option value="user-agent">User Agent</option>
                            <option value="cf-device-type">Device Type</option>
                            <option value="cf.tlsVersion">TLS Version</option>
                            <option value="cf.tlsCipher">TLS Cipher</option>
                            <option value="cf.ja4">JA4</option>
                            <option value="clientIP">Client IP</option>
                        </select>
                        <button type="button" id="addAdditional" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add</button>
                        <div id="additionalList" class="mt-4 p-2 border rounded min-h-[100px]"></div>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between">
                <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Save Configuration
                </button>
            </div>
        </form>
        <div id="message" class="mt-4 text-center font-bold"></div>
    </div>
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
        item.className = 'flex justify-between items-center mb-2 p-2 bg-gray-100 rounded';
        item.innerHTML = \`
            <span>\${value}</span>
            <button type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs">Remove</button>
        \`;
        item.querySelector('button').onclick = () => list.removeChild(item);
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
            baseline: Array.from(baselineList.children).map(child => child.textContent.trim()),
            additional: Array.from(additionalList.children).map(child => child.textContent.trim())
        };

        try {
            const response = await fetch('/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (response.ok) {
                document.getElementById('message').textContent = 'Configuration saved successfully!';
                document.getElementById('message').className = 'mt-4 text-center font-bold text-green-600';
            } else {
                throw new Error('Failed to save configuration');
            }
        } catch (error) {
            document.getElementById('message').textContent = 'Error: ' + error.message;
            document.getElementById('message').className = 'mt-4 text-center font-bold text-red-600';
        }
    });

    // Load existing configuration
    fetch('/config').then(response => response.json()).then(config => {
        for (const [section, values] of Object.entries(config)) {
            for (const [key, value] of Object.entries(values)) {
                const inputName = \`\${section}.\${key}\`;
                const input = document.querySelector(\`[name="\${inputName}"]\`);
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
