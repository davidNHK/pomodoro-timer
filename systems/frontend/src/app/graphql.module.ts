import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { environment } from '../environments/environment';

const uri = `${environment.apiUrl}/graphql`;
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    cache: new InMemoryCache(),
    link: httpLink.create({ uri }),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      deps: [HttpLink],
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
    },
  ],
})
export class GraphQLModule {}
