const form = document.getElementById('bpForm');
const entriesTbody = document.getElementById('entries');
const clearFormBtn = document.getElementById('clearForm');
const clearAllBtn = document.getElementById('clearAll');
const themeToggle = document.getElementById('themeToggle');

let entries = [];

// Theme management
function loadTheme() {
  const saved = localStorage.getItem('theme');
  const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(isDark ? 'dark' : 'light');
}

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.checked = isDark;
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('change', () => {
  setTheme(themeToggle.checked ? 'dark' : 'light');
});

function loadEntries() {
  const raw = localStorage.getItem('bp_entries');
  if (raw) {
    entries = JSON.parse(raw);
  } else {
    entries = [];
  }
}

function saveEntries() {
  localStorage.setItem('bp_entries', JSON.stringify(entries));
}

function renderEntries() {
  entriesTbody.innerHTML = '';
  entries.slice().reverse().forEach((e, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${e.datetime}</td>
      <td>${e.systolic}</td>
      <td>${e.diastolic}</td>
      <td>${e.pulse || ''}</td>
      <td>${e.med}</td>
      <td>${e.notes || ''}</td>
      <td><button data-i="${entries.length - 1 - idx}">刪除</button></td>
    `;
    entriesTbody.appendChild(tr);
  });
}

function formatNow() {
  const d = new Date();
  return d.toLocaleString();
}

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const systolic = document.getElementById('systolic').value;
  const diastolic = document.getElementById('diastolic').value;
  const pulse = document.getElementById('pulse').value;
  const med = document.getElementById('med').value;
  const notes = document.getElementById('notes').value;

  const entry = {
    datetime: formatNow(),
    systolic,
    diastolic,
    pulse,
    med,
    notes
  };
  entries.push(entry);
  saveEntries();
  renderEntries();
  form.reset();
});

entriesTbody.addEventListener('click', (ev) => {
  if (ev.target.tagName === 'BUTTON') {
    const i = Number(ev.target.dataset.i);
    if (!Number.isNaN(i)) {
      entries.splice(i, 1);
      saveEntries();
      renderEntries();
    }
  }
});

clearFormBtn.addEventListener('click', () => form.reset());
clearAllBtn.addEventListener('click', () => {
  if (confirm('確定清除所有紀錄？')) {
    entries = [];
    saveEntries();
    renderEntries();
  }
});

// init
loadTheme();
loadEntries();
renderEntries();
