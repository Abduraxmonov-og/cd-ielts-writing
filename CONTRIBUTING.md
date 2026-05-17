# Contributing to CD IELTS Writing

Thank you for your interest in contributing! 🎉 This project welcomes contributions from IELTS learners, teachers, and developers.

## How to Contribute

### 1. **Add New Tasks** (Easiest!)

This is the best way to start contributing. No coding required!

#### Add a Task 1 (with image)
1. Create or find a Task 1 image (chart, graph, map, diagram)
2. Save it as `images/task1/t1_XXX.png` (replace XXX with next number)
3. Edit `tasks.json` and add this entry under `"task1"`:

```json
{
  "id": "t1_XXX",
  "type": "line_graph",
  "title": "Your descriptive title",
  "image": "images/task1/t1_XXX.png",
  "question": "The graph below shows...\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.",
  "tags": ["real_exam"]
}
```

**Task 1 types:** `line_graph`, `bar_chart`, `pie_chart`, `table`, `map`, `process_diagram`, `mixed`

#### Add a Task 2 (no image needed)
Edit `tasks.json` and add under `"task2"`:

```json
{
  "id": "t2_XXX",
  "type": "opinion",
  "title": "Your topic title",
  "question": "Some people believe...\n\nDiscuss both views and give your opinion.\n\nWrite at least 250 words.",
  "tags": ["hot_topic"]
}
```

**Task 2 types:** `opinion`, `discussion`, `problem_solution`, `direct_question`, `advantages_disadvantages`

#### Tags
- `"real_exam"` → 🔴 Real Exam badge
- `"hot_topic"` → 🔥 Hot Topic badge
- Mix & match or leave empty: `"tags": []`

### 2. **Improve the Code**

- **Bug reports:** Found a timer issue? Let us know via Issues
- **Feature requests:** Want a word limit checker? Suggest it!
- **Code improvements:** Better keyboard shortcuts? Submit a PR

### 3. **Enhance Documentation**

- Fix typos in README
- Improve task descriptions
- Add screenshots or guides

---

## Workflow

### For Task Additions (No Git Knowledge Needed)
1. Click "Add file" → "Create new file" on GitHub
2. Name it `tasks.json` 
3. Copy the entire current content
4. Add your new task entry
5. Click "Commit changes"
6. GitHub will automatically create a Pull Request

### For Code Changes
1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes and test in your browser
4. Commit: `git commit -m "Add: description of change"`
5. Push: `git push origin feature/your-feature`
6. Create a Pull Request with clear description

---

## Code Standards

- Keep files clean and well-organized
- Add comments for complex logic
- Test changes in multiple browsers (Chrome, Firefox, Safari)
- Test on mobile devices if possible

---

## Questions?

- Open an **Issue** to discuss ideas
- Check existing issues before posting (avoid duplicates)
- Be respectful and constructive

---

**Let's build the best IELTS prep tool together!** 🚀
