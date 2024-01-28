import Lox from "../lox/Lox";
import TokenType from "../token/TokenType";
import Token from "../token/Token";

/**
 * The Scanner breaks the source code into a series of characters and groups
 * them into meaningful chunks (i.e tokens) that make up the language's grammar.
 * @constructor
 * @param {string} source - The source code to be scanned.
 */
class Scanner {
  private readonly source: string; // The source code to be scanned.
  private readonly tokens: Token[] = new Array(); // The list of tokens encountered.
  private static readonly keywords: Map<string, TokenType> = new Map([]); // A map of keywords to their respective TokenType.
  private start: number = 0; // The index of the first character of the lexeme.
  private current: number = 0; // The index of the current character being scanned.
  private line: number = 1; // The current line number.

  constructor(source: string) {
    this.source = source;
  }

  static {
    this.keywords.set("and", TokenType.AND);
    this.keywords.set("class", TokenType.CLASS);
    this.keywords.set("else", TokenType.ELSE);
    this.keywords.set("false", TokenType.FALSE);
    this.keywords.set("for", TokenType.FOR);
    this.keywords.set("fun", TokenType.FUN);
    this.keywords.set("if", TokenType.IF);
    this.keywords.set("nil", TokenType.NIL);
    this.keywords.set("or", TokenType.OR);
    this.keywords.set("print", TokenType.PRINT);
    this.keywords.set("return", TokenType.RETURN);
    this.keywords.set("super", TokenType.SUPER);
    this.keywords.set("this", TokenType.THIS);
    this.keywords.set("true", TokenType.TRUE);
    this.keywords.set("var", TokenType.VAR);
    this.keywords.set("while", TokenType.WHILE);
  }

  /**
   * scanTokens() is the main method of the Scanner class.
   * It builds a list of tokens by calling scanToken() until the end of the source code is reached.
   * @returns {Token[]} A list of tokens.
   */
  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    const eof = new Token(TokenType.EOF, "", null, this.line);
    this.tokens.push(eof);

    return this.tokens;
  }

  /**
   * scanToken reads a character, classifies it and proceeds to read an entire lexeme.
   * The lexeme is then used to determine the TokenType and create a Token
   * which is then added to the list of tokens @this.tokens encountered so far.
   */
  private scanToken(): void {
    const c = this.advance();
    switch (c) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ",":
        this.addToken(TokenType.COMMA);
        break;
      case ".":
        this.addToken(TokenType.DOT);
        break;
      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON);
        break;
      case "*":
        this.addToken(TokenType.STAR);
        break;
      case "!":
        this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case "=":
        this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
        );
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );
        break;
      case "/":
        if (this.match("/")) {
          // Jump comments.
          while (this.peek() != "\n" && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      case " ":
      case "\r":
      case "\t":
        // Ignore whitespace.
        break;
      case "\n":
        this.line++;
        break;
      case '"':
        this.string();
        break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          Lox.reportError(this.line, "Unexpected character.");
        }
        break;
    }
  }

  /**
   * Consumes the next character in the source code if it matches the expected character.
   * This is uselful for matching two-character tokens like '==' or '!='.
   * @param {string} expected The character to match.
   * @returns {boolean} True if the next character matches the expected character, false otherwise.
   * @private
   */
  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;

    this.current++;
    return true;
  }

  /**
   * Consumes the next character in the source code and also advances the current index.
   * @returns {string} The character that was just scanned.
   * @private
   */
  private advance(): string {
    return this.source.charAt(this.current++);
  }

  /**
   * Looks at the next character in the source code without consuming it.
   * @returns {string} The next character in the source code.
   * @private
   */
  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source.charAt(this.current);
  }

  /**
   * Looks at the character after the next character in the source code without consuming it.
   * @returns {string} The character after the next character in the source code.
   * @private
   */
  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source.charAt(this.current + 1);
  }

  /**
   * Creates a token with the given type and adds it to the list of tokens.
   * @param {TokenType} type The type of the token to be created.
   * @param {string | number | null | undefined} literal The literal value of the token to be created.
   * @private
   */
  private addToken(
    type: TokenType,
    literal?: string | number | null | undefined
  ): void {
    const text = this.source.substring(this.start, this.current);
    const token = new Token(type, text, literal, this.line);
    this.tokens.push(token);
  }

  /**
   * Scans a string literal from the source code.
   * @returns The string literal scanned from the source code.
   * @private
   */
  private string(): void {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == "\n") this.line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      Lox.reportError(this.line, "Unterminated string.");
      return;
    }

    // Advance beyond the closing quote
    this.advance();

    // Strip off the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  /**
   * Consumes a number literal from the source code.
   * @private
   */
  private number(): void {
    while (this.isDigit(this.peek())) this.advance();

    // Handle fractional part if encountered.
    if (this.peek() == "." && this.isDigit(this.peekNext())) {
      this.advance();
      while (this.isDigit(this.peek())) this.advance();
    }

    this.addToken(
      TokenType.NUMBER,
      parseFloat(this.source.substring(this.start, this.current))
    );
  }

  /**
   * Consumes an identifier from the source code.
   * Any lexeme that starts with a letter or an underscore is considered an identifier.
   * @private
   */
  private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    const text = this.source.substring(this.start, this.current);
    const type = Scanner.keywords.get(text) || TokenType.IDENTIFIER;
    this.addToken(type);
  }

  /**
   * Checks if the given character is a decimal digit.
   * @param c The character to check.
   * @returns {boolean} True if the character is a decimal digit, false otherwise.
   * @private
   */
  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  /**
   * Checks if the given character is a letter.
   * @param c The character to check.
   * @returns {boolean} True if the character is a letter, false otherwise.
   * @private
   */
  private isAlpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
  }

  /**
   * Checks if the given character is a letter or a decimal digit.
   * @param c The character to check.
   * @returns {boolean} True if the character is a letter or a decimal digit, false otherwise.
   * @private
   */
  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  /**
   * Checks if we've reached the end of the source code.
   * @returns {boolean} True if we've reached the end of the source code.
   * @private
   */
  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }
}

export default Scanner;
