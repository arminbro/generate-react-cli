const chalk = require('chalk');
const deepKeys = require('deep-keys');
const { prompt } = require('inquirer');
const { merge } = require('lodash');
const { accessSync, constants, outputFileSync, readFileSync } = require('fs-extra');

// private

// --- Generate React Config file questions.

const grcConfigQuestions = [
  {
    type: 'input',
    name: 'component.path',
    message: 'Set the default path directory to where your components will be generated in?',
    default: () => 'src/components',
  },
  {
    type: 'confirm',
    name: 'usesTypeScript',
    message: 'Does this project use TypeScript?',
  },
  {
    type: 'list',
    name: 'component.css.preprocessor',
    message: 'Does this project use a CSS Preprocessor?',
    choices: ['css', 'scss', 'less', 'styl'],
  },
  {
    type: 'confirm',
    name: 'component.css.module',
    message: 'Does this project use CSS modules?',
  },
  {
    type: 'confirm',
    name: 'component.css.withStyle',
    message: 'Would you like to create a corresponding stylesheet file with each component you generate?',
  },
  {
    type: 'list',
    name: 'component.test.library',
    message: 'What testing component library does your project use?',
    choices: ['Enzyme', 'Testing Library', 'None'],
  },
  {
    type: 'confirm',
    name: 'component.test.withTest',
    message: 'Would you like to create a corresponding test file with each component you generate?',
  },
  {
    type: 'confirm',
    name: 'component.withStory',
    message:
      'Does your project use Storybook and would you like to create a corresponding story with each component you generate?',
  },
  {
    type: 'confirm',
    name: 'component.withLazy',
    message:
      'Would you like to create a corresponding lazy file (a file that lazy-loads your component out of the box and enables code splitting: https://reactjs.org/docs/code-splitting.html#code-splitting) with each component you generate?',
  },
];

async function createCLIConfigFile() {
  try {
    console.log();
    console.log(
      chalk.cyan(
        '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------'
      )
    );
    console.log(
      chalk.cyan("It looks like this is the first time that you're running generate-react-cli within this project.")
    );
    console.log();
    console.log(
      chalk.cyan(
        'Answer a few questions to customize generate-react-cli for your project needs (this will create a "generate-react-cli.json" config file on the root level of this project).'
      )
    );
    console.log(
      chalk.cyan(
        '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------'
      )
    );
    console.log();

    const answers = await prompt(grcConfigQuestions);

    outputFileSync('generate-react-cli.json', JSON.stringify(answers, null, 2));

    console.log();
    console.log(
      chalk.cyan(
        'A config file ("generate-react-cli.json") has successfully created on the root level of your project.'
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
    console.error(chalk.red.bold('ERROR: Could not create a "generate-react-cli.json" config file.'));
    return e;
  }
}

async function updateCLIConfigFile(missingConfigQuestions, currentConfigFile) {
  try {
    console.log('');
    console.log(
      chalk.cyan(
        '------------------------------------------------------------------------------------------------------------------------------'
      )
    );
    console.log(
      chalk.cyan(
        'Generate React CLI has been updated and has a few new features from the last time you ran it within this project.'
      )
    );
    console.log('');
    console.log(chalk.cyan('Please answer a few questions to update the "generate-react-cli.json" config file.'));
    console.log(
      chalk.cyan(
        '------------------------------------------------------------------------------------------------------------------------------'
      )
    );
    console.log('');

    const answers = await prompt(missingConfigQuestions);
    const updatedAnswers = merge({}, currentConfigFile, answers);

    outputFileSync('generate-react-cli.json', JSON.stringify(updatedAnswers, null, 2));

    console.log();
    console.log(chalk.cyan('The ("generate-react-cli.json") has successfully updated for this project.'));

    console.log();
    console.log(chalk.cyan('You can always go back and manually update it as needed.'));
    console.log();
    console.log(chalk.cyan('Happy Hacking!'));
    console.log();
    console.log();

    return updatedAnswers;
  } catch (e) {
    console.error(chalk.red.bold('ERROR: Could not update the "generate-react-cli.json" config file.'));
    return e;
  }
}

// public

async function getCLIConfigFile() {
  // --- Make sure the cli commands are running from the root level of the project

  try {
    accessSync('./package.json', constants.R_OK);

    // --- Check to see if the config file exists

    try {
      accessSync('./generate-react-cli.json', constants.R_OK);
      const currentConfigFile = JSON.parse(readFileSync('./generate-react-cli.json'));

      /**
       *  Check to see if there's a difference between grcConfigQuestions and the currentConfigFile.
       *  If there is, update the currentConfigFile with the missingConfigQuestions.
       */

      const missingConfigQuestions = grcConfigQuestions.filter(
        question => !deepKeys(currentConfigFile).includes(question.name)
      );

      if (missingConfigQuestions.length) {
        return await updateCLIConfigFile(missingConfigQuestions, currentConfigFile);
      }

      return currentConfigFile;
    } catch (e) {
      return await createCLIConfigFile();
    }
  } catch (error) {
    console.error(
      chalk.red.bold(
        "ERROR: Please make sure that you're running the generate-react-cli commands from the root level of your React project"
      )
    );
    return process.exit(1);
  }
}

module.exports = {
  getCLIConfigFile,
};
