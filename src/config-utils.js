import {
  LABELS,
  MESSAGES,
  API_ENDPOINTS,
  HTTP_METHODS,
  CONTENT_TYPES,
  FINGERPRINT_PARAMS,
  FINGERPRINT_TOOLTIPS,
  ADD_RULE_BUTTON_TEXT,
  REQUEST_MATCH_FIELDS,
  REQUEST_MATCH_OPERATORS,
} from './config-variables.js';

export const uiScript = `
<script>
    const LABELS = ${JSON.stringify(LABELS)};
    const MESSAGES = ${JSON.stringify(MESSAGES)};
    const API_ENDPOINTS = ${JSON.stringify(API_ENDPOINTS)};
    const HTTP_METHODS = ${JSON.stringify(HTTP_METHODS)};
    const CONTENT_TYPES = ${JSON.stringify(CONTENT_TYPES)};
    const FINGERPRINT_PARAMS = ${JSON.stringify(FINGERPRINT_PARAMS)};
    const FINGERPRINT_TOOLTIPS = ${JSON.stringify(FINGERPRINT_TOOLTIPS)};
    const ADD_RULE_BUTTON_TEXT = ${JSON.stringify(ADD_RULE_BUTTON_TEXT)};
    const REQUEST_MATCH_FIELDS = ${JSON.stringify(REQUEST_MATCH_FIELDS)};
    const REQUEST_MATCH_OPERATORS = ${JSON.stringify(REQUEST_MATCH_OPERATORS)};

    let currentRules = [];
    let draggedItem = null;

    function createRuleModal(rule, index) {
        const modal = document.createElement('div');
        modal.className = 'bg-white shadow-md rounded px-6 py-4 mb-4 cursor-move transition-all duration-200 hover:shadow-lg';
        modal.setAttribute('data-id', index);
        modal.setAttribute('draggable', 'true');
        modal.innerHTML = \`
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-lg font-semibold text-gray-800">\${rule.name}</h3>
                <span class="text-gray-500 opacity-50 hover:opacity-100 transition-opacity duration-200">☰</span>
            </div>
            <p class="text-sm text-gray-600 mb-4">\${rule.description || 'No description'}</p>
            <div class="flex justify-between">
                <button class="viewRule bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200">View</button>
                <button class="editRule bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200">Edit</button>
                <button class="deleteRule bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200">Delete</button>
            </div>
        \`;

        modal.querySelector('.viewRule').onclick = () => viewRule(rule);
        modal.querySelector('.editRule').onclick = () => editRule(rule, index);
        modal.querySelector('.deleteRule').onclick = () => deleteRule(index);

        modal.addEventListener('dragstart', dragStart);
        modal.addEventListener('dragover', dragOver);
        modal.addEventListener('drop', drop);
        modal.addEventListener('dragend', dragEnd);

        return modal;
    }

    function viewRule(rule) {
        const viewModal = document.createElement('div');
        viewModal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center';
        viewModal.innerHTML = \`
            <div class="relative p-8 border w-full max-w-xl shadow-lg rounded-md bg-white">
                <h3 class="text-2xl leading-6 font-medium text-gray-900 mb-4">Rule Details</h3>
                <pre class="text-left whitespace-pre-wrap break-words bg-gray-100 p-4 rounded">\${JSON.stringify(rule, null, 2)}</pre>
                <button id="closeViewModal" class="mt-6 px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200">
                    Close
                </button>
            </div>
        \`;
        document.body.appendChild(viewModal);
        document.getElementById('closeViewModal').onclick = () => document.body.removeChild(viewModal);
    }

function editRule(rule, index) {
    document.getElementById('ruleModals').classList.add('hidden');
    document.getElementById('addNewRule').classList.add('hidden');
    document.getElementById('configForm').classList.remove('hidden');

    document.getElementById('rulesContainer').innerHTML = '';
    createRuleForm(rule, index);

    // Populate form fields
    const form = document.getElementById('configForm');
    form.querySelector(\`[name="rules[\${index}].name"]\`).value = rule.name || '';
    form.querySelector(\`[name="rules[\${index}].description"]\`).value = rule.description || '';
    form.querySelector(\`[name="rules[\${index}].rateLimit.limit"]\`).value = rule.rateLimit?.limit || '';
    form.querySelector(\`[name="rules[\${index}].rateLimit.period"]\`).value = rule.rateLimit?.period || '';

    // Populate fingerprint parameters
    if (rule.fingerprint && rule.fingerprint.parameters) {
        const fingerprintList = document.getElementById(\`fingerprintList\${index}\`);
        fingerprintList.innerHTML = ''; // Clear existing parameters
        rule.fingerprint.parameters.forEach(param => addToList(fingerprintList, param, index));
    }
}

    function dragStart(e) {
        draggedItem = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id'));
        setTimeout(() => {
            e.target.style.opacity = '0.5';
            e.target.style.transform = 'scale(1.05)';
        }, 0);
    }

    function dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const targetItem = e.target.closest('[draggable]');
        if (targetItem && targetItem !== draggedItem) {
            const rect = targetItem.getBoundingClientRect();
            const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
            targetItem.parentNode.insertBefore(draggedItem, next ? targetItem.nextSibling : targetItem);
        }
    }

    function drop(e) {
        e.preventDefault();
        const draggedIndex = parseInt(draggedItem.getAttribute('data-id'));
        const targetIndex = Array.from(draggedItem.parentNode.children).indexOf(draggedItem);

        if (draggedIndex !== targetIndex) {
            const [reorderedItem] = currentRules.splice(draggedIndex, 1);
            currentRules.splice(targetIndex, 0, reorderedItem);
            updateDataIds();
            saveConfiguration();
        }
    }

    function dragEnd(e) {
        e.target.style.opacity = '';
        e.target.style.transform = '';
        draggedItem = null;
    }

    function updateDataIds() {
        const modals = document.querySelectorAll('#ruleModals > div');
        modals.forEach((modal, index) => {
            modal.setAttribute('data-id', index);
        });
    }

    function updateRuleModals() {
        const container = document.getElementById('ruleModals');
        container.className = 'flex flex-col space-y-4 mb-8';
        container.innerHTML = '';
        currentRules.forEach((rule, index) => {
            container.appendChild(createRuleModal(rule, index));
        });

        const addNewRuleButton = document.getElementById('addNewRule');
        addNewRuleButton.className = 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 mb-4';
        addNewRuleButton.textContent = ADD_RULE_BUTTON_TEXT;
    }

    async function saveConfiguration() {
        try {
            // Update rule orders based on their current positions
            currentRules.forEach((rule, index) => {
                rule.order = index + 1;
            });

            const response = await fetch(API_ENDPOINTS.CONFIG, {
                method: HTTP_METHODS.POST,
                headers: { 'Content-Type': CONTENT_TYPES.JSON },
                body: JSON.stringify({ rules: currentRules })
            });

            if (!response.ok) {
                throw new Error('Failed to save configuration');
            }

            document.getElementById('message').textContent = MESSAGES.CONFIG_SAVED;
            document.getElementById('message').className = 'mt-4 text-center font-bold text-green-600';
        } catch (error) {
            console.error('Error saving configuration:', error);
            throw error;
        }
    }

function createRuleForm(rule = {}, editIndex = null) {
  console.log('Creating rule form with rule:', JSON.stringify(rule, null, 2));
  const ruleIndex = editIndex !== null ? editIndex : currentRules.length;
  const ruleForm = document.createElement('div');
  ruleForm.className = 'bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4';
  ruleForm.setAttribute('data-id', ruleIndex);
  ruleForm.innerHTML = '<div class="mb-4">' +
    '<h3 class="text-lg font-semibold">Rule ' + (ruleIndex + 1) + '</h3>' +
    '</div>' +
    '<input type="hidden" name="rules[' + ruleIndex + '].order" value="' + (ruleIndex + 1) + '">' +
    '<div class="mb-4">' +
    '<label class="block text-gray-700 text-sm font-bold mb-2" for="ruleName' + ruleIndex + '">' +
    LABELS.RULE_NAME +
    '</label>' +
    '<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ruleName' + ruleIndex + '" name="rules[' + ruleIndex + '].name" type="text" required>' +
    '</div>' +
    '<div class="mb-4">' +
    '<label class="block text-gray-700 text-sm font-bold mb-2" for="ruleDescription' + ruleIndex + '">' +
    LABELS.DESCRIPTION +
    '</label>' +
    '<textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ruleDescription' + ruleIndex + '" name="rules[' + ruleIndex + '].description"></textarea>' +
    '</div>' +
    '<div class="mb-4">' +
    '<h4 class="text-md font-semibold mb-2">Rate Limit</h4>' +
    '<div class="grid grid-cols-2 gap-4">' +
    '<div>' +
    '<label class="block text-gray-700 text-sm font-bold mb-2" for="limit' + ruleIndex + '">' +
    LABELS.REQUEST_LIMIT +
    '</label>' +
    '<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="limit' + ruleIndex + '" name="rules[' + ruleIndex + '].rateLimit.limit" type="number" required>' +
    '</div>' +
    '<div>' +
    '<label class="block text-gray-700 text-sm font-bold mb-2" for="period' + ruleIndex + '">' +
    LABELS.TIME_PERIOD +
    '</label>' +
    '<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="period' + ruleIndex + '" name="rules[' + ruleIndex + '].rateLimit.period" type="number" required>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="mb-4">' +
    '<h4 class="text-md font-semibold mb-2">' + LABELS.REQUEST_MATCH + '</h4>' +
    '<div class="mb-2">' +
    '<label class="inline-flex items-center">' +
    '<span class="mr-2">Logic:</span>' +
    '<select name="rules[' + ruleIndex + '].requestMatch.logic" class="form-select">' +
    '<option value="AND" ' + ((rule.requestMatch && rule.requestMatch.logic === 'OR') ? '' : 'selected') + '>AND</option>' +
    '<option value="OR" ' + ((rule.requestMatch && rule.requestMatch.logic === 'OR') ? 'selected' : '') + '>OR</option>' +
    '</select>' +
    '</label>' +
    '</div>' +
    '<div id="requestMatchConditions' + ruleIndex + '"></div>' +
    '<button type="button" class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onclick="addCondition(' + ruleIndex + ')">' +
    'Add Condition' +
    '</button>' +
    '</div>' +
    '<div class="mb-4">' +
    '<h4 class="text-md font-semibold mb-2">Action</h4>' +
    '<select id="actionType' + ruleIndex + '" name="rules[' + ruleIndex + '].action.type" class="form-select mb-2" onchange="updateActionFields(' + ruleIndex + ')">' +
    '<option value="log">Log</option>' +
    '<option value="simulate">Simulate</option>' +
    '<option value="block">Block (403)</option>' +
    '<option value="rateLimit" selected>Rate Limit (429)</option>' +
    '<option value="customResponse">Custom JSON Response</option>' +
    '</select>' +
    '<div id="actionFields' + ruleIndex + '"></div>' +
    '</div>' +
    '<div class="mb-4">' +
    '<h4 class="text-md font-semibold mb-2">' + LABELS.FINGERPRINT_PARAMS + '</h4>' +
    '<div class="mb-4">' +
    '<p class="text-sm text-gray-600">' + MESSAGES.CLIENT_IP_INCLUDED + '</p>' +
    '</div>' +
    '<div>' +
    '<select id="fingerprintParam' + ruleIndex + '" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">' +
    FINGERPRINT_PARAMS.map((param) => '<option value="' + param.value + '">' + param.label + '</option>').join('') +
    '</select>' +
    '<button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onclick="addFingerprint(' + ruleIndex + ')">Add</button>' +
    '<div id="fingerprintList' + ruleIndex + '" class="mt-4 p-2 border rounded min-h-[100px]"></div>' +
    '</div>' +
    '</div>';
  document.getElementById('rulesContainer').appendChild(ruleForm);

  console.log('Rule form created. Populating request match conditions...');

  // Populate request match conditions
  const conditionsContainer = document.getElementById('requestMatchConditions' + ruleIndex);
  let conditions = [];
  if (rule.requestMatch) {
    if (Array.isArray(rule.requestMatch.conditions)) {
      conditions = rule.requestMatch.conditions;
    } else if (typeof rule.requestMatch === 'object') {
      conditions = Object.keys(rule.requestMatch)
        .filter(key => key.startsWith('conditions['))
        .map(key => rule.requestMatch[key]);
    }
  }

  if (conditions.length > 0) {
    console.log('Found conditions:', conditions);
    conditions.forEach((condition, index) => {
      console.log('Adding condition ' + index + ':', condition);
      const conditionHTML = createConditionFields(ruleIndex, index, condition);
      conditionsContainer.insertAdjacentHTML('beforeend', conditionHTML);
    });
  } else {
    console.log('No existing conditions found.');
  }

  // Populate form fields
  ruleForm.querySelector('[name="rules[' + ruleIndex + '].name"]').value = rule.name || '';
  ruleForm.querySelector('[name="rules[' + ruleIndex + '].description"]').value = rule.description || '';
  ruleForm.querySelector('[name="rules[' + ruleIndex + '].rateLimit.limit"]').value = rule.rateLimit?.limit || '';
  ruleForm.querySelector('[name="rules[' + ruleIndex + '].rateLimit.period"]').value = rule.rateLimit?.period || '';

  // Populate fingerprint parameters if they exist
  if (rule.fingerprint && rule.fingerprint.parameters) {
    const fingerprintList = ruleForm.querySelector('#fingerprintList' + ruleIndex);
    rule.fingerprint.parameters.forEach(param => addToList(fingerprintList, param, ruleIndex));
  }

  // Populate action fields
  if (rule.action) {
    ruleForm.querySelector('[name="rules[' + ruleIndex + '].action.type"]').value = rule.action.type;
    updateActionFields(ruleIndex, rule.action.type);
    if (rule.action.type === 'customResponse') {
      ruleForm.querySelector('[name="rules[' + ruleIndex + '].action.statusCode"]').value = rule.action.statusCode;
      ruleForm.querySelector('[name="rules[' + ruleIndex + '].action.body"]').value = rule.action.body;
    }
  } else {
    updateActionFields(ruleIndex, 'rateLimit');
  }

  console.log('Rule form population complete.');
}

function updateActionFields(ruleIndex, actionType) {
  const actionFields = document.getElementById('actionFields' + ruleIndex);
  const selectedType = actionType || document.getElementById('actionType' + ruleIndex).value;

  let fieldsHTML = '';
  switch (selectedType) {
    case 'customResponse':
      fieldsHTML = '<div class="mb-2">' +
        '<label class="block text-gray-700 text-sm font-bold mb-2" for="customStatusCode' + ruleIndex + '">Status Code:</label>' +
        '<input type="number" id="customStatusCode' + ruleIndex + '" name="rules[' + ruleIndex + '].action.statusCode" class="form-input" required>' +
        '</div>' +
        '<div class="mb-2">' +
        '<label class="block text-gray-700 text-sm font-bold mb-2" for="customResponseBody' + ruleIndex + '">Response Body (JSON):</label>' +
        '<textarea id="customResponseBody' + ruleIndex + '" name="rules[' + ruleIndex + '].action.body" class="form-textarea" rows="4" required></textarea>' +
        '</div>';
      break;
    // Add cases for other action types if they require additional fields
  }

  actionFields.innerHTML = fieldsHTML;
}

function createConditionFields(ruleIndex, conditionIndex, condition = {}) {
    console.log('Creating condition fields for rule ' + ruleIndex + ', condition ' + conditionIndex + ':', condition);
    return '' +
        '<div class="grid grid-cols-3 gap-4 mb-4" id="condition' + ruleIndex + '_' + conditionIndex + '">' +
            '<div>' +
                '<label class="block text-gray-700 text-sm font-bold mb-2" for="field' + ruleIndex + '_' + conditionIndex + '">' +
                    LABELS.CONDITION_FIELD +
                '</label>' +
                '<select class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" ' +
                        'id="field' + ruleIndex + '_' + conditionIndex + '" ' +
                        'name="rules[' + ruleIndex + '].requestMatch.conditions[' + conditionIndex + '].field" ' +
                        'onchange="handleFieldChange(' + ruleIndex + ', ' + conditionIndex + ')" required>' +
                    REQUEST_MATCH_FIELDS.map(field =>
                        '<option value="' + field.value + '" ' + (condition.field === field.value ? 'selected' : '') + '>' + field.label + '</option>'
                    ).join('') +
                '</select>' +
            '</div>' +
            '<div>' +
                '<label class="block text-gray-700 text-sm font-bold mb-2" for="operator' + ruleIndex + '_' + conditionIndex + '">' +
                    LABELS.CONDITION_OPERATOR +
                '</label>' +
                '<select class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" ' +
                        'id="operator' + ruleIndex + '_' + conditionIndex + '" ' +
                        'name="rules[' + ruleIndex + '].requestMatch.conditions[' + conditionIndex + '].operator" required>' +
                    REQUEST_MATCH_OPERATORS.map(op =>
                        '<option value="' + op.value + '" ' + (condition.operator === op.value ? 'selected' : '') + '>' + op.label + '</option>'
                    ).join('') +
                '</select>' +
            '</div>' +
            '<div>' +
                '<label class="block text-gray-700 text-sm font-bold mb-2" for="value' + ruleIndex + '_' + conditionIndex + '">' +
                    LABELS.CONDITION_VALUE +
                '</label>' +
                '<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" ' +
                       'id="value' + ruleIndex + '_' + conditionIndex + '" ' +
                       'name="rules[' + ruleIndex + '].requestMatch.conditions[' + conditionIndex + '].value" ' +
                       'type="text" value="' + (condition.value || '') + '" required>' +
            '</div>' +
        '</div>';
}
function handleFieldChange(ruleIndex, conditionIndex) {
    const fieldSelect = document.getElementById('field' + ruleIndex + '_' + conditionIndex);
    const valueInput = document.getElementById('value' + ruleIndex + '_' + conditionIndex);

    if (fieldSelect.value === 'body') {
        valueInput.placeholder = 'Enter a regex pattern to match against the request body';
    } else {
        valueInput.placeholder = '';
    }
}

    function addCondition(ruleIndex) {
        const conditionsContainer = document.getElementById(\`requestMatchConditions\${ruleIndex}\`);
        const newConditionIndex = conditionsContainer.children.length;
        const newConditionHTML = createConditionFields(ruleIndex, newConditionIndex);
        conditionsContainer.insertAdjacentHTML('beforeend', newConditionHTML);
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
        tooltip.textContent = FINGERPRINT_TOOLTIPS[value] || 'No description available';
        item.appendChild(tooltip);

        item.querySelector('span').onmouseenter = () => tooltip.classList.remove('hidden');
        item.querySelector('span').onmouseleave = () => tooltip.classList.add('hidden');
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('addNewRule').onclick = () => {
            document.getElementById('ruleModals').classList.add('hidden');
            document.getElementById('addNewRule').classList.add('hidden');
            document.getElementById('configForm').classList.remove('hidden');
            document.getElementById('rulesContainer').innerHTML = '';
            createRuleForm();
        };

        document.getElementById('addNewRule').textContent = ADD_RULE_BUTTON_TEXT;

        document.getElementById('cancelEdit').onclick = () => {
            document.getElementById('ruleModals').classList.remove('hidden');
            document.getElementById('addNewRule').classList.remove('hidden');
            document.getElementById('configForm').classList.add('hidden');
        };

        document.getElementById('configForm').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const newRule = {};

            for (let [key, value] of formData.entries()) {
                if (key.startsWith('rules[')) {
                    const match = key.match(/rules\\[(\\d+)\\]\\.(.+)/);
                    if (match) {
                        const [, , path] = match;
                        const keys = path.split('.');
                        let current = newRule;
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

            const editIndex = parseInt(document.querySelector('#rulesContainer > div').getAttribute('data-id'));
            if (!isNaN(editIndex) && editIndex < currentRules.length) {
                currentRules[editIndex] = newRule;
            } else {
                currentRules.push(newRule);
            }

            try {
                await saveConfiguration();
                updateRuleModals();
                document.getElementById('ruleModals').classList.remove('hidden');
                document.getElementById('addNewRule').classList.remove('hidden');
                document.getElementById('configForm').classList.add('hidden');
            } catch (error) {
                document.getElementById('message').textContent = MESSAGES.SAVE_ERROR + error.message;
                document.getElementById('message').className = 'mt-4 text-center font-bold text-red-600';
            }
        };

        // Load existing configuration
        fetch(API_ENDPOINTS.CONFIG).then(response => response.json()).then(config => {
            if (config.rules && config.rules.length > 0) {
                currentRules = config.rules.sort((a, b) => a.order - b.order);
                updateRuleModals();
            }
        }).catch(error => {
            console.error('Error loading configuration:', error);
            document.getElementById('message').textContent = MESSAGES.LOAD_ERROR;
            document.getElementById('message').className = 'mt-4 text-center font-bold text-red-600';
        });
    });
</script>
`;
