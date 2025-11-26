'use client';
import type { useMeQuery } from '@/__generated__/useMeQuery.graphql';
import { useRelayQuery } from '@/relay/useRelayQuery';
import { graphql } from 'react-relay';
const ME_QUERY = graphql`
  query useMeQuery {
    me {
      id
      fullName
      email
      cpf
    }
  }
`;
export function useMe() {
  const data = useRelayQuery<useMeQuery>(ME_QUERY, {});
  return {
    me: data?.me,
    isLoading: !data,
  };
}
