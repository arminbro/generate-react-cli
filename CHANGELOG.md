# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [7.1.0](https://github.com/arminbro/generate-react-cli/compare/v7.0.6...v7.1.0) (2022-03-15)


### Features

* adds dry-run flag to preview generated paths without writing files ([483aef2](https://github.com/arminbro/generate-react-cli/commit/483aef285a356bb02727d3c512d2e03e22b6493a))

### [7.0.6](https://github.com/arminbro/generate-react-cli/compare/v7.0.5...v7.0.6) (2022-02-21)

### [7.0.5](https://github.com/arminbro/generate-react-cli/compare/v7.0.4...v7.0.5) (2022-01-17)

### [7.0.4](https://github.com/arminbro/generate-react-cli/compare/v7.0.3...v7.0.4) (2021-08-07)


### Bug Fixes

* **story:** use storybook codemod's preferred way ([b694f76](https://github.com/arminbro/generate-react-cli/commit/b694f767d5619b2880f3d8aa143b7e9f2550ff11))

### [7.0.3](https://github.com/arminbro/generate-react-cli/compare/v7.0.2...v7.0.3) (2021-06-12)

### [7.0.2](https://github.com/arminbro/generate-react-cli/compare/v7.0.1...v7.0.2) (2021-06-12)

### [7.0.1](https://github.com/arminbro/generate-react-cli/compare/v7.0.0...v7.0.1) (2021-06-12)


### Bug Fixes

* remove camelCase from componentTestTemplateGenerator, it's handled in generateComponent ([7885d22](https://github.com/arminbro/generate-react-cli/commit/7885d22b816de7a60e2adcb3d977c1b541db1ae9)), closes [#43](https://github.com/arminbro/generate-react-cli/issues/43)

## [7.0.0](https://github.com/arminbro/generate-react-cli/compare/v6.0.2...v7.0.0) (2021-05-06)


### ⚠ BREAKING CHANGES

* 🧨 Generate React CLI requires Node 12 or higher now. We no longer support
Node 10.

* 🤖 update dependencies ([331205f](https://github.com/arminbro/generate-react-cli/commit/331205f3afdc06ecccb9458dee873af9477b8e7f))

### [6.0.2](https://github.com/arminbro/generate-react-cli/compare/v6.0.1...v6.0.2) (2021-02-24)

### [6.0.1](https://github.com/arminbro/generate-react-cli/compare/v6.0.0...v6.0.1) (2021-02-17)

## [6.0.0](https://github.com/arminbro/generate-react-cli/compare/v5.2.3...v6.0.0) (2021-02-17)


### ⚠ BREAKING CHANGES

* You will need to use the "TemplateName" keyword as your custom template filename if
you want the CLI to replace it with the component name.

### Features

* custom component files ([6373a91](https://github.com/arminbro/generate-react-cli/commit/6373a912d725581571c2cdf01cf9062f3965c06f)), closes [#21](https://github.com/arminbro/generate-react-cli/issues/21) [#22](https://github.com/arminbro/generate-react-cli/issues/22) [#27](https://github.com/arminbro/generate-react-cli/issues/27) [#34](https://github.com/arminbro/generate-react-cli/issues/34) [#36](https://github.com/arminbro/generate-react-cli/issues/36) [#37](https://github.com/arminbro/generate-react-cli/issues/37) [#39](https://github.com/arminbro/generate-react-cli/issues/39)


### Bug Fixes

* use "TemplateName" keyword for custom templates ([73a308f](https://github.com/arminbro/generate-react-cli/commit/73a308fe38e660f57cde102d3a5ded64c5339fc7))
* use lodash upperFirst to force component name start with uppercase ([e401caf](https://github.com/arminbro/generate-react-cli/commit/e401cafa0e35c85db8d4c26dad5f2425f4269980))

### [5.2.3](https://github.com/arminbro/generate-react-cli/compare/v5.2.2...v5.2.3) (2021-01-05)

### [5.2.2](https://github.com/arminbro/generate-react-cli/compare/v5.2.1...v5.2.2) (2021-01-05)

## [5.2.1](https://github.com/arminbro/generate-react-cli/compare/v5.1.0...v5.2.0) (2021-01-05)

### Features

- allow generation of multiple components at once ([18cd5f0](https://github.com/arminbro/generate-react-cli/commit/18cd5f070c3007947011699d7186b8e259e27b05))

### Bug Fixes

- 🐛 react components must start with a upper case letter. ([4c3bddd](https://github.com/arminbro/generate-react-cli/commit/4c3bdddf9e93c10905f28d6b4babe77fdbf10c4f))

## [5.1.0](https://github.com/arminbro/generate-react-cli/compare/v5.0.1...v5.1.0) (2020-09-18)

### Features

- 🎸 Support for custom extension via custom templates ([7f989a6](https://github.com/arminbro/generate-react-cli/commit/7f989a61702f8ff0e612845bafed79146e6a01ef)), closes [#18](https://github.com/arminbro/generate-react-cli/issues/18) [#19](https://github.com/arminbro/generate-react-cli/issues/19) [#25](https://github.com/arminbro/generate-react-cli/issues/25)

### [5.0.1](https://github.com/arminbro/generate-react-cli/compare/v5.0.0...v5.0.1) (2020-06-24)

## [5.0.0](https://github.com/arminbro/generate-react-cli/compare/v4.3.3...v5.0.0) (2020-05-25)

### ⚠ BREAKING CHANGES

- 🧨 This new "type" option will replace the custom component commands that
  you run. Meaning you now can pass the custom component as type option
  (e.g npx generate-react-cli component HomePage --type=page ) that you
  have configured in your GRC config file.

### Features

- 🎸 Add a new "type" option to the component command ([1a5ce6a](https://github.com/arminbro/generate-react-cli/commit/1a5ce6a3c9d8d19937b201ed8fb1bc5ec6c4fae9))

### [4.3.3](https://github.com/arminbro/generate-react-cli/compare/v4.3.2...v4.3.3) (2020-05-10)

### [4.3.2](https://github.com/arminbro/generate-react-cli/compare/v4.3.1...v4.3.2) (2020-05-10)

### [4.3.1](https://github.com/arminbro/generate-react-cli/compare/v4.3.0...v4.3.1) (2020-05-10)

## [4.3.0](https://github.com/arminbro/generate-react-cli/compare/v4.2.2...v4.3.0) (2020-05-10)

### Features

- 🎸 Make 'GRC' more configurable (multi component commands) ([59f1622](https://github.com/arminbro/generate-react-cli/commit/59f1622dc6c6ca5a2b42d870b02c265694bc10eb)), closes [#14](https://github.com/arminbro/generate-react-cli/issues/14)

### [4.2.2](https://github.com/arminbro/generate-react-cli/compare/v4.2.1...v4.2.2) (2020-05-03)

### [4.2.1](https://github.com/arminbro/generate-react-cli/compare/v4.2.0...v4.2.1) (2020-05-03)

## [4.2.0](https://github.com/arminbro/generate-react-cli/compare/v4.1.1...v4.2.0) (2020-05-02)

### Features

- 🎸 Allow custom file templates ([6104241](https://github.com/arminbro/generate-react-cli/commit/610424136989b1f18de1e6fa9a04084114cde64b)), closes [#12](https://github.com/arminbro/generate-react-cli/issues/12)

### [4.1.1](https://github.com/arminbro/generate-react-cli/compare/v4.1.0...v4.1.1) (2020-04-23)

## [4.1.0](https://github.com/arminbro/generate-react-cli/compare/v4.0.2...v4.1.0) (2020-04-20)

### Features

- 🎸 add new page command ([3a441de](https://github.com/arminbro/generate-react-cli/commit/3a441dede662bf6a3d65c67072b50900ece46879)), closes [#10](https://github.com/arminbro/generate-react-cli/issues/10)

### [4.0.2](https://github.com/arminbro/generate-react-cli/compare/v4.0.1...v4.0.2) (2020-04-05)

### Bug Fixes

- 🐛 audit fix to resolve 1 low vulnerability ([0ac348e](https://github.com/arminbro/generate-react-cli/commit/0ac348ef6f6da6ecc4a72be153e22965894d796b))

### [4.0.1](https://github.com/arminbro/generate-react-cli/compare/v4.0.0...v4.0.1) (2020-04-05)

## [4.0.0](https://github.com/arminbro/generate-react-cli/compare/v3.0.2...v4.0.0) (2020-03-21)

### ⚠ BREAKING CHANGES

- 🧨 Generate React CLI requires Node 10 or higher

- 🤖 Generate React CLI requires Node 10 or higher ([bd745f6](https://github.com/arminbro/generate-react-cli/commit/bd745f659d0e538e7abfb875cd1e160c5c6b064c))

### [3.0.2](https://github.com/arminbro/generate-react-cli/compare/v3.0.1...v3.0.2) (2020-03-21)

### [3.0.1](https://github.com/arminbro/generate-react-cli/compare/v3.0.0...v3.0.1) (2020-03-14)

## [3.0.0](https://github.com/arminbro/generate-react-cli/compare/v2.0.2...v3.0.0) (2019-12-14)

### ⚠ BREAKING CHANGES

- Update the way option values are passed in the component command. For
  example if you wanted or didn't want a corresponding test file, the old
  syntax looked like this: --withTest or --no-withTest. Now with the new
  syntax you just do this --withTest=true or --withTest=false this applies
  to all the other component options (withStyle, withStory, withLazy).

- 💄 Update component command options ([c870c7c](https://github.com/arminbro/generate-react-cli/commit/c870c7c5544640e23848f4f22b883e2d0ee755e4))

### [2.0.2](https://github.com/arminbro/generate-react-cli/compare/v2.0.1...v2.0.2) (2019-12-13)

### [2.0.1](https://github.com/arminbro/generate-react-cli/compare/v2.0.0...v2.0.1) (2019-12-13)

## [2.0.0](https://github.com/arminbro/generate-react-cli/compare/v1.8.0...v2.0.0) (2019-12-13)

### ⚠ BREAKING CHANGES

- new command option parameters

### Features

- add TypeScript support ([8d13018](https://github.com/arminbro/generate-react-cli/commit/8d13018fa22042b9ac058cc4b332583d4d8abf80))

- make stylesheets optional by adding “withStyle” option

- improve developer experience when updating (“generate-react-cli.json”) the config file. The CLI will only inquire about the new missing properties in the config file the next time generate-react-cli is ran.

- 🎸 make sure user is running Node 8 or higher ([fe5dba1](https://github.com/arminbro/generate-react-cli/commit/fe5dba19e68cb8914db4ee4fc1f93fbdd808e355))

* 💡 component command has a few option updates ([67579d3](https://github.com/arminbro/generate-react-cli/commit/67579d3724af1108932670b87dc7084f9b22cbe8))

## 1.8.0 (2019-12-12)

- testing standard-version

## 1.7.5 (2019-11-24)

### Chores

- major dependency update (chalk 3.0.0)

## 1.7.4 (2019-11-24)

### Chores

- update dependencies

## 1.7.3 (2019-11-07)

### Chores

- update readme

## 1.7.2 (2019-11-06)

### Bug Fixes

- remove unnecessary use of Fragment in Lazy template

## 1.7.1 (2019-11-06)

### Chores

- update dependencies

### Bug Fixes

- remove data-testid from jsTemplate if test library is not Testing Library
- only import style object in jsTemplate if css module is true

## 1.7.0 (2019-10-17)

### Features

- (#4) make getByTestId the default

### Bug Fixes

- fix (#3) generated tests always use FollowBtn

## 1.6.2 (2019-10-02)

### Chores

- update readme

## 1.6.1 (2019-10-02)

### Features

- support different testing component libraries

### Chores

- update dependencies
- update readme

## 1.6.0 (2019-09-30)

### Chores

- update dependencies

## 1.5.9 (2019-09-29)

### Chores

- reorganize the file structure within the gr-cli

## 1.5.8 (2019-08-23)

### Chores

- bump major version of inquirer

## 1.5.7 (2019-08-23)

### Chores

- update dependencies

## 1.5.6 (2019-08-17)

### Chores

- reorganize

## 1.5.5 (2019-08-17)

### Chores

- update readme

## 1.5.4 (2019-08-17)

### Features

- add shorthand "g-r" command

## 1.5.3 (2019-08-13)

### Chores

- update issue templates for github
- add component cmd gif for readme.md
- update readme

## 1.5.2 (2019-08-12)

### Chores

- update readme

## 1.5.1 (2019-8-12)

### Chores

- update readme

## 1.5.0 (2019-08-12)

### Features

- update GRC config file when needed.
- add lazy template
- add additional options to "component" command (withTest, withStory, withLazy)

### Chores

- update readme

## 1.4.1 (2019-08-07)

### Bug Fixes

- use correct preprocessor extension in component

## 1.4.0 (2019-08-07)

### Features

- add question inquirer to create generate-react-cli config file

### Chores

- create License

## 1.3.3 (2019-08-04)

### Chores

- update readme

## 1.3.2 (2019-08-04)

### Chores

- update package description

## 1.3.1 (2019-08-04)

### Chores

- update readme

## 1.3.0 (2019-08-04)

### Chores

- add templates to files in package.json

## 1.2.0 (2019-08-04)

### Chores

- add repository to package.json

## 1.1.0 (2019-08-04)

### Features

- initial base features of generate react cli

### Chores

- add readme
