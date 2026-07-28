# Contributing

Thanks for your interest in contributing to AI Web Builder.

## How to Contribute

1. **Fork** the repository.
2. **Create a branch** for your change (`git checkout -b feature/your-feature`).
3. **Make your changes** following existing code style.
4. **Test** your changes (`pnpm lint && pnpm typecheck`).
5. **Commit** with a clear message.
6. **Push** and open a **Pull Request**.

## Development Setup

```bash
git clone https://github.com/wildfirebill-gen-ai-web/ai-web-builder.git
cd ai-web-builder
pnpm install
pnpm web
```

## Code Style

- TypeScript strict mode throughout
- ESLint + Prettier formatting
- Turborepo conventions for monorepo structure
- No `any` types unless absolutely necessary

## Pull Request Guidelines

- Keep PRs focused on a single concern
- Include a summary of what and why
- Reference any related issues
