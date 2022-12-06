/*READ EVAL PRINT LOOP*/

import * as readline from 'node:readline';
import { readFileSync } from 'node:fs';

function run(source: string): void {
  console.log(source);
}

export function runFile(filepath: string): void {
  try {
    const fileContents = readFileSync(filepath);
    run(fileContents.toString());
  }
  catch (error) {
    const errMsg = (error as Error).message;
    console.error(errMsg);
  }
}

export function runPrompt(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.setPrompt('>> ');

  rl.prompt();
  rl.on('line', (line) => {
    run(line);
    rl.prompt();
  });
}

