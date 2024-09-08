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
    let dragSrcEl = null;

    const tooltips = ${JSON.stringify(FINGERPRINT_TOOLTIPS)};

    function createRuleForm(rule = {}) {
        ruleCounter++;
        const ruleForm = document.createElement('div');
        ruleForm.className = 'bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4';
        ruleForm.setAttribute('data-id', ruleCounter);
        ruleForm.draggable = true;
        ruleForm.innerHTML = \`
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Rule \${ruleCounter}</h3>
                <div class="flex items-center">
                    <span class="mr-2 cursor-move" draggable="true">☰</span>
                    <button type="button" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l focus:outline-none focus:shadow-outline" onclick="moveRule(this, -1)">↑</button>
                    <button type="button" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r focus:outline-none focus:shadow-outline" onclick="moveRule(this, 1)">↓</button>
                </div>
            </div>
            <input type="hidden" name="rules[\${ruleCounter}].order" value="\${ruleCounter}">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="ruleName\${ruleCounter}">
                    ${LABELS.RULE_NAME}
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ruleName\${ruleCounter}" name="rules[\${ruleCounter}].name" type="text" value="\${rule.name || ''}" required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="ruleDescription\${ruleCounter}">
                    ${LABELS.DESCRIPTION}
                </label>
                <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ruleDescription\${ruleCounter}" name="rules[\${ruleCounter}].description">\${rule.description || ''}</textarea>
            </div>
            <div class="mb-4">
                <h4 class="text-md font-semibold mb-2">Rate Limit</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="limit\${ruleCounter}">
                            ${LABELS.REQUEST_LIMIT}
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="limit\${ruleCounter}" name="rules[\${ruleCounter}].rateLimit.limit" type="number" value="\${rule.rateLimit?.limit || ''}" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="period\${ruleCounter}">
                            ${LABELS.TIME_PERIOD}
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="period\${ruleCounter}" name="rules[\${ruleCounter}].rateLimit.period" type="number" value="\${rule.rateLimit?.period || ''}" required>
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
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="hostname\${ruleCounter}" name="rules[\${ruleCounter}].requestMatch.hostname" type="text" value="\${rule.requestMatch?.hostname || ''}" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="path\${ruleCounter}">
                            ${LABELS.PATH}
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="path\${ruleCounter}" name="rules[\${ruleCounter}].requestMatch.path" type="text" value="\${rule.requestMatch?.path || ''}">
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
        ruleForm.addEventListener('dragstart', handleDragStart, false);
        ruleForm.addEventListener('dragenter', handleDragEnter, false);
        ruleForm.addEventListener('dragover', handleDragOver, false);
        ruleForm.addEventListener('dragleave', handleDragLeave, false);
        ruleForm.addEventListener('drop', handleDrop, false);
        ruleForm.addEventListener('dragend', handleDragEnd, false);
        document.getElementById('rulesContainer').appendChild(ruleForm);

        // Populate fingerprint parameters if they exist
        if (rule.fingerprint && rule.fingerprint.parameters) {
            const fingerprintList = ruleForm.querySelector(\`#fingerprintList\${ruleCounter}\`);
            rule.fingerprint.parameters.forEach(param => addToList(fingerprintList, param, ruleCounter));
        }

        updateRuleOrder();
    }

    function removeRule(button) {
        button.closest('[data-id]').remove();
        updateRuleOrder();
    }

    function moveRule(button, direction) {
        const ruleElement = button.closest('[data-id]');
        if (direction === -1 && ruleElement.previousElementSibling) {
            ruleElement.parentNode.insertBefore(ruleElement, ruleElement.previousElementSibling);
        } else if (direction === 1 && ruleElement.nextElementSibling) {
            ruleElement.parentNode.insertBefore(ruleElement.nextElementSibling, ruleElement);
        }
        updateRuleOrder();
    }

    function updateRuleOrder() {
        document.querySelectorAll('#rulesContainer > div').forEach((rule, index) => {
            rule.querySelector('input[name$="].order"]').value = index + 1;
            rule.querySelector('h3').textContent = \`Rule \${index + 1}\`;
        });
    }

    function handleDragStart(e) {
        this.style.opacity = '0.4';
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('bg-gray-200');
    }

    function handleDragLeave(e) {
        this.classList.remove('bg-gray-200');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (dragSrcEl != this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }
        return false;
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';
        document.querySelectorAll('#rulesContainer > div').forEach(function (item) {
            item.classList.remove('bg-gray-200');
        });
        updateRuleOrder();
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
        document.getElementById('addRule').onclick = () => createRuleForm();

        document.addEventListener('keydown', (e) => {
            if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                e.preventDefault();
                const activeElement = document.activeElement;
                const ruleElement = activeElement.closest('[data-id]');
                if (ruleElement) {
                    moveRule(activeElement, e.key === 'ArrowUp' ? -1 : 1);
                }
            }
        });

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
                document.getElementById('rulesContainer').innerHTML = '';
                ruleCounter = 0;
                config.rules.forEach((rule) => {
                    createRuleForm(rule);
                });
            } else {
createRuleForm();
            }
        }).catch(error => {
            console.error('Error loading configuration:', error);
            document.getElementById('message').textContent = '${MESSAGES.LOAD_ERROR}';
            document.getElementById('message').className = 'mt-4 text-center font-bold text-red-600';
        });
    });

    // Helper function to get the next sibling Element
    function getNextSibling(elem, selector) {
        var sibling = elem.nextElementSibling;
        if (!selector) return sibling;
        while (sibling) {
            if (sibling.matches(selector)) return sibling;
            sibling = sibling.nextElementSibling;
        }
    };

    // Helper function to get the previous sibling Element
    function getPreviousSibling(elem, selector) {
        var sibling = elem.previousElementSibling;
        if (!selector) return sibling;
        while (sibling) {
            if (sibling.matches(selector)) return sibling;
            sibling = sibling.previousElementSibling;
        }
    };

    // Add event delegation for dynamically added elements
    document.getElementById('rulesContainer').addEventListener('click', function(e) {
        if (e.target && e.target.nodeName == "BUTTON") {
            if (e.target.textContent === "↑") {
                moveRule(e.target, -1);
            } else if (e.target.textContent === "↓") {
                moveRule(e.target, 1);
            } else if (e.target.textContent === "Remove Rule") {
                removeRule(e.target);
            }
        }
    });

    // Update the moveRule function to work with the new structure
    function moveRule(button, direction) {
        const ruleElement = button.closest('[data-id]');
        if (direction === -1) {
            const prevSibling = getPreviousSibling(ruleElement, '[data-id]');
            if (prevSibling) {
                ruleElement.parentNode.insertBefore(ruleElement, prevSibling);
            }
        } else if (direction === 1) {
            const nextSibling = getNextSibling(ruleElement, '[data-id]');
            if (nextSibling) {
                ruleElement.parentNode.insertBefore(nextSibling, ruleElement);
            }
        }
        updateRuleOrder();
    }

    // Update drag and drop handlers to work with the new structure
    function handleDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);

        this.classList.add('bg-gray-200');
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('bg-blue-100');
    }

    function handleDragLeave(e) {
        this.classList.remove('bg-blue-100');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (dragSrcEl != this) {
            this.parentNode.removeChild(dragSrcEl);
            var dropHTML = e.dataTransfer.getData('text/html');
            this.insertAdjacentHTML('beforebegin', dropHTML);
            var dropElem = this.previousSibling;
            addDnDHandlers(dropElem);
        }
        this.classList.remove('bg-blue-100');
        updateRuleOrder();
        return false;
    }

    function handleDragEnd(e) {
        this.classList.remove('bg-gray-200');
        updateRuleOrder();
    }

    function addDnDHandlers(elem) {
        elem.addEventListener('dragstart', handleDragStart, false);
        elem.addEventListener('dragenter', handleDragEnter, false)
        elem.addEventListener('dragover', handleDragOver, false);
        elem.addEventListener('dragleave', handleDragLeave, false);
        elem.addEventListener('drop', handleDrop, false);
        elem.addEventListener('dragend', handleDragEnd, false);
    }

    // Add drag and drop handlers to existing rules
    document.querySelectorAll('#rulesContainer > div').forEach(addDnDHandlers);
</script>
`;
