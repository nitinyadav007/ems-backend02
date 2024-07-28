import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import { loadSchema } from '@graphql-tools/load';
import { UrlLoader } from '@graphql-tools/url-loader';
import 'dotenv/config';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { parse, printSchema } from 'graphql';

const pollingInterval = 1000;
let output: string;
let studentOutput: string;
if (!existsSync('build')) mkdirSync('build');

async function generateGraphQLTypes(
  schemaUrl: string,
  outputFile: string,
  output?: string,
) {
  // await new Promise((resolve) => setTimeout(resolve, 999999))
  try {
    const schema = await loadSchema(schemaUrl, {
      loaders: [new UrlLoader()],
    });
    const config = {
      documents: [],
      config: {
        namingConvention: 'keep',
      },
      filename: outputFile,
      schema: parse(printSchema(schema)),
      plugins: [
        {
          typescript: {},
        },
      ],
      pluginMap: {
        typescript: typescriptPlugin,
      },
    };
    let newOutput = await codegen(config);
    const constantsString = generateConstantsFromSubscriptions(newOutput);
    if (constantsString) {
      newOutput += '\n' + constantsString;
    }

    if (output !== newOutput) {
      output = newOutput;
      writeFileSync(outputFile, output);
    }
  } catch (e: any) {
    console.error(e.message);
  }

  setTimeout(
    () => generateGraphQLTypes(schemaUrl, outputFile, output),
    pollingInterval,
  );
  return schemaUrl;
}

generateGraphQLTypes(process.env.SCHEMA_URL, 'build/graphql.ts', output).then(
  (schemaUrl) => console.log(`Watching schema  at ${schemaUrl}`),
);
console.log(process.env.SCHEMA_URL);

// ).then((schemaUrl) => console.log(`Watching schema  at ${schemaUrl}`))
function generateConstantsFromSubscriptions(typeDefinitions: string): string {
  const match = typeDefinitions.match(/export type Subscription = {[^}]*}/);
  if (!match) return '';

  const subscriptionType = match[0];
  const lines = subscriptionType.split('\n');
  const constantDeclarations: string[] = [];

  lines.forEach((line) => {
    const match = line.trim().match(/(\w+):/);
    if (match) {
      const keyName = toSnakeCase(match[1]);
      constantDeclarations.push(
        `export const ${keyName.toUpperCase()} = '${match[1]}';`,
      );
    }
  });

  if (constantDeclarations.length === 0) return '';
  return constantDeclarations.join('\n');
}

function toSnakeCase(str: string) {
  return str
    .replace(/\.?([A-Z]+)/g, (x, y) => '_' + y.toLowerCase())
    .replace(/^_/, '');
}

export default generateGraphQLTypes;
