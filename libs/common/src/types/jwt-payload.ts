export type JwtPayload = {
  id: string;
  roleId: string;
  jti: string;
  iat: number;
  exp: number;
};
