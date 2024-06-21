import { pathToFileURL } from 'node:url';
import path from 'node:path';
import sass from 'sass';
import { transform } from 'lightningcss';
import type { Transformer } from '@jest/transform';

export interface JestCssModulesTransformOptions {
  type?: 'commonjs' | 'module';
}

const transformer: Transformer<JestCssModulesTransformOptions> = {
  process(sourceText, sourcePath, options) {
    const extname = path.extname(sourcePath);

    let cssCode;

    switch (extname) {
      case '.css': {
        cssCode = sourcePath;
        break;
      }

      case '.sass':
      case '.scss': {
        cssCode = sass.compileString(sourceText, {
          url: pathToFileURL(sourcePath) as URL,
          importers: [new sass.NodePackageImporter()],
        }).css;
        break;
      }

      default: {
        throw new Error(`[@krutoo/jest-css-modules-transform] Unsupported extension "${extname}"`);
      }
    }

    const cssModulesCompilation = transform({
      filename: sourcePath,
      code: Buffer.from(cssCode),
      cssModules: {
        pattern: '[local]',
      },
    });

    const exports = Object.fromEntries(
      Object.entries(cssModulesCompilation.exports ?? {}).map(([key, data]) => [key, data.name]),
    );

    if (options.transformerConfig.type === 'module') {
      return {
        code: `export default ${JSON.stringify(exports)};`,
      };
    }

    return {
      code: `module.exports = ${JSON.stringify(exports)};`,
    };
  },
};

export default transformer;
