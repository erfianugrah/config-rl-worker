// config-ui.js

export function serveConfigurationUI(env) {
  const configUIContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rate Limit Configuration</title>
    <style>
        :root {
            color-scheme: light dark;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f0f2f5;
            color: #555;
            transition: background-color 0.3s, color 0.3s;
        }
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #333;
                color: #f0f2f5;
            }
        }
        .config-container {
            text-align: left;
            padding: 50px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            background-color: #e0e0e0;
            transition: background-color 0.3s;
        }
        @media (prefers-color-scheme: dark) {
            .config-container {
                background-color: #3c3c3c;
            }
        }
        h1 {
            margin-bottom: 30px;
            font-size: 24px;
            text-align: center;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="number"],
        input[type="text"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .checkbox-group {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .checkbox-item {
            display: flex;
            align-items: center;
        }
        .checkbox-item input {
            margin-right: 5px;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.2s;
        }
        button:hover {
            background-color: #0056b3;
        }
        #message {
            margin-top: 20px;
            text-align: center;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="config-container">
        <h1>Rate Limit Configuration</h1>
        <form id="configForm">
            <div class="form-group">
                <label for="maxTokens">Max Tokens</label>
                <input type="number" id="maxTokens" name="maxTokens" required>
            </div>
            <div class="form-group">
                <label for="refillTime">Refill Time (ms)</label>
                <input type="number" id="refillTime" name="refillTime" required>
            </div>
            <div class="form-group">
                <label>Identifier Options</label>
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="useClientIp" name="useClientIp">
                        <label for="useClientIp">Client IP</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="useAsn" name="useAsn">
                        <label for="useAsn">ASN</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="useJa4" name="useJa4">
                        <label for="useJa4">JA4</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="useJa3" name="useJa3">
                        <label for="useJa3">JA3</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="usePath" name="usePath">
                        <label for="usePath">Request Path</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="useHostname" name="useHostname">
                        <label for="useHostname">Hostname</label>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="headers">Headers (comma-separated)</label>
                <input type="text" id="headers" name="headers">
            </div>
            <button type="submit">Save Configuration</button>
        </form>
        <div id="message"></div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            const form = document.getElementById('configForm');
            const messageDiv = document.getElementById('message');

            // Fetch current configuration
            try {
                const response = await fetch('/config');
                if (response.ok) {
                    const config = await response.json();
                    Object.entries(config).forEach(([key, value]) => {
                        const element = document.getElementById(key);
                        if (element) {
                            if (element.type === 'checkbox') {
                                element.checked = value;
                            } else {
                                element.value = value;
                            }
                        }
                    });
                    if (config.headers) {
                        document.getElementById('headers').value = config.headers.join(', ');
                    }
                }
            } catch (error) {
                console.error('Error fetching configuration:', error);
            }

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const config = Object.fromEntries(formData.entries());

                // Convert checkbox values to booleans
                ['useClientIp', 'useAsn', 'useJa4', 'useJa3', 'usePath', 'useHostname'].forEach(key => {
                    config[key] = formData.get(key) === 'on';
                });

                // Convert headers to array
                config.headers = config.headers ? config.headers.split(',').map(h => h.trim()) : [];

                try {
                    const response = await fetch('/config', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(config),
                    });

                    if (response.ok) {
                        messageDiv.textContent = 'Configuration updated successfully!';
                        messageDiv.style.color = 'green';
                    } else {
                        throw new Error('Failed to update configuration');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    messageDiv.textContent = 'Failed to update configuration. Please try again.';
                    messageDiv.style.color = 'red';
                }
            });
        });
    </script>
</body>
</html>
  `;

  return new Response(configUIContent, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
