/* ── Load task data from sessionStorage ── */
const examTask1 = JSON.parse(sessionStorage.getItem('examTask1') || 'null');
const examTask2 = JSON.parse(sessionStorage.getItem('examTask2') || 'null');
const examMode  = sessionStorage.getItem('examMode') || 'practice';

/* ── Per-task state ── */
const taskState = {
  1: { text: '', task: examTask1 },
  2: { text: '', task: examTask2 }
};

let currentTask = 1;
let timerRunning = false;
let timeLeft = 60 * 60; // 60 minutes
let timerInterval = null;

/* ── Type label map ── */
const typeLabels = {
  line_graph: 'Line Graph', bar_chart: 'Bar Chart', pie_chart: 'Pie Chart',
  table: 'Table', map: 'Map', process_diagram: 'Process Diagram', mixed: 'Mixed Chart',
  opinion: 'Opinion', discussion: 'Discussion', problem_solution: 'Problem & Solution',
  direct_question: 'Direct Question', advantages_disadvantages: 'Adv / Disadv',
  custom: 'Custom'
};

const minWords = { 1: 150, 2: 250 };

/* ── Init ── */
function init() {
  // Candidate ID
  const id = sessionStorage.getItem('candidateId') || '——';
  document.getElementById('candidate-id-display').textContent = 'ID: ' + id;

  // Exam mode badge
  if (examMode === 'exam') {
    document.getElementById('exam-mode-badge').style.display = 'inline-flex';
  }

  // Render task 1 initially
  renderTask(1);

  // Fullscreen handling
  tryAutoFullscreen();
  document.addEventListener('fullscreenchange', onFullscreenChange);
}

/* ── Fullscreen ── */
function tryAutoFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen().then(() => {
      document.getElementById('fullscreen-bar').classList.add('hidden');
    }).catch(() => {
      // Browser blocked — show prompt bar
    });
  }
}

function goFullscreen() {
  document.documentElement.requestFullscreen?.().then(() => {
    document.getElementById('fullscreen-bar').classList.add('hidden');
  });
}

function onFullscreenChange() {
  const isFullscreen = !!document.fullscreenElement;
  document.getElementById('fullscreen-bar').classList.toggle('hidden', isFullscreen);
}

/* ── Render task question panel ── */
function renderTask(taskNum) {
  const task = taskState[taskNum].task;

  document.getElementById('panel-task-label').textContent = `Writing Task ${taskNum}`;
  document.getElementById('panel-type-badge').textContent =
    task ? (typeLabels[task.type] || task.type) : '—';

  const questionText = document.getElementById('question-text');
  const questionImage = document.getElementById('question-image');
  const uploadZone = document.getElementById('upload-zone');
  const writingArea = document.getElementById('writing-area');

  if (!task || task.id === 'custom') {
    // Custom mode: editable question, upload zone
    questionText.contentEditable = 'true';
    questionText.textContent = task?.questionText || 'Paste your question here…';
    uploadZone.classList.add('visible');
    questionImage.style.display = 'none';
  } else {
    questionText.contentEditable = 'false';
    questionText.textContent = task.question || '';
    uploadZone.classList.remove('visible');

    if (taskNum === 1 && task.image) {
      questionImage.src = task.image;
      questionImage.style.display = 'block';
      questionImage.onerror = () => { questionImage.style.display = 'none'; };
    } else {
      questionImage.style.display = 'none';
    }
  }

  // Restore writing text
  writingArea.value = taskState[taskNum].text;

  // Update word count
  updateWordCount();

  // Update tabs
  document.getElementById('tab-task1').classList.toggle('active', taskNum === 1);
  document.getElementById('tab-task2').classList.toggle('active', taskNum === 2);

  // Update min word label
  document.getElementById('word-min-label').textContent = `/ min ${minWords[taskNum]}`;
}

/* ── Switch task ── */
function switchTask(taskNum) {
  if (taskNum === currentTask) return;

  // Save current writing
  taskState[currentTask].text = document.getElementById('writing-area').value;

  // Save custom question text if applicable
  const task = taskState[currentTask].task;
  if (!task || task.id === 'custom') {
    if (!taskState[currentTask].task) taskState[currentTask].task = {};
    taskState[currentTask].task.questionText = document.getElementById('question-text').textContent;
  }

  currentTask = taskNum;
  renderTask(taskNum);
}

/* ── Timer ── */
function startTimer() {
  if (timerRunning) return;
  timerRunning = true;

  const startBtn = document.getElementById('start-btn');
  startBtn.disabled = true;
  startBtn.textContent = 'RUNNING';

  const writingArea = document.getElementById('writing-area');
  writingArea.disabled = false;
  writingArea.focus();

  timerInterval = setInterval(tick, 1000);
}

function tick() {
  timeLeft--;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const display = document.getElementById('timer-display');
  display.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  // Colour states
  display.classList.toggle('warning', timeLeft <= 600 && timeLeft > 300);
  display.classList.toggle('danger', timeLeft <= 300);

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    document.getElementById('writing-area').disabled = true;
    document.getElementById('times-up').classList.add('show');
  }
}

/* ── Word count ── */
function updateWordCount() {
  const text = document.getElementById('writing-area').value.trim();
  const count = text ? text.split(/\s+/).length : 0;
  const min = minWords[currentTask];
  const el = document.getElementById('word-count');

  el.textContent = count;
  el.classList.toggle('below', count < min);
  el.classList.toggle('ok', count >= min);
}

document.getElementById('writing-area').addEventListener('input', () => {
  taskState[currentTask].text = document.getElementById('writing-area').value;
  updateWordCount();
});

/* ── Custom image upload ── */
function previewUploadedImage(event) {
  const reader = new FileReader();
  reader.onload = function () {
    const img = document.getElementById('question-image');
    img.src = reader.result;
    img.style.display = 'block';
    if (!taskState[currentTask].task) taskState[currentTask].task = {};
    taskState[currentTask].task.uploadedImage = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

/* ── Keyboard shortcut ── */
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === '1') switchTask(1);
  if (e.ctrlKey && e.key === '2') switchTask(2);
});

init();
