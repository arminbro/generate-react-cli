# Generate React CLI

[![License](https://img.shields.io/npm/l/express.svg)](https://github.com/arminbro/generate-react-cli/blob/master/LICENSE)

<p align="center"> 
  <img src="https://raw.githubusercontent.com/arminbro/generate-react-cli/master/docs/assets/generate-react-cli.svg?raw=true"/>
</p>

## Why?

To help speed up productivity in React projects and stop copying, pasting, and renaming files each time you want to create a new component.

A short [article](https://dev.to/arminbro/generate-react-cli-1ooh) goes deeper into why we created GRC if you have the time.

You can also watch an excellent [video](https://www.youtube.com/watch?v=NEvnt3MWttY) tutorial on how to use GRC by [Eric Murphy](https://www.youtube.com/channel/UC5KDiSAFxrDWhmysBcNqtMA).

## Table of Contents:

- [Config file](#config-file)
- [Generate components](#generate-components)
- [Custom component types](#custom-component-types)
- [Custom component templates](#custom-component-templates)
- [Custom component files](#custom-component-files)
- [OpenAi integration (Alpha release)](#openai-integration-alpha-release)

## You can run it using npx like this:

```
  npx generate-react-cli component Box
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) is a package runner tool that comes with npm 5.2+)_

## Config File

When you run GRC within your project the first time, it will ask you a series of questions to customize the cli for your project needs (this will create a "generate-react-cli.json" config file).

#### Example of the **generate-react-cli.json** config file:

```json
{
  "usesTypeScript": true,
  "usesCssModule": true,
  "cssPreprocessor": "scss",
  "testLibrary": "Testing Library",
  "component": {
    "default": {
      "path": "src/components",
      "withLazy": false,
      "withStory": false,
      "withStyle": true,
      "withTest": true
    }
  }
}
```

## Generate Components

```sh
  npx generate-react-cli component Box
```

This command will create a folder with your component name within your default (e.g. **src/components**) directory, and its corresponding files.

#### Example of the component files structure:

```
|-- /src
    |-- /components
        |-- /Box
            |-- Box.js
            |-- Box.css
            |-- Box.test.js
```

### Options

You can also override some of the GRC component config rules using one-off commands. So for example, let's say you have set **withTest** to be `true` in the `component.default` property. You can override it like this:

```sh
  npx generate-react-cli component Box --withTest=false
```

Or vice versa, if you have set **withTest** to be `false` you can do this:

```sh
  npx generate-react-cli component Box --withTest=true
```

Otherwise, if you don't pass any options, it will just use the default values that you have set in the GRC config file under `component.default`.

<table>
  <tr align="left">
    <th>Options</th>
    <th>Description</th>
    <th>Value Type</th>
    <th>Default Value</th>
  </tr>
  <tr>
    <td width="20%"><b>--path</b></td>
    <td width="60%">
      Value of the path where you want the component to be generated in (e.g. <b>src/components</b>).  
    </td>
    <td width="20%">String</td>
    <td width="20%"><code>component.default.path<code></td>
  </tr>

  <tr>
    <td width="20%"><b>--type</b></td>
    <td width="60%">
      You can pass a custom component type that you have configured in the GRC config file that has its own set of component config rules. Read more about <a href="#custom-component-types">custom component types</a>.
    </td>
    <td width="20%">String</td>
    <td width="20%"><code>component.default<code></td>
  </tr>

  <tr>
    <td width="20%"><b>--withLazy</b></td>
    <td width="60%">
      Creates a corresponding lazy file (a file that lazy-loads your component out of the box and enables <a href="https://reactjs.org/docs/code-splitting.html#code-splitting">code splitting</a>) with this component.      
    </td>
    <td width="20%">Boolean</td>
    <td width="20%"><code>component.default.withLazy<code></td>
  </tr>

  <tr>
    <td width="20%"><b>--withStory</b></td>
    <td width="60%">
      Creates a corresponding (<a href="https://storybook.js.org">storybook</a>) story file with this component.      
    </td>
    <td width="20%">Boolean</td>
    <td width="20%"><code>component.default.withStory<code></td>
  </tr>

  <tr>
    <td width="20%"><b>--withStyle</b></td>
    <td width="60%">
      Creates a corresponding stylesheet file with this component.    
    </td>
    <td width="20%">Boolean</td>
    <td width="20%"><code>component.default.withStyle<code></td>
  </tr>

  <tr>
    <td width="20%"><b>--withTest</b></td>
    <td width="60%">
      Creates a corresponding test file with this component.      
    </td>
    <td width="20%">Boolean</td>
    <td width="20%"><code>component.default.withTest<code></td>
  </tr>
  <tr>
    <td width="20%"><b>--dry-run</b></td>
    <td width="60%">
      Show what will be generated without writing to disk
    </td>
    <td width="20%">Boolean</td>
    <td width="20%"><code>false<code></td>
  </tr>
  <tr>
    <td width="20%"><b>--flat</b></td>
    <td width="60%">
      Generate the files in the mentioned path insted of creating new folder for it
    </td>
    <td width="20%">Boolean</td>
    <td width="20%"><code>false<code></td>
  </tr>
    <tr>
    <td width="20%"><b>--describe</b></td>
    <td width="60%">
      Describe the component you're trying to generate, and OpenAI will do its best to render it following your instructions.
    </td>
    <td width="20%">String</td>
    <td width="20%"><code>null<code></td>
  </tr>
</table>

### Custom component types:

By default, GRC will use the `component.default` configuration rules when running the component command out of the box.

What if you wanted to generate other types of components that have their own set of config rules (e.g., **page** or **layout**)?

You can do so by extending the **generate-react-cli.json** config file like this.

```json
{
  "usesTypeScript": false,
  "usesCssModule": true,
  "cssPreprocessor": "scss",
  "testLibrary": "Testing Library",
  "component": {
    "default": {
      "path": "src/components",
      "withLazy": false,
      "withStory": false,
      "withStyle": true,
      "withTest": true
    },
    "page": {
      "path": "src/pages",
      "withLazy": true,
      "withStory": false,
      "withStyle": true,
      "withTest": true
    },
    "layout": {
      "path": "src/layout",
      "withLazy": false,
      "withStory": false,
      "withStyle": false,
      "withTest": true
    }
  }
}
```

Now you can generate a component with your custom component types like this:

```sh
  npx generate-react-cli component HomePage --type=page
```

```sh
  npx generate-react-cli component BoxLayout --type=layout
```

You can also pass the same [options](#options) to your custom component types as you would for the default component type.

### Custom component templates

You can also create your own custom templates that GRC can use instead of the built-in templates that come with it. We hope this will provide more flexibility for your components that you want to generate.

There is an optional `customTemplates` object that you can pass to the `component.default` or any of your custom component types within your **generate-react-cli.json** config file.

#### Example of the `customTemplates` object:

```json
"customTemplates": {
  "component": "templates/TemplateName.js",
  "lazy":  "templates/TemplateName.lazy.js",
  "story":  "templates/TemplateName.story.js",
  "style": "templates/TemplateName.style.scss",
  "test":  "templates/TemplateName.test.js"
},
```

The keys represent the type of file, and the values are the paths that point to where your custom template lives in your project/system. Please note the `TemplateName` keyword in the template filename. GRC will use this keyword and replace it with your component name (in whichever format you typed the component name in the command) as the filename.

#### Example of using the `customTemplates` object within your generate-react-cli.json config file:

```json
{
  "usesTypeScript": false,
  "usesCssModule": true,
  "cssPreprocessor": "scss",
  "testLibrary": "Testing Library",
  "component": {
    "default": {
      "customTemplates": {
        "component": "templates/component/TemplateName.js",
        "style": "templates/component/TemplateName.style.scss",
        "test": "templates/component/TemplateName.test.js"
      },
      "path": "src/components",
      "withStyle": true,
      "withTest": true,
      "withStory": true,
      "withLazy": false
    },
    "page": {
      "customTemplates": {
        "test": "templates/page/TemplateName.test.js"
      },
      "path": "src/pages",
      "withLazy": true,
      "withStory": false,
      "withStyle": true,
      "withTest": true
    }
  }
}
```

Notice in the `page.customTemplates` that we only specified the `test` custom template type. That's because all the custom template types are optional. If you don't set the other types, GRC will default to using the built-in templates it comes with.

#### Example of a custom component template file:

```jsx
// templates/component/TemplateName.js

import React from 'react';
import styles from './TemplateName.module.css';

const TemplateName = () => (
  <div className={styles.TemplateName} data-testid="TemplateName">
    <h1>TemplateName component</h1>
  </div>
);

export default TemplateName;
```

**Important** - You can also use the following keywords within your custom templates to format the component name in your templates accordingly:

| Keyword         | Replacement                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `templatename`  | component name in raw case (whichever format the user typed the component name in the command) |
| `TemplateName`  | component name in PascalCase                                                                   |
| `templateName`  | component name in camelCase                                                                    |
| `template-name` | component name in kebab-case                                                                   |
| `template_name` | component name in snake_case                                                                   |
| `TEMPLATE_NAME` | component name in uppercase SNAKE_CASE                                                         |

#### Example of a custom test template file:

```jsx
// templates/component/TemplateName.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import TemplateName from './TemplateName';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TemplateName />, div);
  ReactDOM.unmountComponentAtNode(div);
});
```

### Custom component files

GRC comes with corresponding built-in files for a given component if you need them (i.e., `withStyle`, `withTest`, `withStory`, and `withLazy`).

What if you wanted to add custom files of your own?

For example, let's say you wanted to add an `index.js` file for each component, so you don't have to add the additional component name with each import (i.e., `import Box from './components/Box'` instead of `import Box from './components/Box/Box'`).

Or maybe you need an additional style file for your component stories.

You can do so by editing your **generate-react-cli.json** config file like so.

```json
{
  "usesTypeScript": false,
  "usesCssModule": false,
  "cssPreprocessor": "css",
  "testLibrary": "Testing Library",
  "component": {
    "default": {
      "path": "src/components",
      "withStyle": true,
      "withTest": true,
      "withStory": true,
      "withLazy": false,
      "withIndex": true,
      "withStoryStyle": true,
      "customTemplates": {
        "index": "templates/default/index.js",
        "storyStyle": "templates/default/TemplateName.stories.css"
      }
    }
  }
}
```

```jsx
// templates/default/index.js

export { default } from './TemplateName';
```

```css
/* templates/default/TemplateName.stories.css */

.TemplateName {
}
```

In this case, we added a `withIndex` & `withStoryStyle` to the `component.default`. Note: You can add custom files to any of your custom component types.

You should also see that we added `index` and `storyStyle` to our `customTemplates` object. That's because custom files require custom templates. Otherwise, you will get an error when you generate a component.

Also, we used the `TemplateName` keyword for the `storyStyle` custom file. GRC will generate this corresponding file and replace `TemplateName` with the component name.

## OpenAI integration (Alpha release)

Well, the time has come to incorporate OpenAI with GRC.

I had a chance to experiment with OpenAI's latest GPT-3 natural language model, and I was super impressed by its capabilities. You can read more about OpenAI by visiting their site: https://openai.com/.

If you've been using GRC, you already know about its component generation capabilities using its internal templates or the custom ones you provide.

With the help of OpenAI, we can now generate our components intelligently by describing them using the new `--describe` flag, or `-d` for short.

The plan for this alpha integration will start simple, but I have a few good ideas coming in the near future (and I'm hoping to hear some of yours) on how we can use OpenAI with GRC to improve the developer experience.

Please remember that this release is still early, and you will run into bugs. So, please report any bugs or issues [here](https://github.com/arminbro/generate-react-cli/issues).

### Okay, let's get started.

1. If you don't have one, you must create an OpenAI account: https://openai.com/api/.
2. You'll need to obtain a secret API key from OpenAI. You can do so by visiting https://beta.openai.com/account/api-keys.
3. Once you have your API key, you'll need to create a `.env.local` file in your react project and store it as a variable as `OPENAI_API_KEY`. Please be sure not to share the key or push it to version control, as it is private.

GRC will pass the key to OpenAI to communicate with the API on your behalf. You will see the usage reflected on your OpenAI account here: https://beta.openai.com/account/usage.

GRC uses the DaVinci language model, so you can check out their pricing here: https://openai.com/api/pricing/.

Let's generate our first component using OpenAI:

```sh
npx generate-react-cli@alpha c Counter -d "Create a counter component that increments by one when I click on the increment button"
```

GRC should have created a Counter component that looks something like this 🤯:

```jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Counter.css';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="Counter" data-testid="Counter">
      <h2> The count is: {count} </h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

Counter.propTypes = {};

Counter.defaultProps = {};

export default Counter;
```

OpenAI will do its best to generate the component following the instructions provided in the `--describe` flag while using the patterns supplied from the internal or custom component templates.

Okay, let's try another one.

```sh
npx generate-react-cli@alpha c GlobalNav -d "Create a navbar component with 1 logo named 'GRC' and 3 links: 'Home', 'About', 'Contact'"
```

and here's the output in src/components/GlobalNav/GlobalNav.js:

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import './GlobalNav.css';

const GlobalNav = () => (
  <div className="GlobalNav" data-testid="GlobalNav">
    <a href="#">GRC</a>
    <ul>
      <li>
        <a href="#">Home</a>
      </li>
      <li>
        <a href="#">About</a>
      </li>
      <li>
        <a href="#">Contact</a>
      </li>
    </ul>
  </div>
);

GlobalNav.propTypes = {};

GlobalNav.defaultProps = {};

export default GlobalNav;
```

That's a wrap. I hope this integration will allow us to generate React components more efficiently, and we can still go in and make the necessary adjustments.

Again, please provide any feedback if you have any, and I would love to see some of the components that you generate with GRC+OpenAI.

Please share them with me on Twitter [@arminbro](https://twitter.com/arminbro).

## License

Generate React CLI is an open source software [licensed as MIT](https://github.com/arminbro/generate-react-cli/blob/master/LICENSE).
