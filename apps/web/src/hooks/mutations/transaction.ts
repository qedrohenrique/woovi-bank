'use client';
import { graphql, useMutation, useRelayEnvironment } from 'react-relay';
import { toast } from 'sonner';
import type { transactionCreateIdempotencyKeyMutation } from '../../__generated__/transactionCreateIdempotencyKeyMutation.graphql';
import type { transactionCreateTransactionMutation } from '../../__generated__/transactionCreateTransactionMutation.graphql';

const CREATE_IDEMPOTENCY_KEY_MUTATION = graphql`
  mutation transactionCreateIdempotencyKeyMutation($input: CreateIdempotencyKeyMutationInput!) {
    CreateIdempotencyKeyMutation(input: $input) {
      key
    }
  }
`;

const CREATE_TRANSACTION_MUTATION = graphql`
  mutation transactionCreateTransactionMutation($input: CreateTransactionMutationInput!) {
    CreateTransactionMutation(input: $input) {
      transactionId
    }
  }
`;

export function useCreateIdempotencyKey() {
  const [commitMutation, isPending] = useMutation<transactionCreateIdempotencyKeyMutation>(CREATE_IDEMPOTENCY_KEY_MUTATION);
  const createIdempotencyKey = () => {
    return new Promise<string>((resolve, reject) => {
      commitMutation({
        variables: {
          input: {},
        },
        onCompleted: (data) => {
          if (data.CreateIdempotencyKeyMutation?.key) {
            resolve(data.CreateIdempotencyKeyMutation.key);
          } else {
            reject(new Error('Falha ao criar chave de idempotência'));
          }
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };
  return { createIdempotencyKey, isPending };
}

export function useCreateTransaction() {
  const [commitMutation, isPending] = useMutation<transactionCreateTransactionMutation>(CREATE_TRANSACTION_MUTATION);
  const [commitIdempotencyMutation, isIdempotencyPending] = useMutation<transactionCreateIdempotencyKeyMutation>(CREATE_IDEMPOTENCY_KEY_MUTATION);
  const environment = useRelayEnvironment();
  const createTransaction = async (
    amount: number,
    cpf: string,
    description?: string
  ) => {
    return new Promise<void>((resolve, reject) => {
      commitIdempotencyMutation({
        variables: {
          input: {},
        },
        onCompleted: (idempotencyData) => {
          if (idempotencyData.CreateIdempotencyKeyMutation?.key) {
            commitMutation({
              variables: {
                input: {
                  amount,
                  cpf,
                  description: description || undefined,
                },
              },
              onCompleted: (data) => {
                if (data.CreateTransactionMutation?.transactionId) {
                  toast.success('Transação criada com sucesso!');
                  resolve();
                } else {
                  reject(new Error('Falha ao criar transação'));
                }
              },
              onError: (error) => {
                const errorMessage = error.message || 'Erro desconhecido';
                if (errorMessage.toLowerCase().includes('insufficient balance') ||
                  errorMessage.toLowerCase().includes('saldo insuficiente')) {
                  toast.error('Saldo insuficiente para realizar esta transação');
                } else {
                  toast.error('Erro ao criar transação: ' + errorMessage);
                }
                reject(error);
              },
            });
          } else {
            reject(new Error('Falha ao criar chave de idempotência'));
          }
        },
        onError: (error) => {
          toast.error('Erro ao criar chave de idempotência');
          reject(error);
        },
      });
    });
  };

  const isTransactionPending = isPending;
  const isAnyPending = isTransactionPending || isIdempotencyPending;

  return { createTransaction, isPending: isAnyPending };
}
