export interface TokenPayload {
    userId: number;
    role: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}