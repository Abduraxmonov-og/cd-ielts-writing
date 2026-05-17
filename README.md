# IELTS Writing Practice App

## File structure

```
ielts-app/
├── index.html       ← Selection page (open this to start)
├── exam.html        ← Exam interface (opened automatically in new tab)
├── style.css        ← Shared design system
├── selection.js     ← Selection page logic
├── exam.js          ← Exam timer / writing logic
├── tasks.json       ← Task bank (edit this to add new questions)
└── images/
    └── task1/       ← Drop Task 1 chart images here
        ├── t1_001.png
        ├── t1_002.png
        └── ...
```

## How to run

Open `index.html` in a browser. You can use VS Code Live Server or any local server.
**Do not open as a `file://` URL** — the `tasks.json` fetch will be blocked by CORS in most browsers.

## Adding new tasks

### Task 1
1. Drop the image in `images/task1/` (e.g. `t1_006.png`)
2. Add an entry to `tasks.json` under `"task1"`:

```json
{
  "id": "t1_006",
  "type": "bar_chart",
  "title": "Your descriptive title",
  "image": "images/task1/t1_006.png",
  "question": "The chart below shows...\n\nSummarise the information...\n\nWrite at least 150 words.",
  "tags": ["real_exam"]
}
```

### Task 2
Add an entry under `"task2"` — no image needed:

```json
{
  "id": "t2_006",
  "type": "opinion",
  "title": "Your topic title",
  "question": "Some people believe...\n\nWrite at least 250 words.",
  "tags": ["hot_topic"]
}
```

## Task types

| Task 1             | Task 2                      |
|--------------------|-----------------------------|
| `line_graph`       | `opinion`                   |
| `bar_chart`        | `discussion`                |
| `pie_chart`        | `problem_solution`          |
| `table`            | `direct_question`           |
| `map`              | `advantages_disadvantages`  |
| `process_diagram`  |                             |
| `mixed`            |                             |

## Tags
- `"real_exam"` → shows ⬤ Real Exam badge
- `"hot_topic"` → shows 🔥 Hot Topic badge

## Keyboard shortcuts (Exam page)
- `Ctrl + 1` → Switch to Task 1
- `Ctrl + 2` → Switch to Task 2
