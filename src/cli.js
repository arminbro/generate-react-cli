const program = require('commander');

const pkg = require('../package.json');
const { initGenerateComponentCommand } = require('./commands/generateComponent');
const { getCLIConfigFile } = require('./utils/grcConfigUtils');

module.exports = async function cli(args) {
  const cliConfigFile = await getCLIConfigFile();

  // Initialize generate component command

  initGenerateComponentCommand(args, cliConfigFile, program);

  program.version(pkg.version);
  program.parse(args);
};
