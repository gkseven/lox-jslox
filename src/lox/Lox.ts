import * as readline from 'node:readline';
import { readFileSync } from 'node:fs';
import Scanner from '../scanner/Scanner';

class Lox {
  private static hadError: boolean = false;

  static runFile(filepath: string): void {
    try {
      const fileContents = readFileSync(filepath);
      Lox.run(fileContents.toString());
      if (Lox.hadError) process.exit(65);
    } catch (error) {
      const errMsg = (error as Error).message;
      console.error(errMsg);
    }
  }

  static runPrompt(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.setPrompt('>> ');

    rl.prompt();
    rl.on('line', (line) => {
      Lox.run(line);
      Lox.hadError = false;
      rl.prompt();
    });
  }

  private static run(source: string): void {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

<<<<<<< HEAD
    tokens.forEach((token) => {
      console.log(token.toString());
    });
=======
    for (const token in tokens) {
      console.log(token);
    }
>>>>>>> 84be6071ef09b6cda4b6910338a4cf9d4383b4f4
  }

  static reportError(line: number, where?: string, message?: string) {
    console.error(`[line: ${line} Error ${where} : ${message}`);
    this.hadError = true;
  }
}

export default Lox;
