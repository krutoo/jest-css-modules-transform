import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { compileString, NodePackageImporter } from 'sass';
import { transform } from 'lightningcss';
import type { Transformer } from '@jest/transform';

export interface JestCssModulesTransformOptions {
  type?: 'commonjs' | 'module';
}

const transformer: Transformer<JestCssModulesTransformOptions> = {
  process(sourceText, sourcePath, options) {
    const extname = path.extname(sourcePath);

    let cssCode: string;

    switch (extname) {
      case '.css': {
        cssCode = sourceText;
        break;
      }

      case '.sass':
      case '.scss': {
        cssCode = compileString(sourceText, {
          url: pathToFileURL(sourcePath) as URL,
          importers: [new NodePackageImporter()],
        }).css;
        break;
      }

      default: {
        cssCode = sourceText;

        console.warn(
          `[@krutoo/jest-css-modules-transform] Unknown extension "${extname}", code of "${sourcePath}" will be interpreted as regular CSS`,
        );
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
