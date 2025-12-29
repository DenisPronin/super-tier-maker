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
- DO NOT use React.* notation (React.ReactNode, React.MouseEvent, etc.)
- ALWAYS import specific types from 'react' directly.
- Examples:
  - ❌ `onClick?: (e: React.MouseEvent) => void` (React not imported)
  - ❌ `children?: React.ReactNode` (namespace import)
  - ✅ `import { type MouseEvent } from 'react'` then `onClick?: (e: MouseEvent) => void`
  - ✅ `import { type ReactNode } from 'react'` then `children?: ReactNode`

---
### Execution plan rules:

- After creating or updating a plan, ALWAYS ask user for explicit approval before starting implementation.
- NEVER start executing a plan automatically, even if the plan is complete and approved in structure.
- Wait for explicit confirmation: "yes", "start", "begin", "proceed", "давай", "начинай", etc.
- Only exception: if user explicitly says "create plan and implement it" in the same request.
- When resuming from context/summary, do NOT automatically continue implementation.

**CRITICAL: Step-by-step execution with mandatory confirmation**

- Execute ONLY ONE step at a time
- NEVER execute multiple steps in sequence without explicit confirmation for each step
- This applies to:
  - Plan steps
  - Todo list items
  - Any multi-step task
- NO EXCEPTIONS for "agreed plans" or "confirmed todo lists"

After EACH step completion:
1. Explain what was done
2. Ask: "Продолжить со следующим шагом?" or similar
3. WAIT for explicit user confirmation
4. Only then proceed to the next step

Why this is critical:
- Better user experience and control
- Easier code review
- Prevents missing important details
- Allows course correction at any point

Violating this rule degrades user experience and code quality.

---
### Testing and validation:

- All testing is done by the developer
- DO NOT run `npm run build` or similar build commands
- DO NOT run the application to verify functionality
- You may run `npx tsc --noEmit` for type checking only
- Assume developer will test and report issues

---
### User notifications and confirmations:

- NEVER use native `alert()` - replace with toast notifications
- NEVER use native `confirm()` - use `modals.openConfirmModal()` from @mantine/modals
- Examples:
  - ❌ `alert('Error happened')`
  - ✅ `notifications.show({ title: 'Error', message: 'Error happened', color: 'red' })`
  - ❌ `if (confirm('Delete?')) { ... }`
  - ✅ `modals.openConfirmModal({ title: 'Delete?', onConfirm: () => { ... } })`
