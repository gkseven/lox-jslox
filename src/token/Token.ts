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
<<<<<<< HEAD
    return `${TokenType[this.type]} ${this.lexeme} ${this.literal || ""}`;
=======
    return `${this.type} ${this.lexeme} ${this.literal}`;
>>>>>>> 84be6071ef09b6cda4b6910338a4cf9d4383b4f4
  }
}

export default Token;