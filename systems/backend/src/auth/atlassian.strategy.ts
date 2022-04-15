import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import OAuth2Strategy from 'passport-oauth2';

import type { ConnectedProviderInput } from '../user/connected-provider.model';
import { SessionStore } from './session.store';

@Injectable()
export class AtlassianStrategy extends PassportStrategy(
  OAuth2Strategy,
  'atlassian',
) {
  constructor(private store: SessionStore) {
    super({
      authorizationURL: 'https://auth.atlassian.com/authorize',
      callbackURL: 'http://localhost:5333/auth/atlassian/callback',
      clientID: 'G4wDHozFAvuuDHf0Tt2RcL0J5gfTVRPp',
      clientSecret:
        'c1rELCilygo7GQvzOTMxeUi20Ud1a0v2l3-d3mJ73z8u83h6ga4AUxQAHFzaXKZ2',
      scope: ['read:me', 'read:jira-work', 'read:jira-user'],
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
    this._oauth2.get(
      'https://api.atlassian.com/me',
      accessToken,
      (err, body) => {
        if (err) return done(err);

        let profile: ConnectedProviderInput;

        try {
          const json = JSON.parse(String(body));
          profile = {
            provider: 'atlassian',
            userAvatar: json.picture,
            userEmail: json.email,
            userId: json.account_id,
            userName: json.name,
          };
        } catch (e) {
          return done(new Error('Failed to parse user profile'));
        }
        return done(null, profile);
      },
    );
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
