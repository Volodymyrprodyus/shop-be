import fs from 'fs';
import * as serverlessConfiguration from './serverless';
import YAML from 'yaml';

const yamlData = YAML.stringify(serverlessConfiguration);


fs.writeFileSync('./docs/serverless.yaml', yamlData, 'utf8');
