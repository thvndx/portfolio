import { phases, tasks, resources, certifications } from './roadmap.mjs';
import { STORAGE_KEY, STATUSES, EVIDENCE_TYPES, CATEGORIES, dateToday, weekStart, addDays, daysBetween, newState, planWeek, currentPhase, taskDate, weeklyMinutes, nextTasks, completion, spending, resume, validateState, parseBackup } from './core.mjs';

const content = document.querySelector('#content');
const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[ch]));
const money = value => new Intl.NumberFormat('en-ZA', {style: 'currency', currency: 'ZAR', maximumFractionDigits: 2}).format(value);
const niceDate = date => new Intl.DateTimeFormat('en-ZA', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Africa/Johannesburg'}).format(new Date(`${date}T12:00:00Z`));
const titleCase = value => value.replaceAll('-', ' ').replace(/^./, c => c.toUpperCase());
const uid = () => crypto.randomUUID();
const resourceLink = key => `<a class="resource-link" href="${resources[key][1]}" target="_blank" rel="noopener noreferrer">${resources[key][0]} ↗</a>`;
const options = (values, selected) => values.map(value => `<option value="${escape(value)}" ${value === selected ? 'selected' : ''}>${escape(titleCase(value))}</option>`).join('');
const taskOptions = (selected, optional = false) => `${optional ? '<option value="">General evidence</option>' : ''}${tasks.map(t => `<option value="${t.id}" ${t.id === selected ? 'selected' : ''}>${escape(t.title)}</option>`).join('')}`;
let state = newState();
let storageBlocked = false;
let editingSession = null, editingEvidence = null, editingExpense = null;

function storageError(message) {
  const alert = document.querySelector('#storage-alert');
  alert.textContent = message;
  alert.hidden = false;
}
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) state = parseBackup(saved);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
} catch {
  storageBlocked = true;
  storageError('Saved progress could not be read, or browser storage is unavailable. Existing stored data will not be overwritten. You can work in memory and export a backup; import a valid backup or explicitly reset to retry storage.');
}

function persist() {
  if (storageBlocked) return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { storageBlocked = true; storageError('Browser storage is unavailable or full. Changes currently live in memory only. Export a backup before closing this page.'); }
}
function notice(message, error = false) {
  const node = document.querySelector('#notice');
  node.textContent = message;
  node.classList.toggle('danger', error);
  node.hidden = false;
}
function mutate(callback, message) {
  try {
    const next = structuredClone(state);
    callback(next);
    state = validateState(next);
    persist(); render();
    notice(message + (storageBlocked ? ' Export a backup: this change is in memory only.' : ''));
    return true;
  } catch (error) { notice(error.message, true); return false; }
}
const heading = (eyebrow, title, description, action = '') => `<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="subtitle">${description}</p></div>${action}</div>`;
const empty = text => `<div class="empty">${text}</div>`;
function taskCard(t, compact = false) {
  const p = state.progress[t.id];
  return `<article class="task-card ${p.status === 'completed' ? 'is-complete' : ''}"><div class="task-top"><span class="status ${p.status}">${titleCase(p.status)}</span><span class="muted">${t.hours}h total effort${t.hours > state.settings.weeklyHours ? ' · split across sessions' : ''}</span></div><h3>${escape(t.title)}</h3>${compact ? '' : `<p class="task-meta">Suggested week ${t.week} · ${niceDate(taskDate(state, t))}</p>`}<details><summary>Completion criteria & update</summary><p class="criteria">${escape(t.criteria)}</p>${resourceLink(t.resource)}<form data-form="task" data-id="${t.id}" class="stack task-form"><label>Status<select name="status">${options(STATUSES, p.status)}</select></label><label>Evidence / blocker note<textarea name="note" maxlength="3000" rows="2" placeholder="What did you demonstrate, or what is blocking you?">${escape(p.note)}</textarea></label><label>Reschedule this task<input type="date" name="dueDate" value="${escape(p.dueDate || '')}"><small>Leave blank to follow the roadmap.</small></label><button class="button secondary" type="submit">Save task</button></form></details></article>`;
}

function todayView() {
  const today = dateToday(), phase = currentPhase(state), week = planWeek(state);
  const minutes = weeklyMinutes(state), target = state.settings.weeklyHours * 60;
  const done = completion(state), milestones = completion(state, 'milestone');
  const focus = nextTasks(state), paused = state.settings.pausedAt;
  const reviewKey = weekStart(today), review = state.reviews[reviewKey] || {worked: '', blocked: '', priorities: ['', '', '']};
  const thisWeekPriorities = state.reviews[addDays(reviewKey, -7)]?.priorities || [];
  const session = state.sessions.find(s => s.id === editingSession);
  const blocked = tasks.filter(t => state.progress[t.id].status === 'blocked');
  const backupDue = !state.lastBackup || daysBetween(state.lastBackup, today) >= 7;
  return `${heading('YOUR PERSONAL LEARNING DESK', 'Small steps. Real progress.', 'Full-stack engineering · Azure & AI · Secure software', `<button class="button secondary" data-action="pause">${paused ? 'Resume roadmap' : 'Pause roadmap'}</button>`)}
    ${paused ? `<div class="banner">Roadmap paused since ${niceDate(paused)}. Resume shifts unfinished deadlines by the paused days. You can still log study and evidence.</div>` : ''}
    ${backupDue ? '<div class="backup-callout"><span>Keep your progress safe. Your weekly backup is due.</span><button data-action="export" class="text-button">Export backup ↗</button></div>' : ''}
    <section class="stats" aria-label="Progress overview">
      <article><span class="eyebrow">THIS WEEK</span><div class="stat-number">${(minutes / 60).toFixed(1)}<small> / ${state.settings.weeklyHours}h</small></div><progress max="100" value="${Math.min(100, minutes / target * 100)}" aria-label="Weekly study commitment"></progress><p>${minutes >= target ? 'Weekly commitment reached. Rest counts, too.' : `${Math.max(0, target - minutes)} minutes to your commitment`}</p></article>
      <article><span class="eyebrow">ROADMAP TASKS</span><div class="stat-number">${done.done}<small> / ${done.total}</small></div><progress max="100" value="${done.percent}" aria-label="Roadmap tasks completed"></progress><p>${done.percent}% complete · hours aren’t mastery</p></article>
      <article><span class="eyebrow">PROJECT MILESTONES</span><div class="stat-number">${milestones.done}<small> / ${milestones.total}</small></div><p>Demonstrate it. Then mark it complete.</p></article>
      <article><span class="eyebrow">BUDGET REMAINING</span><div class="stat-number money">${money(state.settings.budget - spending(state).actual)}</div><p>Of ${money(state.settings.budget)} · actual spending</p></article>
    </section>
    <section class="focus-band"><div><span class="eyebrow">${paused ? 'PAUSED AT' : 'CURRENT PHASE'} · WEEK ${week}${week > 52 ? ' · EXTENDED' : ' OF 52'}</span><h2>${phase.title}</h2><p>${phase.description}</p></div><a href="#roadmap" class="button light">See the roadmap →</a></section>
    <div class="two-columns"><section><div class="section-heading"><h2>This week’s focus</h2><span class="muted">${niceDate(reviewKey)}–${niceDate(addDays(reviewKey, 6))}</span></div><p class="helper">Work within ${state.settings.weeklyHours} hours. These are your next tasks, not an extra weekly workload. Carry unfinished work forward.</p>${thisWeekPriorities.some(Boolean) ? `<ol class="priorities">${thisWeekPriorities.filter(Boolean).map(p => `<li>${escape(p)}</li>`).join('')}</ol>` : ''}${paused ? empty('Your roadmap is paused. Resume when you are ready for the next step.') : focus.length ? `<div class="task-list">${focus.map(t => taskCard(t, true)).join('')}</div>` : empty(blocked.length ? 'Your remaining tasks are blocked. Review the blockers in the roadmap.' : 'All roadmap tasks are complete. Review your evidence and choose your next goal.')}${blocked.length ? `<p class="helper">${blocked.length} blocked task${blocked.length === 1 ? '' : 's'}. <a href="#roadmap">Review blockers →</a></p>` : ''}</section>
    <section><div class="section-heading"><h2>${session ? 'Edit study session' : 'Log a study session'}</h2><span class="pill">EVERY SESSION COUNTS</span></div><form data-form="session" class="panel stack"><div class="form-row"><label>Date<input required type="date" name="date" max="${today}" value="${session?.date || today}"></label><label>Minutes<input required name="minutes" type="number" min="1" max="1440" step="1" value="${session?.minutes || 60}"></label></div><label>Related task<select name="taskId">${taskOptions(session?.taskId || focus[0]?.id || tasks[0].id)}</select></label><label>What did you learn?<textarea name="reflection" rows="3" maxlength="3000" placeholder="One useful insight, result or next question…">${escape(session?.reflection || '')}</textarea></label><div class="button-row"><button class="button" type="submit">${session ? 'Save changes' : 'Save session'}</button>${session ? '<button class="text-button" type="button" data-action="cancel-session">Cancel</button>' : ''}</div></form>
    <div class="section-heading spaced"><h2>Recent sessions</h2></div>${state.sessions.length ? `<div class="panel record-list">${[...state.sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map(s => `<article class="record"><div><strong>${escape(tasks.find(t => t.id === s.taskId).title)}</strong><p>${niceDate(s.date)} · ${s.minutes} min</p>${s.reflection ? `<p class="record-note">${escape(s.reflection)}</p>` : ''}</div><div class="record-actions"><button class="text-button" data-action="edit-session" data-id="${s.id}">Edit</button><button class="text-button delete" data-action="delete-session" data-id="${s.id}">Delete</button></div></article>`).join('')}</div>` : empty('Your first session starts the story. Log it above.')}<details class="panel all-sessions"><summary>All study sessions (${state.sessions.length})</summary>${state.sessions.length ? [...state.sessions].sort((a,b) => b.date.localeCompare(a.date)).map(s => `<div class="record"><span>${niceDate(s.date)} · ${s.minutes} min · ${escape(tasks.find(t => t.id === s.taskId).title)}</span><div class="record-actions"><button class="text-button" data-action="edit-session" data-id="${s.id}">Edit</button><button class="text-button delete" data-action="delete-session" data-id="${s.id}">Delete</button></div></div>`).join('') : '<p>No sessions yet.</p>'}</details></section></div>
    <section class="review-section"><div class="section-heading"><h2>Weekly check-in</h2><span class="muted">A little reflection keeps the plan honest.</span></div><form data-form="review" class="panel"><div class="two-columns"><label>What worked?<textarea name="worked" maxlength="3000" rows="3" placeholder="A win, a useful routine, something you understood…">${escape(review.worked)}</textarea></label><label>What got in the way?<textarea name="blocked" maxlength="3000" rows="3" placeholder="Time, a confusing concept, an unexpected cost…">${escape(review.blocked)}</textarea></label></div><div class="three-columns">${review.priorities.map((p,i) => `<label>Next week · priority ${i + 1}<input name="priority${i}" maxlength="300" value="${escape(p)}" placeholder="One specific, manageable step"></label>`).join('')}</div><button class="button secondary" type="submit">Save weekly review</button></form></section>`;
}

function roadmapView() {
  const totalHours = tasks.reduce((sum, t) => sum + t.hours, 0), phase = currentPhase(state);
  return `${heading('THE YEAR AHEAD', 'A roadmap with room to breathe.', 'One capstone. Focused credentials. Practical security. Free learning first.')}
    <div class="roadmap-summary panel"><div><strong>${totalHours} planned hours</strong><p>Across 52 weeks · ${state.settings.weeklyHours}h weekly commitment · up to 2 optional hours</p></div><div><strong>Five phases, one professional story</strong><p>Dates guide you. Demonstrated skills move you forward.</p></div></div>
    <div class="phase-list">${phases.map(p => {
      const count = p.tasks.filter(t => state.progress[t.id].status === 'completed').length;
      return `<details class="phase" ${p.id === phase.id ? 'open' : ''}><summary><span class="phase-number">${p.label}</span><div><h2>${p.title}</h2><p>Weeks ${p.weeks[0]}–${p.weeks[1]} · ${p.tasks.reduce((s,t) => s+t.hours,0)}h total · ${count}/${p.tasks.length} tasks complete</p></div><span class="phase-chevron" aria-hidden="true">+</span></summary><div class="phase-body"><p class="helper">${p.description}</p><div class="task-grid">${p.tasks.map(t => taskCard(t)).join('')}</div></div></details>`;
    }).join('')}</div>
    <section class="panel roadmap-notes"><h2>Make the plan work for you</h2><p>Use two hours for learning, two for implementation and one for review. Large tasks span several sessions; smaller security labs fit into one session. If life gets busy, pause or reschedule unfinished tasks instead of adding hours.</p><p>Begin suitable applications after the delivery phase. Defer Terraform, AWS, Kubernetes and specialist security exams until job feedback supports a need.</p><p>Practice security only in authorized labs or your own demonstration code. Optional local practice: ${resourceLink('owasp')}.</p></section>`;
}

function evidenceView() {
  const entry = state.evidence.find(e => e.id === editingEvidence), today = dateToday();
  const labs = completion(state, 'lab'), writeups = completion(state, 'writeup');
  return `${heading('SHOW YOUR WORK', 'Skills you can point to.', 'Keep the evidence behind your labs, project milestones and credentials.')}
    <div class="evidence-goals"><article class="panel"><span class="eyebrow">SECURITY LABS</span><h2>${labs.done} / 20</h2><p>Distinct introductory labs completed</p></article><article class="panel"><span class="eyebrow">SECURITY WRITE-UPS</span><h2>${writeups.done} / 3</h2><p>Cause, impact, fix and verification</p></article><article class="panel"><span class="eyebrow">EVIDENCE RECORDS</span><h2>${state.evidence.length}</h2><p>Learning records are separate from certifications</p></article></div>
    <div class="two-columns"><section><div class="section-heading"><h2>${entry ? 'Edit evidence' : 'Add evidence'}</h2></div><form data-form="evidence" class="panel stack"><div class="form-row"><label>Type<select name="type">${options(EVIDENCE_TYPES, entry?.type || 'lab')}</select></label><label>Date<input required name="date" type="date" max="${today}" value="${entry?.date || today}"></label></div><label>Title<input required name="title" maxlength="200" value="${escape(entry?.title || '')}" placeholder="What did you complete or demonstrate?"></label><label>Related task<select name="taskId">${taskOptions(entry?.taskId || '', true)}</select></label><label>Evidence link (optional)<input name="url" type="url" maxlength="2048" value="${escape(entry?.url || '')}" placeholder="https://…"><small>Use an HTTP or HTTPS link; local notes work too.</small></label><label>Practice score % (practice assessments only)<input name="score" type="number" min="0" max="100" step="0.1" value="${entry?.score ?? ''}"></label><label>Result, lesson & verification<textarea name="notes" maxlength="3000" rows="4" placeholder="Explain what happened, what you learned and how you verified it.">${escape(entry?.notes || '')}</textarea></label><div class="button-row"><button type="submit" class="button">${entry ? 'Save changes' : 'Save evidence'}</button>${entry ? '<button class="text-button" type="button" data-action="cancel-evidence">Cancel</button>' : ''}</div><small>Saving evidence does not automatically complete a task or award a credential.</small></form></section>
    <section><div class="section-heading"><h2>Your evidence library</h2></div>${state.evidence.length ? `<div class="record-list">${[...state.evidence].sort((a,b) => b.date.localeCompare(a.date)).map(e => `<article class="panel evidence-record"><div class="task-top"><span class="pill">${titleCase(e.type)}</span><span class="muted">${niceDate(e.date)}</span></div><h3>${escape(e.title)}</h3>${e.taskId ? `<p class="helper">${escape(tasks.find(t => t.id === e.taskId).title)}</p>` : ''}${e.score !== null ? `<p class="score">Practice score: ${e.score}%</p>` : ''}${e.notes ? `<p class="record-note">${escape(e.notes)}</p>` : ''}<div class="button-row">${e.url ? `<a class="resource-link" href="${escape(e.url)}" target="_blank" rel="noopener noreferrer">Open evidence ↗</a>` : ''}<button class="text-button" data-action="edit-evidence" data-id="${e.id}">Edit</button><button class="text-button delete" data-action="delete-evidence" data-id="${e.id}">Delete</button></div></article>`).join('')}</div>` : empty('No evidence yet. A lab note, a deployment log or a short write-up is a good start.')}</section></div>
    <section class="credentials-section"><div class="section-heading"><h2>Certification tracker</h2><span class="muted">Preparation, booking and passing are separate.</span></div><div class="task-grid">${certifications.map(c => {
      const row = state.credentials[c.id];
      return `<article class="panel credential"><span class="eyebrow">${c.name}</span><h3>${c.title}</h3><p class="helper">${c.priority}</p>${resourceLink(c.resource)}<form data-form="credential" data-id="${c.id}" class="stack"><label>Status<select name="status">${options(['not-started', 'preparing', 'ready', 'booked', 'passed', 'deferred'], row.status)}</select></label><label>Exam / result date<input type="date" name="date" value="${row.date}"></label><label>Result / verification note<textarea name="result" maxlength="1000" rows="2" placeholder="Required to record a pass">${escape(row.result)}</textarea></label><button class="button secondary" type="submit">Save credential</button></form></article>`;
    }).join('')}</div><p class="helper">Readiness target: 85% on two spaced assessments, plus practical demonstrations. This is a personal target, not an official passing score. When assessments are unavailable, use current exam objectives and demonstrated evidence. Recheck the syllabus, availability and South African price before booking. SC-900 has an announced syllabus update for 21 October 2026.</p></section>`;
}

function settingsView() {
  const s = state.settings, totals = spending(state), expense = state.expenses.find(e => e.id === editingExpense);
  const budgetWarning = totals.actual > s.budget || totals.planned > s.budget;
  const names = {exams: 'Exams', labs: 'Cloud & AI experiments', reserve: 'Retake / unexpected costs', courses: 'Courses & local learning'};
  return `${heading('KEEP IT SUSTAINABLE', 'Your pace. Your budget.', 'Spend deliberately, adjust the plan and keep a copy of your progress.')}
    ${budgetWarning ? '<div class="banner danger">Your planned or actual costs exceed your budget. Defer a purchase, revise the plan or use a verified voucher. This tracker does not stop cloud charges.</div>' : ''}
    <div class="stats budget-stats"><article><span class="eyebrow">SPENDING LIMIT</span><div class="stat-number money">${money(s.budget)}</div><p>Editable up to R5,000</p></article><article><span class="eyebrow">PLANNED COSTS</span><div class="stat-number money">${money(totals.planned)}</div><p>Estimates entered by you</p></article><article><span class="eyebrow">ACTUAL SPENDING</span><div class="stat-number money">${money(totals.actual)}</div><p>Paid costs entered by you</p></article><article><span class="eyebrow">REMAINING</span><div class="stat-number money">${money(s.budget - totals.actual)}</div><p>Reserve is an allowance, not a payment</p></article></div>
    <div class="two-columns"><section><div class="section-heading"><h2>Plan settings</h2></div><form data-form="settings" class="panel stack"><div class="form-row"><label>Start date<input required type="date" name="startDate" value="${s.startDate}"></label><label>Weekly hours<input required type="number" name="weeklyHours" min="1" max="20" step="0.5" value="${s.weeklyHours}"></label></div><label>Total budget (ZAR)<input required type="number" name="budget" min="0" max="5000" step="0.01" value="${s.budget}"></label><fieldset><legend>Spending allowances (ZAR)</legend><div class="form-row">${CATEGORIES.map(c => `<label>${names[c]}<input required name="${c}" type="number" min="0" max="5000" step="0.01" value="${s.allowances[c]}"></label>`).join('')}</div></fieldset><p class="helper">Allowances must fit the total budget. Changing your start date shifts default task dates; individually rescheduled dates stay fixed. Completed work and study history remain intact.</p><button class="button" type="submit">Save settings</button></form>
    <section class="panel spaced"><h2>Allowance check</h2>${CATEGORIES.map(c => { const cost = spending(state,c); return `<div class="allowance"><div><strong>${names[c]}</strong><p>Planned ${money(cost.planned)} · actual ${money(cost.actual)}</p></div><span class="${cost.actual > s.allowances[c] || cost.planned > s.allowances[c] ? 'over-budget' : ''}">${money(s.allowances[c])}</span></div>`; }).join('')}<p class="helper">These are spending envelopes, not verified prices. Use free courses and local labs first; keep cloud trials short and clean up resources.</p></section></section>
    <section><div class="section-heading"><h2>${expense ? 'Edit expense' : 'Plan or record a cost'}</h2></div><form data-form="expense" class="panel stack"><label>Description<input required name="title" maxlength="200" value="${escape(expense?.title || '')}" placeholder="Exam quote, cloud trial, voucher…"></label><div class="form-row"><label>Category<select name="category">${options(CATEGORIES, expense?.category || 'exams')}</select></label><label>Date<input required name="date" type="date" value="${expense?.date || dateToday()}"></label></div><div class="form-row"><label>Planned cost (ZAR)<input required name="planned" type="number" min="0" max="1000000" step="0.01" value="${expense?.planned ?? 0}"></label><label>Actual paid (ZAR)<input required name="actual" type="number" min="0" max="1000000" step="0.01" value="${expense?.actual ?? 0}"></label></div><div class="button-row"><button class="button" type="submit">${expense ? 'Save changes' : 'Save cost'}</button>${expense ? '<button class="text-button" type="button" data-action="cancel-expense">Cancel</button>' : ''}</div><small>Update the same record when you pay, so you don’t count the cost twice.</small></form><div class="section-heading spaced"><h2>Cost ledger</h2></div>${state.expenses.length ? `<div class="panel record-list">${[...state.expenses].sort((a,b) => b.date.localeCompare(a.date)).map(e => `<article class="record"><div><strong>${escape(e.title)}</strong><p>${names[e.category]} · ${niceDate(e.date)}</p><p>Planned ${money(e.planned)} · paid ${money(e.actual)}</p></div><div class="record-actions"><button class="text-button" data-action="edit-expense" data-id="${e.id}">Edit</button><button class="text-button delete" data-action="delete-expense" data-id="${e.id}">Delete</button></div></article>`).join('')}</div>` : empty('No costs recorded. Free learning is the default.')}</section></div>
    <section class="panel backups"><div><h2>Keep your progress safe</h2><p>Saved in this browser at <strong>${escape(location.origin)}</strong>. Browser clearing or switching devices can remove access to it. Use an exported JSON backup to restore it.</p><p class="helper">Last export: ${state.lastBackup ? niceDate(state.lastBackup) : 'not yet'}. Evidence links and notes are included; external files are not.</p></div><div class="backup-buttons"><button class="button" data-action="export">Export backup</button><label class="button secondary file-button">Import backup<input id="import-backup" type="file" accept=".json,application/json"></label><button class="text-button delete" data-action="reset">Reset progress</button></div></section>
    <section><div class="section-heading"><h2>Past weekly reviews</h2></div>${Object.keys(state.reviews).length ? `<div class="task-grid">${Object.entries(state.reviews).sort(([a],[b]) => b.localeCompare(a)).map(([date,r]) => `<article class="panel"><h3>Week of ${niceDate(date)}</h3><p class="record-note"><strong>Worked:</strong> ${escape(r.worked || '—')}</p><p class="record-note"><strong>Blocked:</strong> ${escape(r.blocked || '—')}</p><ol>${r.priorities.filter(Boolean).map(p => `<li>${escape(p)}</li>`).join('')}</ol></article>`).join('')}</div>` : empty('Weekly reflections will appear here after your first check-in.')}</section>`;
}

function render() {
  const view = ['today', 'roadmap', 'evidence', 'settings'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'today';
  document.querySelectorAll('[data-view]').forEach(node => { node.classList.toggle('active', node.dataset.view === view); if (node.dataset.view === view) node.setAttribute('aria-current','page'); else node.removeAttribute('aria-current'); });
  document.querySelector('#today-date').textContent = niceDate(dateToday());
  content.innerHTML = ({today: todayView, roadmap: roadmapView, evidence: evidenceView, settings: settingsView})[view]();
}
window.addEventListener('hashchange', () => { render(); content.focus(); });
window.addEventListener('storage', event => {
  if (event.key === STORAGE_KEY) {
    try { if (event.newValue) { state = parseBackup(event.newValue); render(); notice('Progress updated from another tab.'); } else { storageBlocked = true; storageError('Saved progress was removed in another tab. Export your current progress or reset to start again.'); } }
    catch { storageBlocked = true; storageError('Another tab saved invalid data. Export your progress before closing.'); }
  }
});

content.addEventListener('submit', event => {
  const form = event.target.closest('form[data-form]');
  if (!form) return;
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  if (['session', 'evidence'].includes(form.dataset.form) && data.date > dateToday()) { notice('Use today or an earlier date for completed study and evidence.', true); return; }
  switch (form.dataset.form) {
    case 'task': mutate(s => { s.progress[form.dataset.id] = {status: data.status, note: data.note.trim(), dueDate: data.dueDate || (data.status === 'completed' ? taskDate(s, tasks.find(t => t.id === form.dataset.id)) : null)}; }, 'Task updated.'); break;
    case 'session': {
      const edit = editingSession;
      if (mutate(s => { const row = {id: edit || uid(), date: data.date, minutes: Number(data.minutes), taskId: data.taskId, reflection: data.reflection.trim()}; if (edit) s.sessions[s.sessions.findIndex(x => x.id === edit)] = row; else s.sessions.push(row); }, 'Study session saved.')) { editingSession = null; render(); } break;
    }
    case 'review': mutate(s => { s.reviews[weekStart(dateToday())] = {worked: data.worked.trim(), blocked: data.blocked.trim(), priorities: [data.priority0.trim(), data.priority1.trim(), data.priority2.trim()]}; }, 'Weekly review saved.'); break;
    case 'evidence': {
      if (data.score !== '' && data.type !== 'practice') { notice('Practice scores belong to practice-assessment evidence only.', true); return; }
      const edit = editingEvidence;
      if (mutate(s => { const row = {id: edit || uid(), date: data.date, type: data.type, taskId: data.taskId, title: data.title.trim(), url: data.url.trim(), notes: data.notes.trim(), score: data.score === '' ? null : Number(data.score)}; if (edit) s.evidence[s.evidence.findIndex(x => x.id === edit)] = row; else s.evidence.push(row); }, 'Evidence saved.')) { editingEvidence = null; render(); } break;
    }
    case 'credential': {
      if (data.status === 'passed' && (!data.result.trim() || !data.date || data.date > dateToday())) { notice('To record a pass, enter the result date (today or earlier) and a verification note.', true); return; }
      if (data.status === 'booked' && !data.date) { notice('Enter the booked exam date.', true); return; }
      mutate(s => { s.credentials[form.dataset.id] = {status: data.status, date: data.date, result: data.result.trim()}; }, 'Credential updated.'); break;
    }
    case 'settings': {
      const allowances = Object.fromEntries(CATEGORIES.map(c => [c, Number(data[c])]));
      if (Object.values(allowances).reduce((sum,value) => sum+Math.round(value*100), 0) > Math.round(Number(data.budget)*100)) { notice('Reduce the allowances so their total fits your budget.', true); return; }
      mutate(s => { Object.assign(s.settings, {startDate: data.startDate, weeklyHours: Number(data.weeklyHours), budget: Number(data.budget), allowances}); }, 'Settings saved.'); break;
    }
    case 'expense': {
      const edit = editingExpense;
      if (mutate(s => { const row = {id: edit || uid(), title: data.title.trim(), date: data.date, category: data.category, planned: Number(data.planned), actual: Number(data.actual)}; if (edit) s.expenses[s.expenses.findIndex(x => x.id === edit)] = row; else s.expenses.push(row); }, 'Cost saved.')) { editingExpense = null; render(); } break;
    }
  }
});

document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action, id = button.dataset.id;
  if (action === 'pause') { mutate(s => { if (s.settings.pausedAt) resume(s); else s.settings.pausedAt = dateToday(); }, state.settings.pausedAt ? 'Roadmap resumed; unfinished dates adjusted.' : 'Roadmap paused. Your progress is preserved.'); return; }
  for (const [type, key] of [['session','sessions'], ['evidence','evidence'], ['expense','expenses']]) {
    if (action === `delete-${type}`) {
      if (confirm(`Delete this ${type} record? This cannot be undone except by restoring a backup.`)) mutate(s => { s[key] = s[key].filter(row => row.id !== id); }, 'Record deleted.');
      return;
    }
    if (action === `edit-${type}` || action === `cancel-${type}`) {
      const value = action.startsWith('edit') ? id : null;
      if (type === 'session') editingSession = value;
      if (type === 'evidence') editingEvidence = value;
      if (type === 'expense') editingExpense = value;
      render(); content.querySelector(`[data-form="${type}"] input`)?.focus(); return;
    }
  }
  if (action === 'export') {
    const next = structuredClone(state); next.lastBackup = dateToday();
    const blob = new Blob([JSON.stringify(next, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = `learning-desk-${dateToday()}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    state = next; persist(); render(); notice('Backup download prepared. Keep the JSON file somewhere safe.');
  }
  if (action === 'reset' && confirm('Reset all learning progress, sessions, evidence, reviews and costs? Export a backup first if you want to keep them.')) {
    state = newState(); editingSession = editingEvidence = editingExpense = null;
    storageBlocked = false; document.querySelector('#storage-alert').hidden = true; persist(); render(); notice('Dashboard reset.');
  }
});

document.addEventListener('change', async event => {
  if (event.target.id !== 'import-backup') return;
  const file = event.target.files[0]; if (!file) return;
  try {
    if (file.size > 5_000_000) throw new Error('Backup exceeds the 5 MB limit. Existing progress is unchanged.');
    const imported = parseBackup(await file.text());
    if (!confirm('Replace your current progress with this validated backup? Export your current progress first if you want to keep it.')) { event.target.value = ''; return; }
    state = imported; editingSession = editingEvidence = editingExpense = null;
    storageBlocked = false; document.querySelector('#storage-alert').hidden = true; persist(); render(); notice('Backup restored.');
  } catch (error) { notice(error instanceof SyntaxError ? 'This file is not valid JSON. Existing progress is unchanged.' : error.message, true); event.target.value = ''; }
});
render();
