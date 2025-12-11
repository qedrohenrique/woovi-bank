# Woovi Bank

## 📋 Sobre o Projeto

O Woovi Playground é uma plataforma bancária que permite aos usuários gerenciar suas contas, realizar transações e acompanhar seu histórico financeiro através de uma interface intuitiva e moderna. A aplicação foi construída seguindo as melhores práticas de desenvolvimento, utilizando uma arquitetura de monorepo para facilitar a manutenção e escalabilidade.

TLDR: desafio técnico da woovi 🤣

## ✨ Funcionalidades

### Autenticação e Conta
- **Registro de usuário** com validação de email
- **Login** por CPF ou email
- **Confirmação de conta** via email
- **Gerenciamento de sessão** com tokens JWT

### Transações
- **Criação de transações** entre contas
- **Chave de idempotência** para garantir transações únicas
- **Histórico completo** de transações
- **Visualização de saldo** em tempo real

### Dashboard
- **Gráficos interativos** de transações
- **Tabela de transações** com filtros e ordenação
- **Card de saldo total** na sidebar
- **Interface responsiva** e moderna

## 🛠️ Tecnologias

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca UI
- **React Relay** - Gerenciamento de estado GraphQL
- **Tailwind CSS 4** - Estilização
- **Radix UI** - Componentes acessíveis
- **Recharts** - Gráficos e visualizações
- **TypeScript** - Tipagem estática

### Backend
- **Koa.js** - Framework web Node.js
- **GraphQL** - API query language
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **GraphQL Subscriptions** - Real-time updates
- **JWT** - Autenticação

### Infraestrutura
- **Turbo** - Build system para monorepo
- **Docker** - Containerização
- **pnpm** - Gerenciador de pacotes

## 🚀 Como Executar

### Pré-requisitos

- Node.js 20+
- pnpm 10.0.0
- Docker e Docker Compose (opcional)

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd woovi-playground
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cd apps/server
pnpm config:local
# Edite o arquivo .env com suas configurações
```

4. Inicie o banco de dados (Docker):
```bash
pnpm compose:up
```

5. Execute o servidor de desenvolvimento:
```bash
pnpm dev
```

A aplicação estará disponível em:
- Frontend: http://localhost:3000
- Backend GraphQL: http://localhost:4000/graphql

## 📸 Screenshots

<img width="1300" height="736" alt="Screenshot from 2025-12-11 04-40-13" src="https://github.com/user-attachments/assets/71a4f20f-9300-41d6-a8ca-254e3d81bf16" />
<img width="1300" height="736" alt="Screenshot from 2025-12-11 04-38-42" src="https://github.com/user-attachments/assets/a60bf3c7-b0dd-49b4-8e4f-55a01e71e629" />

## 🧪 Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Build de produção
- `pnpm lint` - Executa o linter
- `pnpm format` - Formata o código com Prettier
- `pnpm relay` - Compila os arquivos Relay
- `pnpm schema` - Atualiza o schema GraphQL
- `pnpm compose:up` - Inicia os containers Docker
- `pnpm compose:down` - Para os containers Docker

## 🔐 Autenticação

A aplicação utiliza JWT para autenticação. Após o login, o token é armazenado em cookies HTTP-only para segurança.

## 📊 GraphQL API

A API GraphQL oferece as seguintes operações:

### Queries
- `me` - Retorna informações do usuário autenticado
- `transactions` - Lista todas as transações do usuário

### Mutations
- `LoginMutation` - Autenticação do usuário
- `RegisterMutation` - Registro de novo usuário
- `CreateTransactionMutation` - Criação de transação
- `CreateIdempotencyKeyMutation` - Geração de chave de idempotência
