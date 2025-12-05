# AGENTS instructions

## Project Knowledge

### Development Environment
- Use `pnpm` as the package manager.
  - dev server: `pnpm dev`
- Use `biome` as the linter and formatter.
  - Use check command to lint and format code: `pnpm check` or `biome check --write`

### Core Stack
- Tanstack Start: Full-stack framework for React
- CossUI: A alternative to shadcn/ui with building on top of Base UI
  - Use shadcn mcp to find and integrate useful components of `@coss` into the project.

### Project Architecture
Refer to the FSD(Feature-Sliced Design) architecture, organize code around features, domains, and layered boundaries, rather than file type.

**Core Concepts**
- Layers: The Backbone of Dependency Direction, from lowest to highest: shared, entities, features, widgets, routes, app.
- Slices: Grouping by Business Meaning, e.g. user, product, order, etc.
- Segments: Grouping by Technical Purpose, e.g. ui, api, model, lib, config, etc.

### Code Style
- Functional Programming First
- Focus on cohesion, prioritize composition, avoid prop drilling
- Split large component, function, and file into smaller, focused ones

## Tips

- Always use context7 when I need code generation, setup or configuration steps, or library/API documentation. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.