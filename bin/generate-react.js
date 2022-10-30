#!/usr/bin/env node
import cli from '../src/cli.js';

const isNotValidNodeVersion = () => {
  const currentNodeVersion = process.versions.node;
  const semver = currentNodeVersion.split('.');
  const major = semver[0];

  if (major < 16) {
    console.error(
      // eslint-disable-next-line
      'You are running Node ' +
        currentNodeVersion +
        ' Generate React CLI requires Node 16 or higher. Please update your version of Node.'
    );

    return true;
  }

  return false;
};

// --- Check if user is running Node 12 or higher.

if (isNotValidNodeVersion()) {
  process.exit(1);
}

cli(process.argv);
