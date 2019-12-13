# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
