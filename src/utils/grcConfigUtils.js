import fsExtra from 'fs-extra';
import inquirer from 'inquirer';

import merge from 'lodash/merge.js';
import deepKeys from './deepKeysUtils.js';
import { blank, error, exitWithError, header, outro, success } from './messagesUtils.js';

const { accessSync, constants, outputFileSync, readFileSync } = fsExtra;
const { prompt } = inquirer;

// Generate React Config file questions.

// --- project level questions.

const projectLevelQuestions = [
  {
    type: 'confirm',
    name: 'usesTypeScript',
    message: 'Does this project use TypeScript?',
  },
  {
    type: 'confirm',
    name: 'usesStyledComponents',
    message: 'Does this project use styled-components?',
  },
  {
    type: 'confirm',
    when: answers => !answers.usesStyledComponents,
    name: 'usesCssModule',
    message: 'Does this project use CSS modules?',
  },
  {
    type: 'select',
    name: 'cssPreprocessor',
    when: answers => !answers.usesStyledComponents,
    message: 'Does this project use a CSS Preprocessor?',
    choices: ['css', 'scss', 'less', 'styl'],
  },
  {
    type: 'select',
    name: 'testLibrary',
    message: 'What testing library does your project use?',
    choices: ['Testing Library', 'Vitest', 'None'],
  },
];

// --- component level questions.

export const componentLevelQuestions = [
  {
    type: 'input',
    name: 'component.default.path',
    message:
      'Set the default path directory to where your components will be generated in?',
    default: () => 'src/components',
  },
  {
    type: 'confirm',
    name: 'component.default.withStyle',
    message:
      'Would you like to create a corresponding stylesheet file with each component you generate?',
  },
  {
    type: 'confirm',
    name: 'component.default.withTest',
    message:
      'Would you like to create a corresponding test file with each component you generate?',
  },
  {
    type: 'confirm',
    name: 'component.default.withStory',
    message:
      'Would you like to create a corresponding story with each component you generate?',
  },
  {
    type: 'confirm',
    name: 'component.default.withLazy',
    message:
      'Would you like to create a corresponding lazy file (a file that lazy-loads your component out of the box and enables code splitting: https://react.dev/reference/react/lazy) with each component you generate?',
  },
];

// --- merge all questions together.

const grcConfigQuestions = [
  ...projectLevelQuestions,
  ...componentLevelQuestions,
];

async function createCLIConfigFile() {
  try {
    header(
      'Welcome to Generate React CLI!',
      'Answer a few questions to customize the CLI for your project.',
    );

    const answers = await prompt(grcConfigQuestions);

    outputFileSync('generate-react-cli.json', JSON.stringify(answers, null, 2));

    blank();
    success('Created the generate-react-cli.json config file');
    blank();
    outro('You can always update the config file manually. Happy Hacking!');

    return answers;
  } catch (e) {
    error('Could not create config file', {
      details: 'Failed to write generate-react-cli.json',
      suggestions: [
        'Check that you have write permissions in this directory',
        'Make sure the directory is not read-only',
      ],
    });
    return e;
  }
}

async function updateCLIConfigFile(missingConfigQuestions, currentConfigFile) {
  try {
    header(
      'Generate React CLI has new features!',
      'Answer a few questions to update your config file.',
    );

    const answers = await prompt(missingConfigQuestions);
    const updatedAnswers = merge({}, currentConfigFile, answers);

    outputFileSync(
      'generate-react-cli.json',
      JSON.stringify(updatedAnswers, null, 2),
    );

    blank();
    success('Updated the generate-react-cli.json config file');
    blank();
    outro('You can always update the config file manually. Happy Hacking!');

    return updatedAnswers;
  } catch (e) {
    error('Could not update config file', {
      details: 'Failed to write generate-react-cli.json',
      suggestions: [
        'Check that the file is not locked or read-only',
        'Verify you have write permissions',
      ],
    });
    return e;
  }
}

export async function getCLIConfigFile() {
  // --- Make sure the cli commands are running from the root level of the project

  try {
    accessSync('./package.json', constants.R_OK);

    // --- Check to see if the config file exists

    try {
      accessSync('./generate-react-cli.json', constants.R_OK);
      const currentConfigFile = JSON.parse(
        readFileSync('./generate-react-cli.json'),
      );

      /**
       *  Check to see if there's a difference between grcConfigQuestions and the currentConfigFile.
       *  If there is, update the currentConfigFile with the missingConfigQuestions.
       */

      const missingConfigQuestions = grcConfigQuestions.filter(
        question =>
          !deepKeys(currentConfigFile).includes(question.name)
          && (question.when ? question.when(currentConfigFile) : true),
      );

      if (missingConfigQuestions.length) {
        return await updateCLIConfigFile(
          missingConfigQuestions,
          currentConfigFile,
        );
      }

      return currentConfigFile;
    } catch {
      return await createCLIConfigFile();
    }
  } catch {
    exitWithError('Not in project root', {
      details: 'Could not find package.json in current directory',
      suggestions: [
        'Run this command from your project root directory',
        'Make sure package.json exists in the current directory',
      ],
    });
  }
}
