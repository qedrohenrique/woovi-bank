// apps/web/src/hooks/useLogin.ts
'use client';

import { graphql, useMutation } from 'react-relay';

const LOGIN_MUTATION = graphql`
  mutation authLoginMutation($input: LoginMutationInput!) {
    LoginMutation(input: $input) {
      token
    }
  }
`;

export function useLogin() {
  const [commitMutation, isPending] = useMutation(LOGIN_MUTATION);

  const login = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      commitMutation({
        variables: {
          input: { email, password },
        },
        onCompleted: resolve,
        onError: reject,
      });
    });
  };

  return { login, isPending };
}