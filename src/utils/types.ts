export type ServerActionResult<T> =
  | {
      isOk: false;
      errorMessage: string;
      errorCode: number;
    }
  | {
      isOk: true;
      payload: T;
    };

export enum ChangeDisplayNameServerActionErrorCode {
  NotAuthenticated,
  NameExisted,
}

export type MatchStatus = "QuestionOngoing" | "QuestionFinished" | "MatchFinished";

/**
 * RichChar is just a wrapper around primitive char type that adds extra metadata
 * fields. This metadata field will be used to manipulate question in <Game />
 * component.
 *
 * (I know that JS doesn't have the char type, but let's assume that char
 * type is just type string with length = 1, and a string is an array of char)
 */
export type RichChar = {
  isHidden: boolean;
  originalIndex: number;
  char: string;
};

/**
 * Word is a list of RichChar that will be displayed in the same line
 *
 * For example: "ferrari" but not "fer
 * rari"
 *
 * Words are separated by whitespaces.
 *
 * Let's say we have this RichChar[]:
 * "a brown fox jumps over a lazy dog"
 *
 * then words will be:
 * "a"
 * "brown"
 * "fox"
 * and so on
 */
export type Word = RichChar[];
