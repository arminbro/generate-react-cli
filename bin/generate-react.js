#!/usr/bin/env node
import cli from '../src/cli.js';
import { error } from '../src/utils/messagesUtils.js';

function isNotValidNodeVersion() {
  const currentNodeVersion = process.versions.node;
  const semver = currentNodeVersion.split('.');
  const major = semver[0];

  if (major < 22) {
    error(`Node ${currentNodeVersion} is not supported`, {
      details: 'Generate React CLI requires Node 22 or higher',
      suggestions: [
        'Update your Node.js version to 22 or higher',
      ],
    });

    return true;
  }

  return false;
}

// --- Check if user is running Node 12 or higher.

if (isNotValidNodeVersion()) {
  process.exit(1);
}

cli(process.argv);
