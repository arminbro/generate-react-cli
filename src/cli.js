const program = require('commander');
const pkg = require('../package.json');
const { generateComponent } = require('./actions/componentActions');
const { getCLIConfigFile } = require('./services/grcConfigService');

module.exports = async function cli(args) {
  const cliConfigFile = await getCLIConfigFile();

  program.version(pkg.version);

  // --- Generate component commands

  Object.keys(cliConfigFile).forEach((configKey) => {
    const configValue = cliConfigFile[configKey];

    /**
     *  Check if each configValue is a component config
     *  and if it is, register it as a component command.
     */

    if (
      typeof configValue === 'object' &&
      configValue.path !== undefined &&
      configValue.withLazy !== undefined &&
      configValue.withStory !== undefined &&
      configValue.withStyle !== undefined &&
      configValue.withTest !== undefined
    ) {
      const commandName = configKey;
      const commandOptions = configValue;

      program
        .command(`${commandName} <name>`)

        .option('-p, --path <path>', 'The path where the component will get genereted in.', commandOptions.path)
        .option('--withStyle <withStyle>', 'With corresponding stylesheet file.', commandOptions.withStyle)
        .option('--withTest <withTest>', 'With corresponding test file.', commandOptions.withTest)
        .option('--withStory <withStory>', 'With corresponding story file.', commandOptions.withStory)
        .option('--withLazy <withLazy>', 'With corresponding lazy file.', commandOptions.withLazy)

        .action((componentName, cmd) => generateComponent(cmd, cliConfigFile, componentName));
    }
  });

  program.parse(args);
};
