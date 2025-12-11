# Woovi Playground

Uma aplicação moderna de gerenciamento financeiro desenvolvida com tecnologias de ponta, oferecendo funcionalidades completas de autenticação, transações e visualização de dados financeiros.

## 📋 Sobre o Projeto

O Woovi Playground é uma plataforma bancária que permite aos usuários gerenciar suas contas, realizar transações e acompanhar seu histórico financeiro através de uma interface intuitiva e moderna. A aplicação foi construída seguindo as melhores práticas de desenvolvimento, utilizando uma arquitetura de monorepo para facilitar a manutenção e escalabilidade.

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

## 📁 Estrutura do Projeto

```
woovi-playground/
├── apps/
│   ├── server/          # Backend GraphQL (Koa.js)
│   └── web/             # Frontend (Next.js)
├── packages/
│   ├── eslint-config-custom/  # Configuração ESLint compartilhada
│   ├── tsconfig/        # Configurações TypeScript
│   └── ui/              # Componentes UI compartilhados
├── docker-compose.yml   # Configuração Docker
└── turbo.json          # Configuração Turbo
```

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

<!-- Adicione suas screenshots aqui -->

### Dashboard
<!-- ![Dashboard](./screenshots/dashboard.png) -->

### Transações
<!-- ![Transações](./screenshots/transactions.png) -->

### Login
<!-- ![Login](./screenshots/login.png) -->

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

## 🗺️ Roadmap

- [x] Login por CPF ou email
- [x] Criação de conta com confirmação por email
- [x] Sistema de transações
- [x] Chave de idempotência para transações
- [ ] Template de email melhorado
- [ ] Recuperação de senha (Esqueci minha senha)
- [ ] Notificações em tempo real
- [ ] Exportação de extrato

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📝 Licença

Este projeto é privado e de uso interno.

---

Desenvolvido com ❤️ para Woovi
