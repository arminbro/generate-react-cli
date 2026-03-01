# Generate React CLI

[![License](https://img.shields.io/npm/l/express.svg)](https://github.com/arminbro/generate-react-cli/blob/master/LICENSE)

<p align="center">
  <img src="https://raw.githubusercontent.com/arminbro/generate-react-cli/master/docs/assets/generate-react-cli.svg?raw=true"/>
</p>

A CLI tool to speed up productivity in React projects by generating components instantly with configurable templates.

## Table of Contents

- [Quick Start](#quick-start)
- [Requirements](#requirements)
- [Config File](#config-file)
- [Generate Components](#generate-components)
- [Options](#options)
- [Custom Component Types](#custom-component-types)
- [Custom Component Templates](#custom-component-templates)
- [Template Keywords](#template-keywords)
- [Custom Component Files](#custom-component-files)
- [Advanced: Custom Directory](#advanced-custom-directory)
- [License](#license)

## Quick Start

```bash
# Generate your first component (creates config on first run)
npx generate-react-cli component Box

# Or install globally
npm i -g generate-react-cli
generate-react component Button
```

## Requirements

- Node.js 22 or higher
- npm 10 or higher

## Config File

When you run GRC within your project the first time, it will ask you a series of questions to customize the CLI for your project needs (this will create a `generate-react-cli.json` config file).

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

**Test library options:**

| Option | Description |
|--------|-------------|
| `Testing Library` | Uses [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) |
| `Vitest` | Uses [Vitest](https://vitest.dev/) with React Testing Library |
| `None` | Basic tests using React's createRoot API |

## Generate Components

```sh
npx generate-react-cli component Box
```

This command will create a folder with your component name within your default (e.g., `src/components`) directory, and its corresponding files.

```
|-- /src
    |-- /components
        |-- /Box
            |-- Box.js
            |-- Box.css
            |-- Box.test.js
```

## Options

You can override config rules using command-line options:

```sh
npx generate-react-cli component Box --withTest=false
```

| Option | Description | Default |
|--------|-------------|---------|
| `--path` | Output directory for the component | Config value |
| `--type` | [Custom component type](#custom-component-types) to use | `default` |
| `--withLazy` | Generate a [lazy-loading](https://react.dev/reference/react/lazy) wrapper file | Config value |
| `--withStory` | Generate a [Storybook](https://storybook.js.org) story file | Config value |
| `--withStyle` | Generate a stylesheet file | Config value |
| `--withTest` | Generate a test file | Config value |
| `--dry-run` | Preview what will be generated without writing files | `false` |
| `--flat` | Generate files directly in path without creating a folder | `false` |
| `--customDirectory` | Override the component's folder name ([see below](#advanced-custom-directory)) | Component name |

## Custom Component Types

By default, GRC uses the `component.default` configuration. You can define additional component types with their own rules:

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

Generate components with custom types:

```sh
npx generate-react-cli component HomePage --type=page
npx generate-react-cli component Sidebar --type=layout
```

## Custom Component Templates

Create your own templates that GRC uses instead of the built-in ones. Add a `customTemplates` object to any component type:

```json
{
  "component": {
    "default": {
      "path": "src/components",
      "withStyle": true,
      "withTest": true,
      "customTemplates": {
        "component": "templates/TemplateName.js",
        "style": "templates/TemplateName.module.css",
        "test": "templates/TemplateName.test.js"
      }
    }
  }
}
```

Example custom component template:

```jsx
// templates/TemplateName.js

import styles from './TemplateName.module.css';

const TemplateName = () => (
  <div className={styles.TemplateName} data-testid="TemplateName">
    <h1>TemplateName component</h1>
  </div>
);

export default TemplateName;
```

Example custom test template:

```jsx
// templates/TemplateName.test.js

import { createRoot } from 'react-dom/client';
import TemplateName from './TemplateName';

it('should mount', () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<TemplateName />);
  root.unmount();
});
```

All template types are optional. If you don't specify a custom template for a file type, GRC uses its built-in template.

## Template Keywords

Use these keywords in your custom templates and filenames. GRC replaces them with the component name in various formats:

| Keyword | Output Format | Example (`Box`) |
|---------|--------------|-----------------|
| `templatename` | raw (as typed) | `Box` |
| `TemplateName` | PascalCase | `Box` |
| `templateName` | camelCase | `box` |
| `template-name` | kebab-case | `box` |
| `template_name` | snake_case | `box` |
| `TEMPLATE_NAME` | UPPER_SNAKE | `BOX` |
| `TEMPLATENAME` | UPPERCASE | `BOX` |

## Custom Component Files

Add custom files beyond the built-in options (`withStyle`, `withTest`, `withStory`, `withLazy`).

Example: Adding an `index.js` barrel file for cleaner imports:

```json
{
  "component": {
    "default": {
      "path": "src/components",
      "withStyle": true,
      "withTest": true,
      "withIndex": true,
      "customTemplates": {
        "index": "templates/index.js"
      }
    }
  }
}
```

```jsx
// templates/index.js
export { default } from './TemplateName';
```

Custom files require corresponding custom templates in `customTemplates`.

## Advanced: Custom Directory

Override the generated component's folder name using `customDirectory`. This is useful when you need naming conventions that differ from the component name.

Example: Generate a `Theme` provider where files live in a `ThemeProvider` folder:

```json
{
  "component": {
    "provider": {
      "path": "src/providers",
      "withTest": true,
      "customDirectory": "TemplateNameProvider",
      "customTemplates": {
        "component": "templates/TemplateNameProvider.tsx"
      }
    }
  }
}
```

```sh
npx generate-react-cli component Theme --type=provider
# Creates: src/providers/ThemeProvider/ThemeProvider.tsx
```

You can also pass it as a CLI option:

```sh
npx generate-react-cli component Box --customDirectory=TemplateNameLayout
```

## License

Generate React CLI is open source software [licensed as MIT](https://github.com/arminbro/generate-react-cli/blob/master/LICENSE).
