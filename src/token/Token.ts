import TokenType from "./TokenType";

class Token {
  private readonly type: TokenType;
  private readonly lexeme: string;
  private readonly literal: any;
  private readonly line: number;

  constructor(
    type: TokenType,
    lexeme: string,
    literal: string | number | null | undefined,
    line: number
  ) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString(): string {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}

export default Token;