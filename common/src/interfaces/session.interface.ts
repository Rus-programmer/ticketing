export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface ISessionData {
  tokens: ITokens;
  userAgent: string;
}

export interface IPayload {
  id: number;
}
