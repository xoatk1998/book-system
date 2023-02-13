export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  name: string;
  expireAt: number;
}

export interface FirebaseRefreshResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
