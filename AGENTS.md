<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# AGENTS instructions

## Project Knowledge

### Development Environment
- Use `pnpm` as the package manager.
  - dev server: `pnpm dev`
- Use `biome` as the linter and formatter.
  - Use check command to lint and format code: `pnpm check` or `biome check --write`

### Core Stack
- Tanstack Start: Full-stack framework for React
- Shadcn UI: A set of beautifully designed components. In this project, it is built on top of **Base UI**.
  - Use shadcn mcp to find and integrate useful components into the project.

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