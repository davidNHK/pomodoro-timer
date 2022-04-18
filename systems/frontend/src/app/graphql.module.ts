import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { APOLLO_FLAGS, APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AuthService } from '../app/auth/auth.service';
import { environment } from '../environments/environment';

const refreshExpiredAccessToken = (authService: AuthService, router: Router) =>
  // @ts-expect-error no type for this function
  onError(({ forward, graphQLErrors, operation }) => {
    const hasAccessTokenExpired = graphQLErrors?.find(
      graphQLError => graphQLError.extensions?.['code'] === 'ERR_ACCESS_TOKEN',
    );
    if (!hasAccessTokenExpired || !authService.refreshToken) return undefined;
    return authService.refreshAccessToken(authService.refreshToken).pipe(
      mergeMap(({ error }) => {
        if (error) {
          authService.logout();
          router.navigate(['/auth/login']);
          return of(undefined);
        }
        operation.setContext({
          headers: {
            Authorization: `Bearer ${authService.accessToken}`,
          },
        });
        return forward(operation);
      }),
    );
  });

const setAccessToken = (authService: AuthService) =>
  setContext(() => {
    if (!authService.hasAccessToken()) {
      return {};
    }
    const token = authService.accessToken;

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  });

const uri = `${environment.apiUrl}/graphql`;
export function createApollo(
  httpLink: HttpLink,
  authService: AuthService,
  router: Router,
): ApolloClientOptions<any> {
  return {
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      setAccessToken(authService),
      refreshExpiredAccessToken(authService, router),
      httpLink.create({ uri }),
    ]),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_FLAGS,
      useValue: {
        useMutationLoading: true, // enable it here
      },
    },
    {
      deps: [HttpLink, AuthService, Router],
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
    },
  ],
})
export class GraphQLModule {}
