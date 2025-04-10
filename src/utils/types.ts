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
