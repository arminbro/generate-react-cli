import program from 'commander';
import chalk from 'chalk';
import pkg from '../package.json';
import { generateComponent } from './actions/component/componentActions';
import { getCLIConfigFile } from './services/grcConfig/grcConfigService';

export async function cli(args) {
  const cliConfigFile = await getCLIConfigFile();
  const { component: componentConfig, usesTypeScript } = cliConfigFile;
  let commandNotFound = true;

  program.version(pkg.version);

  // --- Generate Component

  program
    .command('component <name>')
    .alias('c')

    .option('-p, --path <path>', 'Path of where the component will get genereted in.', componentConfig.path)

    .option('--withStyle', 'With corresponding test file.', componentConfig.css.withStyle)
    .option('--no-withStyle', 'Without corresponding test file.')

    .option('--withTest', 'With corresponding test file.', componentConfig.test.withTest)
    .option('--no-withTest', 'Without corresponding test file.')

    .option('--withStory', 'With corresponding story file.', componentConfig.withStory)
    .option('--no-withStory', 'Without corresponding story file.')

    .option('--withLazy', 'With corresponding lazy file.', componentConfig.withLazy)
    .option('--no-withLazy', 'Without corresponding lazy file.')

    .action((componentName, cmd) => generateComponent(cmd, componentConfig, componentName, usesTypeScript))
    .action(() => {
      commandNotFound = false;
    });

  program.parse(args);

  if (commandNotFound) {
    console.error(chalk.red('Command not found.'));
    console.log(`Run ${chalk.green('generate-react --help')} to see a list of the commmands you can run.`);
    process.exit(1);
  }
}
