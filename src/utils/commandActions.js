import chalk from 'chalk';
import { accessSync, constants, existsSync, outputFileSync, readFileSync } from 'fs-extra';
import { prompt } from 'inquirer';
import replace from 'replace';
import componentJsTemplate from '../../templates/components/componentJsTemplate';
import componentCssTemplate from '../../templates/components/componentCssTemplate';
import componentTestTemplate from '../../templates/components/componentTestTemplate';
import componentStoryTemplate from '../../templates/components/componentStoryTemplate';

// public

export function generateComponent(componentName, cmd, componentConfig) {
  const componentPathDir = `${cmd.path}/${componentName}`;
  const module = componentConfig.css.module ? '.module' : '';

  // Make sure component name is valid.
  if (!componentName.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
    console.error(
      chalk.red.bold(
        'ERROR: Component name is invalid. Please use a valid naming convention for the component you are trying to create.'
      )
    );

    return;
  }

  generateTemplate(
    componentJsTemplate,
    `Component "${componentName}.js"`,
    `${componentPathDir}/${componentName}.js`,
    componentName
  );

  generateTemplate(
    componentCssTemplate,
    `Stylesheet "${componentName}${module}.${componentConfig.css.preprocessor}"`,
    `${componentPathDir}/${componentName}${module}.${componentConfig.css.preprocessor}`,
    componentName
  );

  if (componentConfig.withTest) {
    generateTemplate(
      componentTestTemplate,
      `Test "${componentName}.test.js"`,
      `${componentPathDir}/${componentName}.test.js`,
      componentName
    );
  }

  if (componentConfig.withStory) {
    generateTemplate(
      componentStoryTemplate,
      `Story "${componentName}.story.js"`,
      `${componentPathDir}/${componentName}.story.js`,
      componentName
    );
  }
}

export async function getGenerateReactConfigFile() {
  // Make sure the cli commands are running from the root level of the project
  try {
    accessSync('./package.json', constants.R_OK);

    // check to see if the grc config file exists
    try {
      accessSync('./generate-react-cli.json', constants.R_OK);
      return JSON.parse(readFileSync('./generate-react-cli.json'));
    } catch (e) {
      try {
        console.log('');
        console.log(
          chalk.cyan(
            '============================================================================================================================'
          )
        );
        console.log(
          chalk.cyan("Looks like this is the first time you're running generate-react-cli within this project.")
        );
        console.log('');
        console.log(chalk.cyan('Answer a few questions to customize the generate-react-cli for your project needs.'));
        console.log(
          chalk.cyan(
            '============================================================================================================================'
          )
        );
        console.log('');

        const answers = await prompt([
          {
            type: 'input',
            name: 'component.path',
            message:
              'Would you like to override the default path directory to where your components will be generated in? Press enter for default',
            default: function() {
              return 'src/components';
            },
          },
          {
            type: 'list',
            name: 'component.css.preprocessor',
            message: 'Does your project use a CSS Preprocessor?',
            choices: ['css', 'scss', 'less', 'styl'],
          },
          {
            type: 'list',
            name: 'component.css.module',
            message: 'Does your project use a CSS modules?',
            choices: ['No', 'Yes'],
            filter: val => (val === 'Yes' ? true : false),
          },
          {
            type: 'list',
            name: 'component.withTest',
            message: 'Create a corresponding test file with each component you generate?',
            choices: ['No', 'Yes'],
            filter: val => (val === 'Yes' ? true : false),
          },
          {
            type: 'list',
            name: 'component.withStory',
            message:
              'Does your project use Storybook and would you like to create a corresponding story with each component you generate?',
            choices: ['No', 'Yes'],
            filter: val => (val === 'Yes' ? true : false),
          },
        ]);

        outputFileSync('generate-react-cli.json', JSON.stringify(answers, null, 2));

        console.log('');
        console.log(
          chalk.cyan(
            'A config file ("generate-react-cli.json") was created successfully on the root level of your project.'
          )
        );

        console.log('');
        console.log(chalk.cyan('You can always go back and update it as needed.'));
        console.log('');
        console.log(chalk.cyan('Happy Hacking!'));
        console.log('');
        console.log('');

        return answers;
      } catch (e) {
        console.error(chalk.red.bold('ERROR: Could not generate "generate-react-cli.json" config file.'));
      }
    }
  } catch (error) {
    console.error(
      chalk.red.bold(
        "ERROR: Please make sure that you're running the generate-react-cli commands from the root level of your React project"
      )
    );
    process.exit(1);
  }
}

// private

function generateTemplate(template, templateType, componentPath, componentName) {
  // Make sure the component templateType does not already exist in the path directory.
  if (existsSync(componentPath)) {
    console.error(chalk.red(`${templateType} already exists in this path "${componentPath}".`));
  } else {
    try {
      outputFileSync(componentPath, template);

      replace({
        regex: 'TemplateName',
        replacement: componentName,
        paths: [componentPath],
        recursive: false,
        silent: true,
      });

      console.log(chalk.green(`${templateType} was created successfully at ${componentPath}`));
    } catch (error) {
      console.error(chalk.red(`${templateType} failed and was not created.`));
      console.error(error);
    }
  }
}
