/* ── State ── */
let tasks = { task1: [], task2: [] };
let mode = 'practice'; // 'practice' | 'exam'
let selected = { task1: null, task2: null };
let previewTarget = { taskNum: null, task: null };
let filters = { task1: 'all', task2: 'all' };

/* ── Candidate ID ── */
function getCandidateId() {
  let id = sessionStorage.getItem('candidateId');
  if (!id) {
    id = Array.from({ length: 6 }, () => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('');
    sessionStorage.setItem('candidateId', id);
  }
  return id;
}

/* ── Type label map ── */
const typeLabels = {
  line_graph: 'Line Graph',
  bar_chart: 'Bar Chart',
  pie_chart: 'Pie Chart',
  table: 'Table',
  map: 'Map',
  process_diagram: 'Process Diagram',
  mixed: 'Mixed Chart',
  opinion: 'Opinion Essay',
  discussion: 'Discussion',
  problem_solution: 'Problem & Solution',
  direct_question: 'Direct Question',
  advantages_disadvantages: 'Advantages & Disadvantages'
};

/* ── Init ── */
async function init() {
  document.getElementById('candidate-id-display').textContent = 'ID: ' + getCandidateId();

  try {
    const res = await fetch('tasks.json');
    tasks = await res.json();
  } catch (e) {
    console.error('Could not load tasks.json', e);
  }

  renderCards(1);
  renderCards(2);
}

/* ── Render cards ── */
function renderCards(taskNum) {
  const key = `task${taskNum}`;
  const container = document.getElementById(`cards-${key}`);
  const currentFilter = filters[key];
  const taskList = tasks[key] || [];

  container.innerHTML = '';

  // Custom card always first
  const customCard = buildCustomCard(taskNum);
  container.appendChild(customCard);

  const filtered = currentFilter === 'all'
    ? taskList
    : taskList.filter(t => t.type === currentFilter);

  filtered.forEach(task => {
    const card = buildTaskCard(taskNum, task);
    container.appendChild(card);
  });

  // Refresh selection highlight
  refreshCardHighlights(taskNum);
}

/* ── Build task card ── */
function buildTaskCard(taskNum, task) {
  const div = document.createElement('div');
  div.className = 'task-card';
  div.dataset.id = task.id;
  div.dataset.tasknum = taskNum;

  const tags = (task.tags || []).map(t => {
    if (t === 'real_exam') return `<span class="tag tag-real">⬤ Real Exam</span>`;
    if (t === 'hot_topic') return `<span class="tag tag-hot">🔥 Hot Topic</span>`;
    return '';
  }).join('');

  div.innerHTML = `
    <div class="card-type">${typeLabels[task.type] || task.type}</div>
    <div class="card-title">${task.title}</div>
    ${tags ? `<div class="card-tags">${tags}</div>` : ''}
  `;

  div.addEventListener('click', () => openPreview(taskNum, task));
  return div;
}

/* ── Build custom card ── */
function buildCustomCard(taskNum) {
  const div = document.createElement('div');
  div.className = 'task-card custom-card';
  div.dataset.id = 'custom';
  div.dataset.tasknum = taskNum;

  div.innerHTML = `
    <div class="card-type" style="color: var(--purple)">Custom</div>
    <div class="card-title">Upload your own question</div>
    <div class="card-tags"><span class="tag" style="background:var(--purple-dim);color:var(--purple);border-color:rgba(167,139,250,0.2)">✎ Custom Upload</span></div>
  `;

  div.addEventListener('click', () => selectCustom(taskNum));
  return div;
}

/* ── Filter cards ── */
function filterCards(taskNum, filter, btn) {
  const key = `task${taskNum}`;
  filters[key] = filter;

  // Update chip active state
  const filterBar = document.getElementById(`filter-${key}`);
  filterBar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');

  renderCards(taskNum);
}

/* ── Open preview modal ── */
function openPreview(taskNum, task) {
  previewTarget = { taskNum, task };

  document.getElementById('modal-meta').textContent =
    `Task ${taskNum}  ·  ${typeLabels[task.type] || task.type}`;
  document.getElementById('modal-title').textContent = task.title;

  const tags = (task.tags || []).map(t => {
    if (t === 'real_exam') return `<span class="tag tag-real">⬤ Real Exam</span>`;
    if (t === 'hot_topic') return `<span class="tag tag-hot">🔥 Hot Topic</span>`;
    return '';
  }).join(' ');
  document.getElementById('modal-tags').innerHTML = tags;

  // Image (Task 1 only)
  const imageWrap = document.getElementById('modal-image-wrap');
  if (taskNum === 1 && task.image) {
    imageWrap.innerHTML = `<img src="${task.image}" alt="${task.title}" onerror="this.parentElement.innerHTML='<span style=padding:20px>Image not available in preview</span>'">`;
    imageWrap.style.display = '';
  } else {
    imageWrap.style.display = 'none';
  }

  document.getElementById('modal-question').textContent = task.question;

  const selectBtn = document.getElementById('modal-select-btn');
  const isAlreadySelected = selected[`task${taskNum}`]?.id === task.id;
  selectBtn.textContent = isAlreadySelected ? '✓ Already Selected' : 'Select This Task';
  selectBtn.disabled = isAlreadySelected;

  document.getElementById('preview-modal').classList.add('open');
}

/* ── Confirm selection from modal ── */
function confirmSelection() {
  const { taskNum, task } = previewTarget;
  selected[`task${taskNum}`] = task;
  closeModal();
  refreshCardHighlights(taskNum);
  updateSummary();
}

/* ── Select custom ── */
function selectCustom(taskNum) {
  selected[`task${taskNum}`] = { id: 'custom', type: 'custom', title: 'Custom Upload' };
  refreshCardHighlights(taskNum);
  updateSummary();
}

/* ── Close modal ── */
function closeModal() {
  document.getElementById('preview-modal').classList.remove('open');
}

function closeModalOnOverlay(e) {
  if (e.target === document.getElementById('preview-modal')) closeModal();
}

/* ── Refresh card highlights ── */
function refreshCardHighlights(taskNum) {
  const key = `task${taskNum}`;
  const container = document.getElementById(`cards-${key}`);
  const sel = selected[key];

  container.querySelectorAll('.task-card').forEach(card => {
    card.classList.toggle('selected', sel && card.dataset.id === sel.id);
  });
}

/* ── Update bottom summary ── */
function updateSummary() {
  const t1 = selected.task1;
  const t2 = selected.task2;

  const dot1 = document.getElementById('dot-task1');
  const dot2 = document.getElementById('dot-task2');
  const label1 = document.getElementById('label-task1');
  const label2 = document.getElementById('label-task2');

  if (t1) {
    dot1.classList.add(t1.id === 'custom' ? 'filled-custom' : 'filled');
    dot1.classList.remove(t1.id === 'custom' ? 'filled' : 'filled-custom');
    label1.textContent = `Task 1: ${t1.title}`;
  } else {
    dot1.className = 'selection-dot';
    label1.textContent = 'Task 1: not selected';
  }

  if (t2) {
    dot2.classList.add(t2.id === 'custom' ? 'filled-custom' : 'filled');
    dot2.classList.remove(t2.id === 'custom' ? 'filled' : 'filled-custom');
    label2.textContent = `Task 2: ${t2.title}`;
  } else {
    dot2.className = 'selection-dot';
    label2.textContent = 'Task 2: not selected';
  }

  document.getElementById('start-btn').disabled = !(t1 && t2);
}

/* ── Mode toggle ── */
function setMode(newMode) {
  mode = newMode;

  const btnPractice = document.getElementById('btn-practice');
  const btnExam = document.getElementById('btn-exam');
  const banner = document.getElementById('exam-banner');
  const panel1 = document.getElementById('panel-task1');
  const panel2 = document.getElementById('panel-task2');

  btnPractice.className = 'mode-btn' + (newMode === 'practice' ? ' active-practice' : '');
  btnExam.className = 'mode-btn' + (newMode === 'exam' ? ' active-exam' : '');

  if (newMode === 'exam') {
    banner.classList.add('visible');
    // Replace card lists with locked state
    showExamLocked(1);
    showExamLocked(2);
    // Clear selection
    selected.task1 = null;
    selected.task2 = null;
    updateSummary();
    // Enable start immediately in exam mode (tasks assigned on start)
    document.getElementById('start-btn').disabled = false;
    document.getElementById('start-btn').innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      Launch Exam Mode
    `;
  } else {
    banner.classList.remove('visible');
    renderCards(1);
    renderCards(2);
    updateSummary();
    document.getElementById('start-btn').innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      Start Writing Test
    `;
  }
}

/* ── Exam locked panel ── */
function showExamLocked(taskNum) {
  const container = document.getElementById(`cards-task${taskNum}`);
  container.innerHTML = `
    <div class="exam-locked">
      <div class="lock-icon">🔒</div>
      <strong>Task ${taskNum} will be randomly assigned</strong>
      Tasks are assigned at launch. No preview available in Exam Mode.
    </div>
  `;
}

/* ── Pick random task (exam mode) ── */
function pickRandom(taskList) {
  return taskList[Math.floor(Math.random() * taskList.length)];
}

/* ── Start exam ── */
function startExam() {
  let t1, t2;

  if (mode === 'exam') {
    // Randomly pick logically paired tasks
    const t1List = tasks.task1.filter(t => t.type !== 'custom');
    const t2List = tasks.task2.filter(t => t.type !== 'custom');
    t1 = pickRandom(t1List);
    t2 = pickRandom(t2List);
  } else {
    t1 = selected.task1;
    t2 = selected.task2;
    if (!t1 || !t2) return;
  }

  // Pass data via sessionStorage
  sessionStorage.setItem('examTask1', JSON.stringify(t1));
  sessionStorage.setItem('examTask2', JSON.stringify(t2));
  sessionStorage.setItem('examMode', mode);

  // Open exam in new tab
  const examWindow = window.open('exam.html', '_blank');

  // Attempt fullscreen after load
  if (examWindow) {
    examWindow.addEventListener('load', () => {
      try {
        examWindow.document.documentElement.requestFullscreen?.();
      } catch (e) {}
    });
  }
}

/* ── Keyboard shortcut ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

init();
