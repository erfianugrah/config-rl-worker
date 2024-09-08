import { UI_TITLE, ADD_RULE_BUTTON_TEXT, SAVE_CONFIG_BUTTON_TEXT } from './config-variables.js';

export const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${UI_TITLE}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8 text-center">${UI_TITLE}</h1>
        <form id="configForm" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <button type="button" id="addRule" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4">
                ${ADD_RULE_BUTTON_TEXT}
            </button>
            <div id="rulesContainer" class="space-y-4"></div>
            <div class="flex items-center justify-between mt-6">
                <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    ${SAVE_CONFIG_BUTTON_TEXT}
                </button>
            </div>
        </form>
        <div id="message" class="mt-4 text-center font-bold"></div>
    </div>
</body>
</html>
`;
