import { program } from 'commander';
import { createRequire } from 'module';
import { config as dotEnvConfig } from 'dotenv';
import path from 'path';

import initGenerateComponentCommand from './commands/generateComponent.js';
import { getCLIConfigFile } from './utils/grcConfigUtils.js';

export default async function cli(args) {
  const cliConfigFile = await getCLIConfigFile();
  const localRequire = createRequire(import.meta.url);
  const pkg = localRequire('../package.json');

  // init dotenv

  dotEnvConfig({ path: path.resolve(process.cwd(), '.env.local') });

  // Initialize generate component command

  initGenerateComponentCommand(args, cliConfigFile, program);

  program.version(pkg.version);
  program.parse(args);
}
