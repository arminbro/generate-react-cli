const program = require('commander');
const pkg = require('../package.json');
const { generateComponent } = require('./actions/componentActions');
const { getCLIConfigFile } = require('./services/grcConfigService');

module.exports = async function cli(args) {
  const cliConfigFile = await getCLIConfigFile();
  const { component, page } = cliConfigFile;

  program.version(pkg.version);

  // --- Generate component command

  program
    .command('component <name>')
    .alias('c')

    .option('-p, --path <path>', 'The path where the component will get genereted in.', component.path)
    .option('--withStyle <withStyle>', 'With corresponding stylesheet file.', component.withStyle)
    .option('--withTest <withTest>', 'With corresponding test file.', component.withTest)
    .option('--withStory <withStory>', 'With corresponding story file.', component.withStory)
    .option('--withLazy <withLazy>', 'With corresponding lazy file.', component.withLazy)

    .action((componentName, cmd) => generateComponent(cmd, cliConfigFile, componentName));

  // --- Generate page command

  /**
   * We can continue using the generateComponent method to generate pages.
   * Afterall a page is a component at the end of the day.
   *
   * Eventually, if a page needs additional logic, we can create a new generatePage method.
   */

  program
    .command('page <name>')
    .alias('p')

    .option('-p, --path <path>', 'The path where the page will get genereted in.', page.path)
    .option('--withStyle <withStyle>', 'With corresponding stylesheet file.', page.withStyle)
    .option('--withTest <withTest>', 'With corresponding test file.', page.withTest)
    .option('--withStory <withStory>', 'With corresponding story file.', page.withStory)
    .option('--withLazy <withLazy>', 'With corresponding lazy file.', page.withLazy)

    .action((pageName, cmd) => generateComponent(cmd, cliConfigFile, pageName));

  program.parse(args);
};
