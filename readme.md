# Generate React CLI

[![dependencies](https://david-dm.org/arminbro/generate-react-cli.svg)](https://david-dm.org/arminbro/generate-react-cli)
[![License](https://img.shields.io/npm/l/express.svg)](https://github.com/arminbro/generate-react-cli/blob/master/LICENSE)

<p align="center"><img src="docs/assets/component-cmd.gif?raw=true"/></p>

## Why?

To help speed up productivity in React projects and stop copying, pasting, and renaming files each time you want to create a new component.

[Create React App](https://create-react-app.dev/) and [Gatsby](https://www.gatsbyjs.org/) do a great job of initializing new projects, setting up the development environment, and optimizing the app for production use. Still, they don't have a way to generate new components similar to what [Angular CLI](https://cli.angular.io/) offers, and that's because they both try to stay as non-opinionated as possible and allow the developer to make those decisions. One example would be grouping by features vs. grouping by file type when creating components.

Generate React CLI focuses on generating new components by running a simple command. It also doesn't care if you run it in an existing [CRA](https://create-react-app.dev/), [Gatsby](https://www.gatsbyjs.org/), or a custom React project you built on your own.

It does, however, have an opinion on how component files are structured. It follows [grouping by feature](https://reactjs.org/docs/faq-structure.html#grouping-by-file-type) because we believe when you look at a component, you should see all of its corresponding files (i.e., stylesheet, test, and component) under one folder with the component name. We feel this approach provides a better developer experience.

**_A few notes:_**

- Now supports React TypeScript projects.
- Supports two different component testing libraries - [Testing Library](https://testing-library.com) and [Enzyme](https://airbnb.io/enzyme) - that work with [Jest](https://jestjs.io/). We assume that you have these libraries already configured in your React project.

## You can install it globally and run it like this using npm:

```
 npm i -g generate-react-cli
 generate-react component Box
```

## Or you can just run it using npx like this:

```
 npx generate-react-cli component Box
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) is a package runner tool that comes with npm 5.2+ and higher)_

## Config File

When you run generate-react-cli within your project the first time, it will ask you a series of questions to customize the cli for your project needs (this will create a "generate-react-cli.json" config file).

### e.g. **generate-react-cli.json**

```json
{
  "component": {
    "path": "src/components",
    "css": {
      "preprocessor": "css",
      "module": false,
      "withStyle": true
    },
    "test": {
      "library": "Testing Library",
      "withTest": true
    },
    "withStory": false,
    "withLazy": false
  },
  "usesTypeScript": false
}
```

## Usage

### Generate Component

```
 npx generate-react-cli component Box
```

This command will create a folder with your component name within your default (e.g. **src/components**) directory, and its corresponding files.

#### **Example of the component files structure**

```
|-- /src
    |-- /components
        |-- /Box
            |-- Box.js
            |-- Box.css
            |-- Box.test.js
```

#### Options

You can also override the generate-react-cli default config options for one-off commands. So for example, let's say in one of your projects you have set **withTest** to be `true` in your generate-react-cli config file as your default. You can override it for that one-off command like this:

```
 npx generate-react-cli c Box --no-withTest
```

Or vice versa, if you have set **withTest** to be `false` you can do this:

```
 npx generate-react-cli c Box --withTest
```

Otherwise, if you don't pass any options, it will just use the default ones from the generate-react-cli config file you have set.

| Parameter          | Description                                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **--path**         | Value of the path where you want the component to be generated in (e.g. **src/pages**).                                                                                                                 |
| **--withStyle**    | Creates a corresponding stylesheet file with this component.                                                                                                                                            |
| **--no-withStyle** | Creates component without the stylesheet file.                                                                                                                                                          |
| **--withTest**     | Creates a corresponding test file with this component.                                                                                                                                                  |
| **--no-withTest**  | Creates a component without the test file.                                                                                                                                                              |
| **--withStory**    | Creates a corresponding story file with this component.                                                                                                                                                 |
| **--no-withStory** | Creates component without the story file.                                                                                                                                                               |
| **--withLazy**     | Creates a corresponding lazy file (a file that lazy-loads your component out of the box and enables [code splitting](https://reactjs.org/docs/code-splitting.html#code-splitting)) with this component. |
| **--no-withLazy**  | Creates a component without the lazy file.                                                                                                                                                              |

<br>
Have fun!
