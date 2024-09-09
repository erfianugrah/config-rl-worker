// Configuration variables

// UI-related variables
export const UI_TITLE = 'Rate Limit Configuration';
export const ADD_RULE_BUTTON_TEXT = 'Add New Rule';
export const SAVE_CONFIG_BUTTON_TEXT = 'Save Configuration';

export const REQUEST_MATCH_FIELDS = [
  // Request interface
  { value: 'method', label: 'HTTP Method' },
  { value: 'url', label: 'Full URL' },
  { value: 'headers', label: 'Headers' },
  { value: 'body', label: 'Request Body' },

  // URL interface
  { value: 'url.protocol', label: 'URL Protocol' },
  { value: 'url.hostname', label: 'URL Hostname' },
  { value: 'url.port', label: 'URL Port' },
  { value: 'url.pathname', label: 'URL Path' },
  { value: 'url.search', label: 'URL Query String' },
  { value: 'url.hash', label: 'URL Fragment' },

  // Common headers
  { value: 'headers.accept', label: 'Accept Header' },
  { value: 'headers.accept-encoding', label: 'Accept-Encoding Header' },
  { value: 'headers.accept-language', label: 'Accept-Language Header' },
  { value: 'headers.user-agent', label: 'User-Agent Header' },
  { value: 'headers.cookie', label: 'Cookie Header' },
  { value: 'headers.dnt', label: 'DNT Header' },
  { value: 'headers.sec-fetch-dest', label: 'Sec-Fetch-Dest Header' },
  { value: 'headers.sec-fetch-mode', label: 'Sec-Fetch-Mode Header' },
  { value: 'headers.sec-fetch-site', label: 'Sec-Fetch-Site Header' },
  { value: 'headers.sec-fetch-user', label: 'Sec-Fetch-User Header' },

  // Cloudflare-specific properties
  { value: 'cf.asn', label: 'ASN (CF)' },
  { value: 'cf.asOrganization', label: 'AS Organization (CF)' },
  { value: 'cf.botManagement.score', label: 'Bot Score (CF)' },
  { value: 'cf.botManagement.verifiedBot', label: 'Verified Bot (CF)' },
  { value: 'cf.botManagement.staticResource', label: 'Static Resource (CF)' },
  { value: 'cf.botManagement.ja3Hash', label: 'JA3 Hash (CF)' },
  { value: 'cf.botManagement.ja4', label: 'JA4 (CF)' },
  { value: 'cf.clientAcceptEncoding', label: 'Client Accept Encoding (CF)' },
  { value: 'cf.colo', label: 'Colo (CF)' },
  { value: 'cf.country', label: 'Country (CF)' },
  { value: 'cf.city', label: 'City (CF)' },
  { value: 'cf.continent', label: 'Continent (CF)' },
  { value: 'cf.latitude', label: 'Latitude (CF)' },
  { value: 'cf.longitude', label: 'Longitude (CF)' },
  { value: 'cf.postalCode', label: 'Postal Code (CF)' },
  { value: 'cf.region', label: 'Region (CF)' },
  { value: 'cf.regionCode', label: 'Region Code (CF)' },
  { value: 'cf.timezone', label: 'Timezone (CF)' },
  { value: 'cf.httpProtocol', label: 'HTTP Protocol (CF)' },
  { value: 'cf.tlsVersion', label: 'TLS Version (CF)' },
  { value: 'cf.tlsCipher', label: 'TLS Cipher (CF)' },
  { value: 'cf.clientTrustScore', label: 'Client Trust Score (CF)' },
  { value: 'cf.requestPriority', label: 'Request Priority (CF)' },
  { value: 'cf.tlsClientAuth', label: 'TLS Client Auth (CF)' },
  { value: 'cf.edgeRequestKeepAliveStatus', label: 'Edge Request Keep Alive Status (CF)' },
  { value: 'cf.tlsClientHelloLength', label: 'TLS Client Hello Length (CF)' },
  { value: 'cf.tlsExportedAuthenticator', label: 'TLS Exported Authenticator (CF)' },
];

export const FINGERPRINT_PARAMS = [
  // Request headers
  { value: 'headers.user-agent', label: 'User Agent' },
  { value: 'headers.accept-language', label: 'Accept Language' },
  { value: 'headers.accept-encoding', label: 'Accept Encoding' },
  { value: 'headers.sec-fetch-dest', label: 'Sec-Fetch-Dest' },
  { value: 'headers.sec-fetch-mode', label: 'Sec-Fetch-Mode' },
  { value: 'headers.sec-fetch-site', label: 'Sec-Fetch-Site' },
  { value: 'headers.sec-fetch-user', label: 'Sec-Fetch-User' },

  // URL components
  { value: 'url.hostname', label: 'Hostname' },

  // Request body
  { value: 'body', label: 'Request Body' },

  // Cloudflare-specific properties
  { value: 'cf.asn', label: 'ASN' },
  { value: 'cf.httpProtocol', label: 'HTTP Protocol' },
  { value: 'cf.tlsVersion', label: 'TLS Version' },
  { value: 'cf.tlsCipher', label: 'TLS Cipher' },
  { value: 'cf.clientTrustScore', label: 'Client Trust Score' },
  { value: 'cf.botManagement.score', label: 'Bot Management Score' },
  { value: 'cf.botManagement.ja3Hash', label: 'JA3 Hash' },
  { value: 'cf.botManagement.ja4', label: 'JA4' },
  { value: 'cf.clientAcceptEncoding', label: 'Client Accept Encoding' },
  { value: 'cf.country', label: 'Country' },
  { value: 'cf.city', label: 'City' },
  { value: 'cf.continent', label: 'Continent' },
  { value: 'cf.latitude', label: 'Latitude' },
  { value: 'cf.longitude', label: 'Longitude' },
  { value: 'cf.postalCode', label: 'Postal Code' },
  { value: 'cf.region', label: 'Region' },
  { value: 'cf.regionCode', label: 'Region Code' },
  { value: 'cf.timezone', label: 'Timezone' },
  { value: 'cf.tlsClientHelloLength', label: 'TLS Client Hello Length' },
  { value: 'cf.tlsExportedAuthenticator.clientHandshake', label: 'TLS Client Handshake' },
  { value: 'cf.tlsExportedAuthenticator.clientFinished', label: 'TLS Client Finished' },
];

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

// Tooltips for fingerprint parameters
export const FINGERPRINT_TOOLTIPS = {
  'cf.tlsVersion': 'The TLS version used for the connection',
  'cf.tlsCipher': 'The cipher suite used for the TLS connection',
  'cf.ja4': 'JA4 fingerprint, similar to JA3 but more comprehensive',
  'cf.asn': 'Autonomous System Number of the client',
  'headers.user-agent': 'User agent string from the client',
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
