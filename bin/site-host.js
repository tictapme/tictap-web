const { execSync } = require('child_process');

const PROD_HOST = 'https://www.tictap.me';
const DEVELOP_HOST = 'https://develop.wp-web.pages.dev';
const KNOWN_HOSTS = [
  PROD_HOST,
  DEVELOP_HOST,
  'https://staging-www.tictap.me',
  'https://static-www.tictap.me',
  'https://staging-www-tictap.tictap.me',
];

function resolveSiteContext() {
  const branch = resolveBranchName();
  const host = resolveHostForBranch(branch);
  const nonTargetHosts = KNOWN_HOSTS.filter((candidate) => candidate !== host);

  return {
    branch,
    host,
    nonTargetHosts,
  };
}

function resolveBranchName() {
  const fromEnv = firstNonEmpty([
    process.env.SITE_BRANCH,
    process.env.CF_PAGES_BRANCH,
    process.env.BRANCH,
    process.env.GIT_BRANCH,
    process.env.GITHUB_REF_NAME,
  ]);

  if (fromEnv) {
    return fromEnv;
  }

  try {
    return execSync('git branch --show-current', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'main';
  }
}

function resolveHostForBranch(branch) {
  if (process.env.SITE_HOST) {
    return process.env.SITE_HOST;
  }

  if (branch === 'develop') {
    return DEVELOP_HOST;
  }

  return PROD_HOST;
}

function firstNonEmpty(values) {
  return values.find((value) => typeof value === 'string' && value.trim());
}

module.exports = {
  DEVELOP_HOST,
  KNOWN_HOSTS,
  PROD_HOST,
  resolveBranchName,
  resolveHostForBranch,
  resolveSiteContext,
};
