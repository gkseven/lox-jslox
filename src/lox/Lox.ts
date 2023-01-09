import * as readline from 'node:readline';
import { readFileSync } from 'node:fs';
import Scanner from '../scanner/Scanner';

/**
 * The Lox class is the entry point for the Lox interpreter.
 * It is responsible for reading the source code and passing it to the Scanner.
 * It also handles the command line arguments and decides whether to run the REPL or a file.
 */
class Lox {
  private static hadError: boolean = false; // Flag to track if an error has occurred.

  /**
   * Executes the program with the given file path.
   * @param filepath The path to the file to be executed.
   * @returns void
   */
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

  /**
   * Runs the REPL.
   * @returns void
   */
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

  /**
   * Runs the scanner on the given source code.
   * @param source The source code to be scanned.
   * @returns void
   */
  private static run(source: string): void {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    tokens.forEach((token) => {
      console.log(token.toString());
    });
  }

  /**
   * Reports an error to the console.
   * @param line The line number where the error occurred.
   * @param where The location where the error occurred.
   * @param message The error message.
   * @returns void
   */
  static reportError(line: number, where?: string, message?: string) {
    console.error(`[line: ${line} Error ${where} : ${message}`);
    this.hadError = true;
  }
}

export default Lox;
