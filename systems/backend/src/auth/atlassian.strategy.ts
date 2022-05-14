import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import OAuth2Strategy from 'passport-oauth2';
import { from, map, mergeMap } from 'rxjs';

import type { ConnectedProviderInput } from '../user/connected-provider/connected-provider.model';
import { UserProvider } from '../user/connected-provider/connected-provider.model';
import { ConnectedProviderService } from '../user/connected-provider/connected-provider.service';
import { SessionStore } from './session.store';

@Injectable()
export class AtlassianTokenService {
  private logger = new Logger(AtlassianTokenService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly connectedProviderService: ConnectedProviderService,
    private readonly configService: ConfigService,
  ) {}

  me(accessToken: string) {
    return this.httpService
      .request({
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
        url: 'https://api.atlassian.com/me',
      })
      .pipe(
        map(({ data }) => {
          return {
            provider: UserProvider.ATLASSIAN,
            userAvatar: data.picture,
            userEmail: data.email,
            userId: data.account_id,
            userName: data.name,
          };
        }),
      );
  }

  refreshAccessTokenForUser(userId: string) {
    const [clientId, clientSecret] = [
      this.configService.get('connector.atlassian.clientId'),
      this.configService.get('connector.atlassian.clientSecret'),
    ];

    return this.connectedProviderService
      .getUserConnectedCredential$(userId, UserProvider.ATLASSIAN)
      .pipe(
        mergeMap(credential => {
          return this.httpService
            .post<{
              access_token: string;
              refresh_token: string;
            }>('https://auth.atlassian.com/oauth/token', {
              client_id: clientId,
              client_secret: clientSecret,
              grant_type: 'refresh_token',
              refresh_token: credential.refreshToken,
            })
            .pipe(
              mergeMap(resp =>
                from(
                  this.connectedProviderService.updateUserConnectedCredential(
                    credential.id,
                    {
                      accessToken: resp.data.access_token,
                      refreshToken: resp.data.refresh_token,
                    },
                  ),
                ).pipe(map(() => resp.data)),
              ),
            );
        }),
      );
  }
}

@Injectable()
export class AtlassianStrategy extends PassportStrategy(
  OAuth2Strategy,
  'atlassian',
) {
  constructor(
    private store: SessionStore,
    private readonly atlassianTokenService: AtlassianTokenService,
    private readonly configService: ConfigService,
  ) {
    const [clientId, clientSecret] = [
      configService.get('connector.atlassian.clientId'),
      configService.get('connector.atlassian.clientSecret'),
    ];
    const backendOrigin = configService.get('backend.origin');
    super({
      authorizationURL: 'https://auth.atlassian.com/authorize',
      callbackURL: `${backendOrigin}/auth/atlassian/callback`,
      clientID: clientId,
      clientSecret: clientSecret,
      scope: ['read:me', 'read:jira-work', 'read:jira-user', 'offline_access'],
      store: store,
      tokenURL: 'https://auth.atlassian.com/oauth/token',
    });
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  override authorizationParams() {
    return {
      audience: 'api.atlassian.com',
      prompt: 'consent',
    };
  }

  override userProfile(
    accessToken: string,
    done: (err: any, profile?: ConnectedProviderInput) => void,
  ) {
    this.atlassianTokenService.me(accessToken).subscribe({
      error(err) {
        done(err);
      },
      next(user) {
        done(null, user);
      },
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    cb: (err: any, user?: any, info?: any) => void,
  ): Promise<void> {
    return cb(null, profile, { accessToken, refreshToken });
  }
}
