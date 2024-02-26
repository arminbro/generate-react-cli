import chalk from 'chalk';
import path from 'path';
import replace from 'replace';
import camelCase from 'lodash/camelCase.js';
import kebabCase from 'lodash/kebabCase.js';
import snakeCase from 'lodash/snakeCase.js';
import startCase from 'lodash/startCase.js';
import fsExtra from 'fs-extra';

import componentJsTemplate from '../templates/component/componentJsTemplate.js';
import componentTsTemplate from '../templates/component/componentTsTemplate.js';
import componentCssTemplate from '../templates/component/componentCssTemplate.js';
import componentStyledTemplate from '../templates/component/componentStyledTemplate.js';
import componentLazyTemplate from '../templates/component/componentLazyTemplate.js';
import componentTsLazyTemplate from '../templates/component/componentTsLazyTemplate.js';
import componentStoryTemplate from '../templates/component/componentStoryTemplate.js';
import componentTestEnzymeTemplate from '../templates/component/componentTestEnzymeTemplate.js';
import componentTestDefaultTemplate from '../templates/component/componentTestDefaultTemplate.js';
import componentTestTestingLibraryTemplate from '../templates/component/componentTestTestingLibraryTemplate.js';

const templateNameRE = /.*(template[|_-]?name).*/i;

const { existsSync, outputFileSync, readFileSync } = fsExtra;

export function getComponentByType(args, cliConfigFile) {
  const hasComponentTypeOption = args.find((arg) => arg.includes('--type'));

  // Check for component type option.

  if (hasComponentTypeOption) {
    const componentType = hasComponentTypeOption.split('=')[1]; // get the component type value
    const selectedComponentType = cliConfigFile.component[componentType];

    // If the selected component type does not exists in the cliConfigFile under `component` throw an error

    if (!selectedComponentType) {
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

    // Otherwise return it.

    return selectedComponentType;
  }

  // Otherwise return the default component type.

  return cliConfigFile.component.default;
}

export function getCorrespondingComponentFileTypes(component) {
  return Object.keys(component).filter((key) => key.split('with').length > 1);
}

function getCustomTemplate(componentName, templatePath) {
  // --- Try loading custom template

  try {
    const template = readFileSync(templatePath, 'utf8');
    const filename = path.basename(templatePath).replace('TemplateName', componentName);

    return { template, filename };
  } catch (e) {
    console.error(
      chalk.red(
        `
ERROR: The custom template path of "${templatePath}" does not exist.
Please make sure you're pointing to the right custom template path in your generate-react-cli.json config file.
        `
      )
    );

    return process.exit(1);
  }
}

function componentDirectoryNameGenerator({ cmd, componentName, cliConfigFile, filename, convertors }) {
  let componentPath = cmd.path;

  if (cmd.flat !== true) {
    let componentDirectory = componentName;

    const customDirectoryConfigs = [
      cliConfigFile.customDirectory,
      cliConfigFile.component.default.customDirectory,
      cliConfigFile.component[cmd.type].customDirectory,
      cmd.customDirectory,
    ].filter((e) => Boolean(e) && typeof e === 'string');

    if (customDirectoryConfigs.length > 0) {
      const customDirectory = customDirectoryConfigs.slice(-1).toString();

      // Double check if the customDirectory is templatable
      if (templateNameRE.exec(customDirectory) == null) {
        console.error(
          chalk.red(
            `customDirectory [${customDirectory}] for ${componentName} does not contain a templatable value.\nPlease check your configuration!`
          )
        );

        process.exit(-2);
      }

      for (const convertor in convertors) {
        const re = new RegExp(`.*${convertor}.*`);

        if (re.exec(customDirectory) !== null) {
          componentDirectory = customDirectory.replace(convertor, convertors[convertor]);
        }
      }
    }

    componentPath += `/${componentDirectory}`;
  }

  componentPath += `/${filename}`;

  return componentPath;
}

function componentTemplateGenerator({ cmd, componentName, cliConfigFile, convertors }) {
  // @ts-ignore
  const { usesStyledComponents, cssPreprocessor, testLibrary, usesCssModule, usesTypeScript } = cliConfigFile;
  const { customTemplates } = cliConfigFile.component[cmd.type];
  let template = null;
  let filename = null;

  // Check for a custom component template.

  if (customTemplates && customTemplates.component) {
    // --- Load and use the custom component template

    const { template: customTemplate, filename: customTemplateFilename } = getCustomTemplate(
      componentName,
      customTemplates.component
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // --- Else use GRC built-in component template

    template = usesTypeScript ? componentTsTemplate : componentJsTemplate;
    filename = usesTypeScript ? `${componentName}.tsx` : `${componentName}.js`;

    // --- If test library is not Testing Library or if withTest is false. Remove data-testid from template

    if (testLibrary !== 'Testing Library' || !cmd.withTest) {
      template = template.replace(` data-testid="TemplateName"`, '');
    }

    // --- If it has a corresponding stylesheet

    if (cmd.withStyle) {
      if (cliConfigFile.usesStyledComponents) {
        const cssPath = `${componentName}.styled`;
        template = template.replace(
          `import styles from './TemplateName.module.css'`,
          `import { TemplateNameWrapper } from './${cssPath}'`
        );
        template = template.replace(` className={styles.TemplateName}`, '');
        template = template.replace(` <div`, '<TemplateNameWrapper');
        template = template.replace(` </div>`, '</TemplateNameWrapper>');
      } else {
        const module = usesCssModule ? '.module' : '';
        const cssPath = `${componentName}${module}.${cssPreprocessor}`;

        // --- If the css module is true make sure to update the template accordingly

        if (module.length) {
          template = template.replace(`'./TemplateName.module.css'`, `'./${cssPath}'`);
        } else {
          template = template.replace(`{styles.TemplateName}`, `"${componentName}"`);
          template = template.replace(`styles from './TemplateName.module.css'`, `'./${cssPath}'`);
        }
      }
    } else {
      // --- If no stylesheet, remove className attribute and style import from jsTemplate

      template = template.replace(` className={styles.TemplateName}`, '');
      template = template.replace(`import styles from './TemplateName.module.css';`, '');
    }
  }

  return {
    componentPath: componentDirectoryNameGenerator({ cmd, componentName, cliConfigFile, filename, convertors }),
    filename,
    template,
  };
}

function componentStyleTemplateGenerator({ cliConfigFile, cmd, componentName, convertors }) {
  const { customTemplates } = cliConfigFile.component[cmd.type];
  let template = null;
  let filename = null;

  // Check for a custom style template.

  if (customTemplates && customTemplates.style) {
    // --- Load and use the custom style template

    const { template: customTemplate, filename: customTemplateFilename } = getCustomTemplate(
      componentName,
      customTemplates.style
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    const { usesTypeScript, usesStyledComponents, cssPreprocessor, usesCssModule } = cliConfigFile;
    if (usesStyledComponents) {
      filename = usesTypeScript ? `${componentName}.styled.ts` : `${componentName}.styled.js`;
      template = componentStyledTemplate;
    } else {
      const module = usesCssModule ? '.module' : '';
      const cssFilename = `${componentName}${module}.${cssPreprocessor}`;

      // --- Else use GRC built-in style template

      template = componentCssTemplate;
      filename = cssFilename;
    }
  }

  return {
    componentPath: componentDirectoryNameGenerator({ cmd, componentName, cliConfigFile, filename, convertors }),
    filename,
    template,
  };
}

function componentTestTemplateGenerator({ cliConfigFile, cmd, componentName, convertors }) {
  const { customTemplates } = cliConfigFile.component[cmd.type];
  const { testLibrary, usesTypeScript } = cliConfigFile;
  let template = null;
  let filename = null;

  // Check for a custom test template.

  if (customTemplates && customTemplates.test) {
    // --- Load and use the custom test template

    const { template: customTemplate, filename: customTemplateFilename } = getCustomTemplate(
      componentName,
      customTemplates.test
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    filename = usesTypeScript ? `${componentName}.test.tsx` : `${componentName}.test.js`;

    if (testLibrary === 'Enzyme') {
      // --- Else use GRC built-in test template based on test library type

      template = componentTestEnzymeTemplate;
    } else if (testLibrary === 'Testing Library') {
      template = componentTestTestingLibraryTemplate;
    } else {
      template = componentTestDefaultTemplate;
    }
  }

  return {
    componentPath: componentDirectoryNameGenerator({ cmd, componentName, cliConfigFile, filename, convertors }),
    filename,
    template,
  };
}

function componentStoryTemplateGenerator({ cliConfigFile, cmd, componentName, convertors }) {
  const { usesTypeScript } = cliConfigFile;
  const { customTemplates } = cliConfigFile.component[cmd.type];
  let template = null;
  let filename = null;

  // Check for a custom story template.

  if (customTemplates && customTemplates.story) {
    // --- Load and use the custom story template

    const { template: customTemplate, filename: customTemplateFilename } = getCustomTemplate(
      componentName,
      customTemplates.story
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // --- Else use GRC built-in story template

    template = componentStoryTemplate;
    filename = usesTypeScript ? `${componentName}.stories.tsx` : `${componentName}.stories.js`;
  }

  return {
    componentPath: componentDirectoryNameGenerator({ cmd, componentName, cliConfigFile, filename, convertors }),
    filename,
    template,
  };
}

function componentLazyTemplateGenerator({ cmd, componentName, cliConfigFile, convertors }) {
  const { usesTypeScript } = cliConfigFile;
  const { customTemplates } = cliConfigFile.component[cmd.type];
  let template = null;
  let filename = null;

  // Check for a custom lazy template.

  if (customTemplates && customTemplates.lazy) {
    // --- Load and use the custom lazy template

    const { template: customTemplate, filename: customTemplateFilename } = getCustomTemplate(
      componentName,
      customTemplates.lazy
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // --- Else use GRC built-in lazy template

    template = usesTypeScript ? componentTsLazyTemplate : componentLazyTemplate;
    filename = usesTypeScript ? `${componentName}.lazy.tsx` : `${componentName}.lazy.js`;
  }

  return {
    componentPath: componentDirectoryNameGenerator({ cmd, componentName, cliConfigFile, filename, convertors }),
    filename,
    template,
  };
}

function customFileTemplateGenerator({ componentName, cmd, cliConfigFile, componentFileType, convertors }) {
  const { customTemplates } = cliConfigFile.component[cmd.type];
  const fileType = camelCase(componentFileType.split('with')[1]);
  let filename = null;
  let template = null;

  // Check for a valid custom template for the corresponding custom component file.

  if (!customTemplates || !customTemplates[fileType]) {
    console.error(
      chalk.red(
        `
ERROR: Custom component files require a valid custom template.
Please make sure you're pointing to the right custom template path in your generate-react-cli.json config file.
        `
      )
    );

    return process.exit(1);
  }

  // --- Load and use the custom component template.

  const { template: customTemplate, filename: customTemplateFilename } = getCustomTemplate(
    componentName,
    customTemplates[fileType]
  );

  template = customTemplate;
  filename = customTemplateFilename;

  return {
    componentPath: componentDirectoryNameGenerator({ cmd, componentName, cliConfigFile, filename, convertors }),
    filename,
    template,
  };
}

// --- Built in component file types

const buildInComponentFileTypes = {
  COMPONENT: 'component',
  STYLE: 'withStyle',
  TEST: 'withTest',
  STORY: 'withStory',
  LAZY: 'withLazy',
};

// --- Generate component template map

const componentTemplateGeneratorMap = {
  [buildInComponentFileTypes.COMPONENT]: componentTemplateGenerator,
  [buildInComponentFileTypes.STYLE]: componentStyleTemplateGenerator,
  [buildInComponentFileTypes.TEST]: componentTestTemplateGenerator,
  [buildInComponentFileTypes.STORY]: componentStoryTemplateGenerator,
  [buildInComponentFileTypes.LAZY]: componentLazyTemplateGenerator,
};

export function generateComponent(componentName, cmd, cliConfigFile) {
  const componentFileTypes = ['component', ...getCorrespondingComponentFileTypes(cmd)];

  componentFileTypes.forEach((componentFileType) => {
    // --- Generate templates only if the component options (withStyle, withTest, etc..) are true,
    // or if the template type is "component"

    if (
      (cmd[componentFileType] && cmd[componentFileType].toString() === 'true') ||
      componentFileType === buildInComponentFileTypes.COMPONENT
    ) {
      const generateTemplate = componentTemplateGeneratorMap[componentFileType] || customFileTemplateGenerator;

      const convertors = {
        templatename: componentName,
        TemplateName: startCase(camelCase(componentName)).replace(/ /g, ''),
        templateName: camelCase(componentName),
        'template-name': kebabCase(componentName),
        template_name: snakeCase(componentName),
        TEMPLATE_NAME: snakeCase(componentName).toUpperCase(),
      };

      const { componentPath, filename, template } = generateTemplate({
        cmd,
        componentName,
        cliConfigFile,
        componentFileType,
        convertors,
      });

      // --- Make sure the component does not already exist in the path directory.

      if (existsSync(componentPath)) {
        console.error(chalk.red(`${filename} already exists in this path "${componentPath}".`));
      } else {
        try {
          if (!cmd.dryRun) {
            outputFileSync(componentPath, template);

            // Will replace the templatename in whichever format the user typed the component name in the command.
            replace({
              regex: 'templatename',
              replacement: convertors['templatename'],
              paths: [componentPath],
              recursive: false,
              silent: true,
            });

            // Will replace the TemplateName in PascalCase
            replace({
              regex: 'TemplateName',
              replacement: convertors['TemplateName'],
              paths: [componentPath],
              recursive: false,
              silent: true,
            });

            // Will replace the templateName in camelCase
            replace({
              regex: 'templateName',
              replacement: convertors['templateName'],
              paths: [componentPath],
              recursive: false,
              silent: true,
            });

            // Will replace the template-name in kebab-case
            replace({
              regex: 'template-name',
              replacement: convertors['template-name'],
              paths: [componentPath],
              recursive: false,
              silent: true,
            });

            // Will replace the template_name in snake_case
            replace({
              regex: 'template_name',
              replacement: convertors['template_name'],
              paths: [componentPath],
              recursive: false,
              silent: true,
            });

            // Will replace the TEMPLATE_NAME in uppercase SNAKE_CASE
            replace({
              regex: 'TEMPLATE_NAME',
              replacement: convertors['TEMPLATE_NAME'],
              paths: [componentPath],
              recursive: false,
              silent: true,
            });
          }

          console.log(chalk.green(`${filename} was successfully created at ${componentPath}`));
        } catch (error) {
          console.error(chalk.red(`${filename} failed and was not created.`));
          console.error(error);
        }
      }
    }
  });

  if (cmd.dryRun) {
    console.log();
    console.log(chalk.yellow(`NOTE: The "dry-run" flag means no changes were made.`));
  }
}
