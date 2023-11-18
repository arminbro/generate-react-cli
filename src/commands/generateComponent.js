import {
  generateComponent,
  getComponentByType,
  getCorrespondingComponentFileTypes,
} from '../utils/generateComponentUtils.js';

export default function initGenerateComponentCommand(args, cliConfigFile, program) {
  const selectedComponentType = getComponentByType(args, cliConfigFile);

  const componentCommand = program
    .command('component [names...]')
    .alias('c')

    // Static component command option defaults.

    .option('-p, --path <path>', 'The path where the component will get generated in.', selectedComponentType.path)
    .option(
      '--type <type>',
      'You can pass a component type that you have configured in your GRC config file.',
      'default'
    )
    .option(
      '-d, --describe <describe>',
      'Describe the component you want GRC to generate (e.g., Create a counter component that increments by one when I click on the increment button).',
      null
    )
    .option(
      '-f, --flat',
      'Generate the files in the mentioned path instead of creating new folder for it',
      selectedComponentType.flat || false
    )
    .option('-dr, --dry-run', 'Show what will be generated without writing to disk')
    .option(
      '--customDirectory <customDirectory>',
      'You can pass a cased path template that will be used as the component path for the component being generated.\n' +
        'E.g. this allows you to add a prefix or suffix to the component path, ' +
        'or change the case of the name of the directory holding the components to kebab-case.\n' +
        'Examples:\n' +
        '- TemplateName\n' +
        '- template-name\n' +
        '- TemplateNameSuffix'
    );

  // Dynamic component command option defaults.

  const dynamicOptions = getCorrespondingComponentFileTypes(selectedComponentType);

  dynamicOptions.forEach((dynamicOption) => {
    componentCommand.option(
      `--${dynamicOption} <${dynamicOption}>`,
      `With corresponding ${dynamicOption.split('with')[1]} file.`,
      selectedComponentType[dynamicOption]
    );
  });

  // Component command action.

  componentCommand.action((componentNames, cmd) =>
    componentNames.forEach((componentName) => generateComponent(componentName, cmd, cliConfigFile))
  );
}
