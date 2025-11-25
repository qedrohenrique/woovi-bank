'use client';

import { redirect } from 'next/navigation';
import { graphql, useMutation } from 'react-relay';
import type { authLoginMutation } from '../../__generated__/authLoginMutation.graphql';
import type { authRegisterMutation } from '../../__generated__/authRegisterMutation.graphql';
import { toast } from 'sonner';

const LOGIN_MUTATION = graphql`
  mutation authLoginMutation($input: LoginMutationInput!) {
    LoginMutation(input: $input) {
      token
    }
  }
`;

const SIGNUP_MUTATION = graphql`
  mutation authRegisterMutation($input: RegisterMutationInput!) {
    RegisterMutation(input: $input) {
      success
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
          toast.success('Login realizado com sucesso');
            fetch(`/api/set-cookie?name=bankinho.auth.token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: data.LoginMutation.token }),
          });
        }

        redirect('/dashboard');
      },
      onError: (error) => {
        toast.error('Erro ao fazer login');
      },
    });
  };

  return { login, isPending };
}

export function useSignup() {
  const [commitMutation, isPending] = useMutation<authRegisterMutation>(SIGNUP_MUTATION);

  const signup = (fullName: string, email: string, cpf: string, password: string) => {
    commitMutation({
      variables: { input: { fullName, email, cpf, password } },
      onCompleted: (data) => {
        if (data.RegisterMutation?.success) {
          toast.success('Usuário criado com sucesso');
          redirect('/login');
        } else {
          toast.error('Erro ao criar usuário');
        }
      },
      onError: (error) => {
        toast.error('Erro ao criar usuário');
      },
    });
  };

  return { signup, isPending };
}