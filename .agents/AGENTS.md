# Agent Rules for shop-ai-manager

## Critical Execution Directive
- **Zero Console/Build Errors Requirement**: Before declaring any task finished or delivering results to the user, you MUST verify that:
  1. All console, build, runtime, and TypeScript errors (`npx pnpm check-types`) are 100% resolved.
  2. The application features and pages render without errors or blank screens.
  3. Everything is verified to be fully working end-to-end.
