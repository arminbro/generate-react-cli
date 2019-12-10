const {
  componentTemplateTypes,
  generateComponentTemplates,
  getComponentTemplate,
} = require('../../src/services/componentTemplateService');

describe('componentTemplateService', () => {
  it('componentTemplateTypes should be defined.', () => {
    expect(componentTemplateTypes).toBeDefined();
  });

  it('generateComponentTemplates should be defined.', () => {
    expect(generateComponentTemplates).toBeDefined();
  });

  it('getComponentTemplate should be defined.', () => {
    expect(getComponentTemplate).toBeDefined();
  });
});
