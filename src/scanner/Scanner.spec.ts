import { describe, expect, test } from "@jest/globals";
import Scanner from "./Scanner";
import TokenType from "../token/TokenType";

describe("Scanner module", () => {
  test("Identifies the tokens when given a line of source code", () => {
    const source = `var lang = "JSLox";`;
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    expect(tokens).toEqual([
      { type: TokenType.VAR, lexeme: "var", literal: undefined, line: 1 },
      {
        type: TokenType.IDENTIFIER,
        lexeme: "lang",
        literal: undefined,
        line: 1,
      },
      { type: TokenType.EQUAL, lexeme: "=", literal: undefined, line: 1 },
      { type: TokenType.STRING, lexeme: '"JSLox"', literal: "JSLox", line: 1 },
      { type: TokenType.SEMICOLON, lexeme: ";", literal: undefined, line: 1 },
      { type: TokenType.EOF, lexeme: "", literal: null, line: 1 },
    ]);
  });

  test("Identifies strings", () => {
    const source = `"JSLox is the best programming language."`;
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    expect(tokens).toEqual([
      {
        type: TokenType.STRING,
        lexeme: '"JSLox is the best programming language."',
        literal: "JSLox is the best programming language.",
        line: 1,
      },
      { type: TokenType.EOF, lexeme: "", literal: null, line: 1 },
    ]);
  });

  test("Identifies numbers", () => {
    const source = `5 9.999 100.0`;
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    expect(tokens).toEqual([
      { type: TokenType.NUMBER, lexeme: "5", literal: 5, line: 1 },
      { type: TokenType.NUMBER, lexeme: "9.999", literal: 9.999, line: 1 },
      { type: TokenType.NUMBER, lexeme: "100.0", literal: 100, line: 1 },
      { type: TokenType.EOF, lexeme: "", literal: null, line: 1 },
    ]);
  });

  test("Identifies expressions", () => {
    const source = `= == < > <= >= ! != * /`;
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    expect(tokens).toEqual([
      { type: TokenType.EQUAL, lexeme: "=", literal: undefined, line: 1 },
      { type: TokenType.EQUAL_EQUAL, lexeme: "==", literal: undefined, line: 1 },
      { type: TokenType.LESS, lexeme: "<", literal: undefined, line: 1 },
      { type: TokenType.GREATER, lexeme: ">", literal: undefined, line: 1 },
      { type: TokenType.LESS_EQUAL, lexeme: "<=", literal: undefined, line: 1 },
      { type: TokenType.GREATER_EQUAL, lexeme: ">=", literal: undefined, line: 1 },
      { type: TokenType.BANG, lexeme: "!", literal: undefined, line: 1 },
      { type: TokenType.BANG_EQUAL, lexeme: "!=", literal: undefined, line: 1 },
      { type: TokenType.STAR, lexeme: "*", literal: undefined, line: 1 },
      { type: TokenType.SLASH, lexeme: "/", literal: undefined, line: 1 },
      { type: TokenType.EOF, lexeme: "", literal: null, line: 1 },
    ]);
  });

  test("Identifies comments", () => {
    const source = `// JSLox rocks!!!`;
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    expect(tokens).toEqual([
      { type: TokenType.EOF, lexeme: "", literal: null, line: 1 },
    ]);
  });
});
