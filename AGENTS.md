# Agent Guidelines for Creator Agent

## Commands
- **Build**: `pnpm run build` (TypeScript compilation)
- **Start**: `pnpm start` (runs built code from dist/)
- **Test**: No tests configured yet
- **Single test**: N/A

## Code Style
- **Language**: TypeScript with strict mode
- **Imports**: ES6 imports with `.js` extensions for TypeScript project references
- **Types**: Use interfaces for complex objects, union types for variants
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces
- **Error handling**: try/catch with instanceof Error checks
- **Async**: Use async/await, avoid Promises directly
- **Formatting**: 2-space indentation, single quotes, no semicolons
- **Classes**: Private methods with `#` prefix, public methods without
- **Strings**: Template literals for interpolation, single quotes otherwise
- **Destructuring**: Use for object/array unpacking
- **Arrow functions**: Preferred for callbacks and short functions