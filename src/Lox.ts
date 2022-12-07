import * as readline from 'node:readline';
import { readFileSync } from 'node:fs';
import Scanner  from './Scanner';

class Lox {
  hadError:boolean = false;

  runFile(filepath: string): void {
    try {
      const fileContents = readFileSync(filepath);
      this.run(fileContents.toString());
      if (this.hadError) process.exit(65);
    } catch (error) {
      const errMsg = (error as Error).message;
      console.error(errMsg);
    }
  }

  runPrompt(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.setPrompt('>> ');

    rl.prompt();
    rl.on('line', (line) => {
      this.run(line);
      this.hadError = false;
      rl.prompt();
    });
  }

  run(source: string): void {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    for (const token in tokens) {
      console.log(token);
    }
  }

  reportError(line:number, where:string, message:string){
    console.error(`[line: ${line} Error ${where} : ${message}`);
    this.hadError = true;
  }

}

export default Lox;
