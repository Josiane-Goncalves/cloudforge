# CloudForge — Agent Rules

## Project objective
Build a small-to-medium educational frontend application to help study AWS services, architecture combinations, and AWS Solutions Architect Associate concepts.

## Product scope
The application should:
- teach AWS services by category
- show how services combine
- provide architecture missions
- evaluate mission solutions through deterministic rules
- track simple progress locally

## Technology constraints
- React
- TypeScript
- Vite
- CSS
- Vitest
- localStorage only when needed

## Visual direction
Follow the CloudForge identity:
- epic and mature atmosphere
- inspired by fantasy/strategy game interfaces
- refined pixel-art language
- visually strong but professional
- accessible and responsive
- no copying of existing game or franchise IPs

## Implementation rules
- Inspect the current codebase before changing files.
- Work incrementally.
- Only implement the approved scope.
- Do not introduce backend, auth, database, AWS account integration, or unnecessary infrastructure.
- Do not install dependencies without justification and approval.
- Do not create unnecessary abstractions.
- Prefer explicit, readable and low-coupling solutions.
- Keep components small and purposeful.
- Avoid duplication.
- Avoid `any` unless strictly justified.
- Do not create extra files unless they improve clarity.

## AWS content rules
- Do not invent AWS behavior, features, limits or recommendations.
- Keep AWS-related content structured and ready to be backed by official references.
- For the MVP, use deterministic evaluation logic rather than generative AI judgment.

## Quality rules
- Maintain a clear folder structure.
- Use meaningful names.
- Ensure accessibility basics.
- Ensure responsive behavior.
- Run available checks when possible.
- Report failures honestly.
- Remove dead code and unused imports.

## Communication rules
Before implementation:
- explain what you plan to change

After implementation:
- list changed files
- explain what was completed
- explain what remains out of scope
- report what was verified and what was not verified
