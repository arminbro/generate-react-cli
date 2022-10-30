import { program } from 'commander';
import { createRequire } from 'module';

import initGenerateComponentCommand from './commands/generateComponent.js';
import { getCLIConfigFile } from './utils/grcConfigUtils.js';

export default async function cli(args) {
  const cliConfigFile = await getCLIConfigFile();
  const localRequire = createRequire(import.meta.url);
  const pkg = localRequire('../package.json');

  // Initialize generate component command

  initGenerateComponentCommand(args, cliConfigFile, program);

  program.version(pkg.version);
  program.parse(args);
}
