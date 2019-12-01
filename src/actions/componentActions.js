import chalk from 'chalk';
import { componentTemplateTypes, generateComponentTemplates, getComponentTemplate } from '../services/templateService';

export function generateComponent(componentName, cmd, componentConfig) {
  const componentTemplates = [];
  const componentTemplateTypeList = Object.values(componentTemplateTypes);

  // --- Make sure component name is valid.

  if (!componentName.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
    console.error(
      chalk.red.bold(
        'ERROR: Component name is invalid. Please use a valid naming convention for the component you are trying to create.'
      )
    );

    return;
  }

  // --- Iterate through componentTemplateTypeList and build a list of componentTemplates.

  for (let i = 0; i < componentTemplateTypeList.length; i += 1) {
    const componentTemplateType = componentTemplateTypeList[i];

    // --- Only get template if component option (withStyle, withTest, etc..) is true, or if template type is "component"

    if (cmd[componentTemplateType] || componentTemplateType === componentTemplateTypes.COMPONENT) {
      const template = getComponentTemplate(cmd, componentConfig, componentName, componentTemplateType);

      if (template) {
        componentTemplates.push(template);
      }
    }
  }

  generateComponentTemplates(componentTemplates);
}
