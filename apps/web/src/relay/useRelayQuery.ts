'use client';

import { useLazyLoadQuery, useRelayEnvironment } from 'react-relay';
import { GraphQLTaggedNode, OperationType } from 'relay-runtime';

export function useRelayQuery<T extends OperationType>(
  query: GraphQLTaggedNode,
  variables: T['variables'],
  options?: {
    fetchPolicy?: 'store-or-network' | 'store-and-network' | 'network-only' | 'store-only';
  }
) {
  return useLazyLoadQuery<T>(query, variables, options);
}

export { useRelayEnvironment };
