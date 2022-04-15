export class AuthorizationCodeGrantDto {
  code!: string;

  grant_type!: 'authorization_code';
}

export class RefreshTokenGrantDto {
  refresh_token!: string;

  grant_type!: 'refresh_token';
}
