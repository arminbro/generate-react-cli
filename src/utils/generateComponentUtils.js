import path from 'node:path';
import fsExtra from 'fs-extra';
import camelCase from 'lodash/camelCase.js';
import kebabCase from 'lodash/kebabCase.js';
import snakeCase from 'lodash/snakeCase.js';
import startCase from 'lodash/startCase.js';
import replace from 'replace';
import componentCssTemplate from '../templates/component/componentCssTemplate.js';

import componentJsTemplate from '../templates/component/componentJsTemplate.js';
import componentLazyTemplate from '../templates/component/componentLazyTemplate.js';
import componentStoryTemplate from '../templates/component/componentStoryTemplate.js';
import componentStyledTemplate from '../templates/component/componentStyledTemplate.js';
import componentTestDefaultTemplate from '../templates/component/componentTestDefaultTemplate.js';
import componentTestTestingLibraryTemplate from '../templates/component/componentTestTestingLibraryTemplate.js';
import componentTestVitestTemplate from '../templates/component/componentTestVitestTemplate.js';
import componentTsLazyTemplate from '../templates/component/componentTsLazyTemplate.js';
import componentTsTemplate from '../templates/component/componentTsTemplate.js';
import { error, exitWithError, fileSummary } from './messagesUtils.js';

const TEMPLATE_NAME_REGEX = /template[-_]?name/i;

const { existsSync, outputFileSync, readFileSync } = fsExtra;

export function getComponentByType(args, cliConfigFile) {
  const hasComponentTypeOption = args.find(arg => arg.includes('--type'));

  // Check for component type option.

  if (hasComponentTypeOption) {
    const componentType = hasComponentTypeOption.split('=')[1]; // get the component type value
    const selectedComponentType = cliConfigFile.component[componentType];

    // If the selected component type does not exists in the cliConfigFile under `component` throw an error

    if (!selectedComponentType) {
      const availableTypes = Object.keys(cliConfigFile.component).join(', ');
      exitWithError(`Unknown component type "${componentType}"`, {
        details: `Available types: ${availableTypes}`,
        suggestions: [
          `Use one of the available types: ${availableTypes}`,
          'Add this component type to your generate-react-cli.json config',
        ],
      });
    }

    // Otherwise return it.

    return selectedComponentType;
  }

  // Otherwise return the default component type.

  return cliConfigFile.component.default;
}

export function getCorrespondingComponentFileTypes(component) {
  return Object.keys(component).filter(key => key.split('with').length > 1);
}

function getCustomTemplate(componentName, templatePath) {
  // Try loading custom template

  try {
    const template = readFileSync(templatePath, 'utf8');
    const filename = path.basename(templatePath).replace(/template[_-]?name/i, componentName);

    return { template, filename };
  } catch {
    exitWithError(`Custom template not found: "${templatePath}"`, {
      suggestions: [
        'Verify the template path in your generate-react-cli.json config',
        'Check that the file exists and is readable',
        'Use an absolute path or a path relative to project root',
      ],
    });
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
    ].filter(e => Boolean(e) && typeof e === 'string');

    if (customDirectoryConfigs.length > 0) {
      const customDirectory = customDirectoryConfigs.slice(-1).toString();

      // Check if the customDirectory contains a template placeholder
      if (!TEMPLATE_NAME_REGEX.test(customDirectory)) {
        exitWithError(`Invalid customDirectory: "${customDirectory}"`, {
          details: 'customDirectory must contain a template placeholder',
          suggestions: [
            'Use templatename, TemplateName, template-name, or template_name',
            'Example: "{{templatename}}" or "TemplateName"',
          ],
        });
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
  const { cssPreprocessor, testLibrary, usesCssModule, usesTypeScript } = cliConfigFile;
  const { customTemplates } = cliConfigFile.component[cmd.type];
  let template = null;
  let filename = null;

  // Check for a custom component template.

  if (customTemplates && customTemplates.component) {
    // Load and use the custom component template

    const { template: customTemplate, filename: customTemplateFilename } = getCustomTemplate(
      componentName,
      customTemplates.component,
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // Else use GRC built-in component template

    template = usesTypeScript ? componentTsTemplate : componentJsTemplate;
    filename = usesTypeScript ? `${componentName}.tsx` : `${componentName}.js`;

    // If test library doesn't use data-testid or if withTest is false. Remove data-testid from template

    const usesTestId = testLibrary === 'Testing Library' || testLibrary === 'Vitest';
    if (!usesTestId || !cmd.withTest) {
      template = template.replace(` data-testid="templatename"`, '');
    }

    // If it has a corresponding stylesheet

    if (cmd.withStyle) {
      if (cliConfigFile.usesStyledComponents) {
        const cssPath = `${componentName}.styled`;
        template = template.replace(
          `import styles from './templatename.module.css'`,
          `import { templatenameWrapper } from './${cssPath}'`,
        );
        template = template.replace(` className={styles.templatename}`, '');
        template = template.replace(` <div`, '<templatenameWrapper');
        template = template.replace(` </div>`, '</templatenameWrapper>');
      } else {
        const module = usesCssModule ? '.module' : '';
        const cssPath = `${componentName}${module}.${cssPreprocessor}`;

        // If the css module is true make sure to update the template accordingly

        if (module.length) {
          template = template.replace(`'./templatename.module.css'`, `'./${cssPath}'`);
        } else {
          template = template.replace(`{styles.templatename}`, `"${componentName}"`);
          template = template.replace(`styles from './templatename.module.css'`, `'./${cssPath}'`);
        }
      }
    } else {
      // If no stylesheet, remove className attribute and style import from jsTemplate

      template = template.replace(` className={styles.templatename}`, '');
      template = template.replace(`import styles from './templatename.module.css';`, '');
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
    // Load and use the custom style template

    const { template: customTemplate, filename: customTemplateFilename } = getCustomTemplate(
      componentName,
      customTemplates.style,
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

      // Else use GRC built-in style template

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
    // Load and use the custom test template

    const { template: customTemplate, filename: customTemplateFilename } = getCustomTemplate(
      componentName,
      customTemplates.test,
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    filename = usesTypeScript ? `${componentName}.test.tsx` : `${componentName}.test.js`;

    if (testLibrary === 'Testing Library') {
      template = componentTestTestingLibraryTemplate;
    } else if (testLibrary === 'Vitest') {
      template = componentTestVitestTemplate;
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
    // Load and use the custom story template

    const { template: customTemplate, filename: customTemplateFilename } = getCustomTemplate(
      componentName,
      customTemplates.story,
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // Else use GRC built-in story template

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
    // Load and use the custom lazy template

    const { template: customTemplate, filename: customTemplateFilename } = getCustomTemplate(
      componentName,
      customTemplates.lazy,
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // Else use GRC built-in lazy template

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
    exitWithError(`Missing custom template for "${fileType}"`, {
      details: 'Custom component files require a matching custom template',
      suggestions: [
        `Add a "${fileType}" template path to customTemplates in your config`,
        'Check that the template file exists at the specified path',
      ],
    });
  }

  // Load and use the custom component template.

  const { template: customTemplate, filename: customTemplateFilename } = getCustomTemplate(
    componentName,
    customTemplates[fileType],
  );

  template = customTemplate;
  filename = customTemplateFilename;

  return {
    componentPath: componentDirectoryNameGenerator({ cmd, componentName, cliConfigFile, filename, convertors }),
    filename,
    template,
  };
}

// Built in component file types

const buildInComponentFileTypes = {
  COMPONENT: 'component',
  STYLE: 'withStyle',
  TEST: 'withTest',
  STORY: 'withStory',
  LAZY: 'withLazy',
};

// Generate component template map

const componentTemplateGeneratorMap = {
  [buildInComponentFileTypes.COMPONENT]: componentTemplateGenerator,
  [buildInComponentFileTypes.STYLE]: componentStyleTemplateGenerator,
  [buildInComponentFileTypes.TEST]: componentTestTemplateGenerator,
  [buildInComponentFileTypes.STORY]: componentStoryTemplateGenerator,
  [buildInComponentFileTypes.LAZY]: componentLazyTemplateGenerator,
};

export function generateComponent(componentName, cmd, cliConfigFile) {
  const componentFileTypes = ['component', ...getCorrespondingComponentFileTypes(cmd)];
  const generatedFiles = [];
  let basePath = '';

  componentFileTypes.forEach((componentFileType) => {
    // Generate templates only if the component options (withStyle, withTest, etc..) are true,
    // or if the template type is "component"

    if (
      (cmd[componentFileType] && cmd[componentFileType].toString() === 'true')
      || componentFileType === buildInComponentFileTypes.COMPONENT
    ) {
      const generateTemplate = componentTemplateGeneratorMap[componentFileType] || customFileTemplateGenerator;

      const convertors = {
        'templatename': componentName,
        'TemplateName': startCase(camelCase(componentName)).replace(/ /g, ''),
        'templateName': camelCase(componentName),
        'template-name': kebabCase(componentName),
        'template_name': snakeCase(componentName),
        'TEMPLATE_NAME': snakeCase(componentName).toUpperCase(),
        'TEMPLATENAME': componentName.toUpperCase(),
      };

      const { componentPath, filename, template } = generateTemplate({
        cmd,
        componentName,
        cliConfigFile,
        componentFileType,
        convertors,
      });

      // Extract base path for summary
      if (!basePath) {
        basePath = path.dirname(componentPath);
      }

      // Make sure the component does not already exist in the path directory.

      if (existsSync(componentPath)) {
        generatedFiles.push({ filename, status: 'skipped', path: componentPath });
      } else {
        try {
          if (!cmd.dryRun) {
            outputFileSync(componentPath, template);

            // Replace all template placeholders with their corresponding component name formats
            Object.entries(convertors).forEach(([pattern, replacement]) => {
              replace({ regex: pattern, replacement, paths: [componentPath], recursive: false, silent: true });
            });
          }

          generatedFiles.push({ filename, status: 'created', path: componentPath });
        } catch (err) {
          generatedFiles.push({ filename, status: 'failed', path: componentPath });
          error(`Failed to create ${filename}`, {
            details: err.message,
            suggestions: [
              'Check that you have write permissions to the target directory',
              'Verify the path is valid',
            ],
          });
        }
      }
    }
  });

  // Show summary
  fileSummary(generatedFiles, basePath, { dryRun: cmd.dryRun });
}
