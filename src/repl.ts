/*READ EVAL PRINT LOOP*/

import * as readline from 'node:readline';



export function runFile(file: string): void {
  console.log(`Running file: ${file}`);
}

export function runPrompt(): void {
  const rl = readline.createInterface({input: process.stdin, output: process.stdout});
  rl.setPrompt('>> ');

  rl.prompt();
  rl.on('line', (line) => {
    console.log(line);
    rl.prompt();
  });

}
