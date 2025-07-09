// apps/web/src/hooks/useLogin.ts
'use client';

import { graphql, useMutation } from 'react-relay';
import type { authLoginMutation } from '../../__generated__/authLoginMutation.graphql';

const LOGIN_MUTATION = graphql`
  mutation authLoginMutation($input: LoginMutationInput!) {
    LoginMutation(input: $input) {
      token
    }
  }
`;

export function useLogin() {
  const [commitMutation, isPending] = useMutation<authLoginMutation>(LOGIN_MUTATION);

  const login = (email: string, password: string) => {
    commitMutation({
      variables: {
        input: { email, password },
      },
      onCompleted: (data) => {
        if (data.LoginMutation?.token) {
          fetch(`/api/set-cookie?name=bankinho.auth.token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: data.LoginMutation.token }),
          });
        }
      },
      onError: (error) => {
        // TODO: handle error
        console.error(error);
      },
    });
  };

  return { login, isPending };
}