const chalk = require('chalk');
const program = require('commander');
const pkg = require('../package.json');
const { generateComponent } = require('./actions/componentActions');
const { componentLevelQuestions, getCLIConfigFile } = require('./services/grcConfigService');

module.exports = async function cli(args) {
  const cliConfigFile = await getCLIConfigFile();
  const isComponentCmd = args.find((arg) => arg.includes('c') || arg.includes('component'));

  program.version(pkg.version);

  // --- Generate component

  if (isComponentCmd) {
    const hasComponentTypeOption = args.find((arg) => arg.includes('--type'));
    let component = null;

    if (hasComponentTypeOption) {
      const componentType = hasComponentTypeOption.split('=')[1]; // get the component type value

      // if the component type does not exists in the cliConfigFile under `component` throw an error

      if (!cliConfigFile.component[componentType]) {
        console.error(
          chalk.red(
            `
ERROR: Please make sure the component type you're trying to use exists in the 
${chalk.bold('generate-react-cli.json')} config file under the ${chalk.bold('component')} object.
            `
          )
        );

        process.exit(1);
      }

      /**
       * A component type should have the same default componentLevelQuestions properties.
       * Loop through each default componentLevelQuestion and make sure the custom component type
       * is not missing any required properties.
       */

      componentLevelQuestions.forEach((componentLevelQuestion) => {
        const requiredComponentTypeProperty = componentLevelQuestion.name.split('component.default.')[1];

        // if the component type has a missing required property throw an error

        if (cliConfigFile.component[componentType][requiredComponentTypeProperty] === undefined) {
          console.error(
            chalk.red(`
ERROR: "${chalk.bold(requiredComponentTypeProperty)}" is a required property, and it is missing 
from the "${chalk.bold(componentType)}" component type. Please make sure to set it.

Otherwise you won't be able to use your "${chalk.bold(componentType)}" component type.
          `)
          );

          process.exit(1);
        }
      });

      component = cliConfigFile.component[componentType];
    } else {
      component = cliConfigFile.component.default;
    }

    program
      .command('component [names...]')
      .alias('c')

      .option('-p, --path <path>', 'The path where the component will get generated in.', component.path)
      .option('--withStyle <withStyle>', 'With corresponding stylesheet file.', component.withStyle)
      .option('--withTest <withTest>', 'With corresponding test file.', component.withTest)
      .option('--withStory <withStory>', 'With corresponding story file.', component.withStory)
      .option('--withLazy <withLazy>', 'With corresponding lazy file.', component.withLazy)
      .option(
        '--type <type>',
        'You can pass a component type that you have configured in your GRC config file.',
        'default'
      )

      .action((componentNames, cmd) =>
        componentNames.forEach((componentName) => generateComponent(cmd, cliConfigFile, componentName))
      );
  }

  program.parse(args);
};
