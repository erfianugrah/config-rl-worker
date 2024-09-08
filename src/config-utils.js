import {
  LABELS,
  MESSAGES,
  API_ENDPOINTS,
  HTTP_METHODS,
  CONTENT_TYPES,
  FINGERPRINT_PARAMS,
  FINGERPRINT_TOOLTIPS,
} from './config-variables.js';

export const uiScript = `
<script>
    let ruleCounter = 0;

    const tooltips = ${JSON.stringify(FINGERPRINT_TOOLTIPS)};

    function createRuleForm() {
        ruleCounter++;
        const ruleForm = document.createElement('div');
        ruleForm.className = 'bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4';
        ruleForm.innerHTML = \`
            <h3 class="text-lg font-semibold mb-4">Rule \${ruleCounter}</h3>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="ruleOrder\${ruleCounter}">
                    ${LABELS.ORDER}
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ruleOrder\${ruleCounter}" name="rules[\${ruleCounter}].order" type="number" value="\${ruleCounter}" required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="ruleName\${ruleCounter}">
                    ${LABELS.RULE_NAME}
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ruleName\${ruleCounter}" name="rules[\${ruleCounter}].name" type="text" required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="ruleDescription\${ruleCounter}">
                    ${LABELS.DESCRIPTION}
                </label>
                <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ruleDescription\${ruleCounter}" name="rules[\${ruleCounter}].description"></textarea>
            </div>
            <div class="mb-4">
                <h4 class="text-md font-semibold mb-2">Rate Limit</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="limit\${ruleCounter}">
                            ${LABELS.REQUEST_LIMIT}
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="limit\${ruleCounter}" name="rules[\${ruleCounter}].rateLimit.limit" type="number" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="period\${ruleCounter}">
                            ${LABELS.TIME_PERIOD}
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="period\${ruleCounter}" name="rules[\${ruleCounter}].rateLimit.period" type="number" required>
                    </div>
                </div>
            </div>
            <div class="mb-4">
                <h4 class="text-md font-semibold mb-2">Request Matching</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="hostname\${ruleCounter}">
                            ${LABELS.HOSTNAME}
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="hostname\${ruleCounter}" name="rules[\${ruleCounter}].requestMatch.hostname" type="text" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="path\${ruleCounter}">
                            ${LABELS.PATH}
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="path\${ruleCounter}" name="rules[\${ruleCounter}].requestMatch.path" type="text">
                    </div>
                </div>
            </div>
            <div class="mb-4">
                <h4 class="text-md font-semibold mb-2">${LABELS.FINGERPRINT_PARAMS}</h4>
                <div class="mb-4">
                    <p class="text-sm text-gray-600">${MESSAGES.CLIENT_IP_INCLUDED}</p>
                </div>
                <div>
                    <select id="fingerprintParam\${ruleCounter}" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
                        ${FINGERPRINT_PARAMS.map((param) => `<option value="${param.value}">${param.label}</option>`).join('')}
                    </select>
                    <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onclick="addFingerprint(\${ruleCounter})">Add</button>
                    <div id="fingerprintList\${ruleCounter}" class="mt-4 p-2 border rounded min-h-[100px]"></div>
                </div>
            </div>
            <button type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onclick="removeRule(this)">
                Remove Rule
            </button>
        \`;
        document.getElementById('rulesContainer').appendChild(ruleForm);
    }

    function removeRule(button) {
        button.closest('.bg-white').remove();
    }

    function addFingerprint(ruleIndex) {
        const select = document.getElementById(\`fingerprintParam\${ruleIndex}\`);
        const list = document.getElementById(\`fingerprintList\${ruleIndex}\`);
        addToList(list, select.value, ruleIndex);
    }

    function addToList(list, value, ruleIndex) {
        const item = document.createElement('div');
        item.className = 'flex justify-between items-center mb-2 p-2 bg-gray-100 rounded';
        item.innerHTML = \`
            <span>\${value}</span>
            <input type="hidden" name="rules[\${ruleIndex}].fingerprint.parameters[]" value="\${value}">
            <button type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs">Remove</button>
        \`;
        item.querySelector('button').onclick = () => list.removeChild(item);
        list.appendChild(item);

        const tooltip = document.createElement('div');
tooltip.className = 'hidden absolute z-10 p-2 bg-gray-800 text-white text-sm rounded shadow-lg';
        tooltip.textContent = tooltips[value] || 'No description available';
        item.appendChild(tooltip);

        item.querySelector('span').onmouseenter = () => tooltip.classList.remove('hidden');
        item.querySelector('span').onmouseleave = () => tooltip.classList.add('hidden');
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('addRule').onclick = createRuleForm;

        document.getElementById('configForm').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const config = {
                rules: []
            };
            for (let [key, value] of formData.entries()) {
                if (key.startsWith('rules[')) {
                    const match = key.match(/rules\\[(\\d+)\\]\\.(.+)/);
                    if (match) {
                        const [, index, path] = match;
                        if (!config.rules[index]) config.rules[index] = {};
                        const keys = path.split('.');
                        let current = config.rules[index];
                        for (let i = 0; i < keys.length; i++) {
                            if (i === keys.length - 1) {
                                if (keys[i] === 'parameters[]') {
                                    current['parameters'] = current['parameters'] || [];
                                    current['parameters'].push(value);
                                } else {
                                    current[keys[i]] = value;
                                }
                            } else {
                                current[keys[i]] = current[keys[i]] || {};
                                current = current[keys[i]];
                            }
                        }
                    }
                }
            }

            // Remove empty slots from the rules array and sort by order
            config.rules = config.rules.filter(Boolean).sort((a, b) => parseInt(a.order) - parseInt(b.order));

            try {
                const response = await fetch('${API_ENDPOINTS.CONFIG}', {
                    method: '${HTTP_METHODS.POST}',
                    headers: { 'Content-Type': '${CONTENT_TYPES.JSON}' },
                    body: JSON.stringify(config)
                });

                if (response.ok) {
                    document.getElementById('message').textContent = '${MESSAGES.CONFIG_SAVED}';
                    document.getElementById('message').className = 'mt-4 text-center font-bold text-green-600';
                } else {
                    throw new Error('Failed to save configuration');
                }
            } catch (error) {
                document.getElementById('message').textContent = '${MESSAGES.SAVE_ERROR}' + error.message;
                document.getElementById('message').className = 'mt-4 text-center font-bold text-red-600';
            }
        };

        // Load existing configuration
        fetch('${API_ENDPOINTS.CONFIG}').then(response => response.json()).then(config => {
            if (config.rules && config.rules.length > 0) {
                // Clear existing rules before populating
                document.getElementById('rulesContainer').innerHTML = '';
                ruleCounter = 0;
                config.rules.forEach((rule) => {
                    createRuleForm();
                    document.getElementById(\`ruleName\${ruleCounter}\`).value = rule.name || '';
                    document.getElementById(\`ruleDescription\${ruleCounter}\`).value = rule.description || '';
                    for (const [section, values] of Object.entries(rule)) {
                        for (const [key, value] of Object.entries(values)) {
                            if (section === 'fingerprint' && key === 'parameters') {
                                const list = document.getElementById(\`fingerprintList\${ruleCounter}\`);
                                value.forEach(param => addToList(list, param, ruleCounter));
                            } else {
                                const inputName = \`rules[\${ruleCounter}].\${section}.\${key}\`;
                                const input = document.querySelector(\`[name="\${inputName}"]\`);
                                if (input) {
                                    input.value = value;
                                }
                            }
                        }
                    }
                });
            } else {
                createRuleForm(); // Create an initial empty rule form
            }
        }).catch(error => {
            console.error('Error loading configuration:', error);
            document.getElementById('message').textContent = '${MESSAGES.LOAD_ERROR}';
            document.getElementById('message').className = 'mt-4 text-center font-bold text-red-600';
        });
    });
</script>
`;
