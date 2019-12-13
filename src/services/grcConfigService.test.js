const { getCLIConfigFile } = require('./grcConfigService');

describe('componentTemplateService', () => {
  it('getCLIConfigFile should be defined.', () => {
    expect(getCLIConfigFile).toBeDefined();
  });
});
