const program = require('commander');
const chalk = require('chalk');
const pkg = require('../package.json');
const { generateComponent } = require('./actions/componentActions');
const { getCLIConfigFile } = require('./services/grcConfigService');

module.exports = async function cli(args) {
  const cliConfigFile = await getCLIConfigFile();
  const { component } = cliConfigFile;
  let commandNotFound = true;

  program.version(pkg.version);

  // --- Generate Component

  program
    .command('component <name>')
    .alias('c')

    .option('-p, --path <path>', 'The path where the component will get genereted in.', component.path)
    .option('--withStyle <withStyle>', 'With corresponding stylesheet file.', component.css.withStyle)
    .option('--withTest <withTest>', 'With corresponding test file.', component.test.withTest)
    .option('--withStory <withStory>', 'With corresponding story file.', component.withStory)
    .option('--withLazy <withLazy>', 'With corresponding lazy file.', component.withLazy)

    .action((componentName, cmd) => generateComponent(cmd, cliConfigFile, componentName))
    .action(() => {
      commandNotFound = false;
    });

  program.parse(args);

  if (commandNotFound) {
    console.error(chalk.red('Command not found.'));
    console.log(`Run ${chalk.green('generate-react --help')} to see a list of the commmands you can run.`);
    process.exit(1);
  }
};
