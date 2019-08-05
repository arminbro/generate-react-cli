# generate-react-cli

## Why?

To help speed up productivity in react projects. For example you can run one command `generate-react component <ComponentName>` to instantly generate a component with its corresponding files (stylesheet, test).

We are starting off with the bare minimum of just generating a component. We plan to add additional commands, options, and configurations in the future.

_Few notes:_
- The CLI assumes that your project uses [jest](https://github.com/facebook/jest) & [enzyme](https://github.com/airbnb/enzyme) for testing. This will be customizable in the future.
- The CLI also has an opinion on how files are structured within the project. [We follow Grouping by features or routes](https://reactjs.org/docs/faq-structure.html#grouping-by-features-or-routes)
- The CLI uses CSS Modules by default. This will be customizable in the future.

## Install

>`npm i -g generate-react-cli`

## Commands

### Generate Component

>`generate-react component <ComponentName>`

This will create a folder with your component name within the **src/components** directory, and it will generate 3 corresponding files (.js, .module.css, .test.js) within it.

#### Options
|Parameter|Description|Default Value|
|---------|-----------|-------|
| **`-p`** OR<br>**`--path`** | Path value to where you want the component to be generated in (e.g **`src/pages`**). | **`src/components`**

## Coming Soon
- CLI custom configuration: e.g. preprocessor stylesheet type, choose different test framework, choose different file structure type, etc..

<br>
Have fun!
