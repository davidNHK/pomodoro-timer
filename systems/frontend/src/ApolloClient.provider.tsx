import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import type { PropsWithChildren } from 'react';

const cache = new InMemoryCache();

export default function ApolloClientProvider({
  children,
}: PropsWithChildren<unknown>) {
  const uri = `${import.meta.env.VITE_BACKEND_HOST}/graphql`;
  const client = new ApolloClient({
    cache,
    link: createUploadLink({
      uri: uri,
    }),
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
