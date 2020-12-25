const chalk = require('chalk');
const { upperFirst } = require('lodash');
const {
  componentTemplateTypes,
  generateComponentTemplates,
  getComponentTemplate,
} = require('../services/componentTemplateService');

function generateComponent(cmd, cliConfigFile, componentName) {
  const componentTemplates = [];

  // --- Make sure component name is valid.

  if (!componentName.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
    console.error(
      chalk.red.bold(
        'ERROR: Component name is invalid. Please use a valid naming convention for the component you are trying to create.'
      )
    );

    return;
  }

  // --- Iterate through componentTemplateTypes and build a list of componentTemplates.

  Object.values(componentTemplateTypes).forEach((componentTemplateType) => {
    // --- Only get template if component option (withStyle, withTest, etc..) is true, or if template type is "component"

    if (
      (cmd[componentTemplateType] && cmd[componentTemplateType].toString() === 'true') ||
      componentTemplateType === componentTemplateTypes.COMPONENT
    ) {
      const template = getComponentTemplate(cmd, cliConfigFile, upperFirst(componentName), componentTemplateType);

      if (template) {
        componentTemplates.push(template);
      }
    }
  });

  generateComponentTemplates(componentTemplates);
}

module.exports = {
  generateComponent,
};
