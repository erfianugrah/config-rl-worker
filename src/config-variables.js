// Configuration variables

// UI-related variables
export const UI_TITLE = 'Rate Limit Configuration';
export const ADD_RULE_BUTTON_TEXT = 'Add New Rule';
export const SAVE_CONFIG_BUTTON_TEXT = 'Save Configuration';

// Form field labels
export const LABELS = {
  ORDER: 'Order:',
  RULE_NAME: 'Rule Name:',
  DESCRIPTION: 'Description:',
  REQUEST_LIMIT: 'Request Limit:',
  TIME_PERIOD: 'Time Period (seconds):',
  HOSTNAME: 'Hostname:',
  PATH: 'Path (leave empty to match all paths):',
  FINGERPRINT_PARAMS: 'Fingerprint Parameters',
  REQUEST_MATCH: 'Request Matching:',
  CONDITION_FIELD: 'Field:',
  CONDITION_OPERATOR: 'Operator:',
  CONDITION_VALUE: 'Value:',
};

// Messages
export const MESSAGES = {
  CLIENT_IP_INCLUDED: 'Client IP is always included by default.',
  CONFIG_SAVED: 'Configuration saved successfully!',
  SAVE_ERROR: 'Error: ',
  LOAD_ERROR: 'Error loading configuration',
};

// API endpoints
export const API_ENDPOINTS = {
  CONFIG: '/config',
};

// HTTP methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
};

// Content types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  HTML: 'text/html',
};

// Storage keys
export const STORAGE_KEYS = {
  CONFIG: 'config',
};

// Default values
export const DEFAULTS = {
  EMPTY_CONFIG: '{"rules":[]}',
};

// Fingerprint parameter options
export const FINGERPRINT_PARAMS = [
  { value: 'cf.tlsVersion', label: 'TLS Version' },
  { value: 'cf.tlsCipher', label: 'TLS Cipher' },
  { value: 'cf.ja4', label: 'JA4' },
  { value: 'cf.asn', label: 'ASN' },
  { value: 'user-agent', label: 'User Agent' },
  { value: 'cf-device-type', label: 'Device Type' },
  { value: 'cf.tlsClientRandom', label: 'TLS Client Random' },
  { value: 'cf.tlsClientHelloLength', label: 'TLS Client Hello Length' },
  { value: 'cf.tlsExportedAuthenticator.clientFinished', label: 'TLS Client Finished' },
  { value: 'cf.tlsExportedAuthenticator.clientHandshake', label: 'TLS Client Handshake' },
  { value: 'cf.botManagement.score', label: 'Bot Score' },
  { value: 'cf.botManagement.staticResource', label: 'Static Resource' },
  { value: 'cf.botManagement.verifiedBot', label: 'Verified Bot' },
  { value: 'cf.clientAcceptEncoding', label: 'Client Accept Encoding' },
  { value: 'cf.httpProtocol', label: 'HTTP Protocol' },
];

// Tooltips for fingerprint parameters
export const FINGERPRINT_TOOLTIPS = {
  'cf.tlsVersion': 'The TLS version used for the connection',
  'cf.tlsCipher': 'The cipher suite used for the TLS connection',
  'cf.ja4': 'JA4 fingerprint, similar to JA3 but more comprehensive',
  'cf.asn': 'Autonomous System Number of the client',
  'user-agent': 'User agent string from the client',
  'cf-device-type': 'Type of device (desktop, mobile, etc.)',
  'cf.tlsClientRandom': '32-byte random value provided by the client in TLS handshake',
  'cf.tlsClientHelloLength': 'Length of the client hello message in TLS handshake',
  'cf.tlsExportedAuthenticator.clientFinished': 'TLS exported authenticator for client finished',
  'cf.tlsExportedAuthenticator.clientHandshake': 'TLS exported authenticator for client handshake',
  'cf.botManagement.score': 'Bot score from Cloudflare Bot Management',
  'cf.botManagement.staticResource': 'Indicates if the request is for a static resource',
  'cf.botManagement.verifiedBot': 'Indicates if the request is from a verified bot',
  'cf.clientAcceptEncoding': 'Accept-Encoding header from the client',
  'cf.httpProtocol': 'HTTP protocol version used for the request',
};

// Request matching fields
export const REQUEST_MATCH_FIELDS = [
  { value: 'http.host', label: 'Host' },
  { value: 'http.method', label: 'HTTP Method' },
  { value: 'http.path', label: 'URL Path' },
  { value: 'http.url', label: 'Full URL' },
  { value: 'http.user_agent', label: 'User Agent' },
  { value: 'ip.src', label: 'Source IP' },
  { value: 'ssl', label: 'SSL/TLS' },
  { value: 'http.referer', label: 'Referer' },
  { value: 'http.x_forwarded_for', label: 'X-Forwarded-For' },
  { value: 'http.cookie', label: 'Cookie' },
  { value: 'http.origin', label: 'Origin' },
];

// Request matching operators
export const REQUEST_MATCH_OPERATORS = [
  { value: 'eq', label: 'Equals' },
  { value: 'ne', label: 'Not Equals' },
  { value: 'gt', label: 'Greater Than' },
  { value: 'ge', label: 'Greater Than or Equal' },
  { value: 'lt', label: 'Less Than' },
  { value: 'le', label: 'Less Than or Equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does Not Contain' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' },
  { value: 'matches', label: 'Matches Regex' },
];
