# Jest transformer for css-modules

This package is needed for transform css-modules in Jest.

It supports CSS, Sass and SCSS.

## Installation

```bash
npm i -D @krutoo/jest-css-modules-transform
```

## Usage

Add transform rule to your Jest configuration:

```js
// jest.config.js
export default {
  transform: {
    // will transform files like "foo.module.css", "foo.m.css", "foo.module.sass"...
    '\\.(module|m)\\.(css|sass|scss)$': '@krutoo/jest-css-modules-transform',
  },
};
```

## Options

You can set options for this transformer:

```js
// jest.config.js
export default {
  transform: {
    '\\.module\\.css$': [
      '@krutoo/jest-css-modules-transform',
      {
        // by default this transformer will emit CJS, but you can force it to emit MJS syntax
        type: 'module',
      },
    ],
  },
};
```

## To Do

- explore and implement Jest caching of transform results
- implement ability of selecting sass package (`sass` or `sass-embedded`)
