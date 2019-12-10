const { getCLIConfigFile } = require('../../src/services/grcConfigService');

describe('componentTemplateService', () => {
  it('getCLIConfigFile should be defined.', () => {
    expect(getCLIConfigFile).toBeDefined();
  });
});
