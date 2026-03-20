const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const REDIRECT_FILES = [
  path.join(ROOT_DIR, '_redirects'),
  path.join(SRC_DIR, '_redirects'),
];
const HEADER_FILES = [
  path.join(ROOT_DIR, '_headers'),
  path.join(SRC_DIR, '_headers'),
];
const VALID_STATUS_CODES = new Set(['200', '301', '302', '303', '307', '308']);

normalizeRedirects();
syncHeaders();

function normalizeRedirects() {
  const primaryFile = path.join(SRC_DIR, '_redirects');
  const normalized = normalizeRedirectContent(fs.readFileSync(primaryFile, 'utf8'));

  for (const filePath of REDIRECT_FILES) {
    fs.writeFileSync(filePath, normalized);
  }
}

function syncHeaders() {
  const primaryFile = path.join(ROOT_DIR, '_headers');
  const content = fs.readFileSync(primaryFile, 'utf8').replace(/\r\n/g, '\n').trimEnd() + '\n';

  for (const filePath of HEADER_FILES) {
    fs.writeFileSync(filePath, content);
  }
}

function normalizeRedirectContent(content) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const normalizedLines = lines.map((line) => normalizeRedirectLine(line));

  return normalizedLines.join('\n').trimEnd() + '\n';
}

function normalizeRedirectLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    return trimmed;
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length < 2 || parts.length > 3) {
    throw new Error(`Invalid redirect rule: ${line}`);
  }

  const [source, destination, statusCode = '301'] = parts;
  if (!VALID_STATUS_CODES.has(statusCode)) {
    throw new Error(`Unsupported redirect status code in rule: ${line}`);
  }

  return `${source} ${destination} ${statusCode}`;
}
