'use client';

import { useRelayQuery } from '@/relay/useRelayQuery';
import { graphql } from 'react-relay';
import type { transactionsQuery } from '../../__generated__/transactionsQuery.graphql';

const TRANSACTIONS_QUERY = graphql`
  query transactionsQuery {
    transactions {
      id
      amount
      description
      date
      accountId
      targetAccountId
    }
  }
`;

export function useTransactions() {
  const data = useRelayQuery<transactionsQuery>(TRANSACTIONS_QUERY, {});

  const transactions = (data?.transactions || [])
    .filter((t): t is NonNullable<typeof t> => t != null)
    .map((t) => ({
      id: t.id,
      amount: t.amount,
      description: t.description ?? null,
      date: t.date,
      accountId: t.accountId ?? '',
      targetAccountId: t.targetAccountId ?? '',
    }));

  return {
    transactions,
    isLoading: !data,
  };
}

