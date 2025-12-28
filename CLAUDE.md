### Comments policy:

- Comments are allowed only when they add real value.
- Do NOT comment obvious code.
- Do NOT describe WHAT the code does.
- Comment only WHY a decision was made, or WHAT is non-obvious.

Language:
- English only.
- Short, precise sentences.
- No emotional or conversational tone.

---
### Variable naming:
- DO NOT use single-letter variable names.
- Use descriptive names even in short callbacks.
- Examples:
  - ❌ `items.filter((t) => t.id !== id)`
  - ✅ `items.filter((item) => item.id !== id)`

Imports:
- Import only specific items from packages.
- DO NOT use namespace imports unless necessary.
- Examples:
  - ❌ `onClick?: (e: React.MouseEvent) => void` (React not imported)
  - ✅ `import { type MouseEvent } from 'react'` then `onClick?: (e: MouseEvent) => void`

---
### Execution plan rules:

- After creating or updating a plan, ALWAYS ask user for explicit approval before starting implementation.
- NEVER start executing a plan automatically, even if the plan is complete and approved in structure.
- Wait for explicit confirmation: "yes", "start", "begin", "proceed", "давай", "начинай", etc.
- Only exception: if user explicitly says "create plan and implement it" in the same request.
- When resuming from context/summary, do NOT automatically continue implementation.

- Execute one step at a time
- After each step:
    - explain what was done
    - say what the next step will be
- Assume prettier is run after each step
- Check for TypeScript errors conceptually
- Do NOT proceed to the next step without my confirmation
