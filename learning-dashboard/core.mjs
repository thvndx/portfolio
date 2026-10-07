import { tasks, certifications, phases } from './roadmap.mjs';

export const STORAGE_KEY = 'conold-learning-desk-v1';
export const STATUSES = ['planned', 'in-progress', 'completed', 'blocked'];
export const EVIDENCE_TYPES = ['lab', 'writeup', 'milestone', 'practice', 'course'];
export const CATEGORIES = ['exams', 'labs', 'reserve', 'courses'];
export const dateToday = (now = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
export function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
}
export const addDays = (date, days) => new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
export const daysBetween = (a, b) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000);
export function weekStart(date) {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return addDays(date, -(day === 0 ? 6 : day - 1));
}
export function newState(today = dateToday()) {
  return { version: 1, settings: { startDate: today, weeklyHours: 5, budget: 3000, allowances: { exams: 2000, labs: 300, reserve: 700, courses: 0 }, pausedAt: null, pausedDays: 0 }, progress: Object.fromEntries(tasks.map(t => [t.id, { status: 'planned', note: '', dueDate: null }])), sessions: [], evidence: [], reviews: {}, expenses: [], credentials: Object.fromEntries(certifications.map(c => [c.id, { status: c.id === 'az900' ? 'preparing' : ['gh200', 'sc900'].includes(c.id) ? 'deferred' : 'not-started', date: '', result: '' }])), lastBackup: null };
}
export function planWeek(state, today = dateToday()) {
  const endpoint = state.settings.pausedAt || today;
  return Math.max(1, Math.floor((daysBetween(state.settings.startDate, endpoint) - state.settings.pausedDays) / 7) + 1);
}
export function currentPhase(state, today = dateToday()) {
  const week = planWeek(state, today);
  return phases.find(p => week <= p.weeks[1]) || phases.at(-1);
}
export function taskDate(state, task) {
  return state.progress[task.id].dueDate || addDays(state.settings.startDate, (task.week - 1) * 7 + state.settings.pausedDays);
}
export function weeklyMinutes(state, date = dateToday()) {
  const start = weekStart(date), end = addDays(start, 7);
  return state.sessions.filter(s => s.date >= start && s.date < end).reduce((sum, s) => sum + s.minutes, 0);
}
export function nextTasks(state, today = dateToday()) {
  const actionable = tasks.filter(t => ['in-progress', 'planned'].includes(state.progress[t.id].status));
  return actionable.sort((a, b) => {
    const aDate = taskDate(state, a), bDate = taskDate(state, b);
    const aDue = aDate <= today, bDue = bDate <= today;
    if (aDue !== bDue) return aDue ? -1 : 1;
    if (aDue && state.progress[a.id].status !== state.progress[b.id].status) return state.progress[a.id].status === 'in-progress' ? -1 : 1;
    return aDate.localeCompare(bDate);
  }).slice(0, 3);
}
export function completion(state, kind) {
  const selected = kind ? tasks.filter(t => t.kind === kind) : tasks;
  const done = selected.filter(t => state.progress[t.id].status === 'completed').length;
  return { done, total: selected.length, percent: selected.length ? Math.round(done / selected.length * 100) : 0 };
}
export function spending(state, category) {
  const selected = category ? state.expenses.filter(e => e.category === category) : state.expenses;
  return { planned: selected.reduce((sum, e) => sum + Math.round(e.planned * 100), 0) / 100, actual: selected.reduce((sum, e) => sum + Math.round(e.actual * 100), 0) / 100 };
}
export function resume(state, today = dateToday()) {
  if (state.settings.pausedAt) {
    const shift = Math.max(0, daysBetween(state.settings.pausedAt, today));
    for (const task of tasks) {
      if (state.progress[task.id].status === 'completed' && !state.progress[task.id].dueDate) state.progress[task.id].dueDate = taskDate(state, task);
    }
    state.settings.pausedDays += shift;
    for (const progress of Object.values(state.progress)) {
      if (progress.dueDate && progress.status !== 'completed') progress.dueDate = addDays(progress.dueDate, shift);
    }
    state.settings.pausedAt = null;
  }
}

const string = (v, max = 3000) => typeof v === 'string' && v.length <= max;
const number = (v, min, max) => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;
const record = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const url = v => string(v, 2048) && (v === '' || /^https?:\/\//i.test(v) && (() => { try { return ['http:', 'https:'].includes(new URL(v).protocol); } catch { return false; } })());
const id = v => string(v, 100) && /^[a-zA-Z0-9_-]+$/.test(v);
export function validateState(value) {
  const fail = () => { throw new Error('This backup is invalid or uses an unsupported version. Your existing progress has not been replaced.'); };
  if (!record(value) || value.version !== 1 || !record(value.settings) || !record(value.progress) || !record(value.credentials) || !record(value.reviews)) fail();
  const s = value.settings;
  if (!validDate(s.startDate) || !number(s.weeklyHours, 1, 20) || !number(s.budget, 0, 5000) || !record(s.allowances) || CATEGORIES.some(c => !number(s.allowances[c], 0, 5000)) || CATEGORIES.reduce((sum, c) => sum + Math.round(s.allowances[c] * 100), 0) > Math.round(s.budget * 100) || !number(s.pausedDays, 0, 36500) || !Number.isInteger(s.pausedDays) || !(s.pausedAt === null || validDate(s.pausedAt))) fail();
  if (Object.keys(value.progress).length !== tasks.length) fail();
  for (const task of tasks) {
    const p = value.progress[task.id];
    if (!record(p) || !STATUSES.includes(p.status) || !string(p.note) || !(p.dueDate === null || validDate(p.dueDate))) fail();
  }
  for (const key of ['sessions', 'evidence', 'expenses']) {
    if (!Array.isArray(value[key]) || value[key].length > 10000 || new Set(value[key].map(x => x?.id)).size !== value[key].length) fail();
  }
  const taskIds = new Set(tasks.map(t => t.id));
  for (const row of value.sessions) if (!record(row) || !id(row.id) || !validDate(row.date) || !number(row.minutes, 1, 1440) || !Number.isInteger(row.minutes) || !taskIds.has(row.taskId) || !string(row.reflection)) fail();
  for (const row of value.evidence) if (!record(row) || !id(row.id) || !validDate(row.date) || !EVIDENCE_TYPES.includes(row.type) || !string(row.title, 200) || !row.title.trim() || !url(row.url) || !string(row.notes) || !(row.taskId === '' || taskIds.has(row.taskId)) || !(row.score === null || row.type === 'practice' && number(row.score, 0, 100))) fail();
  for (const row of value.expenses) if (!record(row) || !id(row.id) || !validDate(row.date) || !CATEGORIES.includes(row.category) || !string(row.title, 200) || !row.title.trim() || !number(row.planned, 0, 1000000) || !number(row.actual, 0, 1000000)) fail();
  for (const [key, row] of Object.entries(value.reviews)) if (!validDate(key) || weekStart(key) !== key || !record(row) || !string(row.worked) || !string(row.blocked) || !Array.isArray(row.priorities) || row.priorities.length !== 3 || row.priorities.some(v => !string(v, 300))) fail();
  if (Object.keys(value.credentials).length !== certifications.length) fail();
  for (const c of certifications) {
    const row = value.credentials[c.id];
    if (!record(row) || !['not-started', 'preparing', 'ready', 'booked', 'passed', 'deferred'].includes(row.status) || !(row.date === '' || validDate(row.date)) || !string(row.result, 1000) || row.status === 'passed' && (!row.result.trim() || !validDate(row.date)) || row.status === 'booked' && !validDate(row.date)) fail();
  }
  if (!(value.lastBackup === null || validDate(value.lastBackup))) fail();
  // Reconstruct known fields: imported JSON cannot add executable data or override object prototypes.
  const clean = newState(s.startDate);
  clean.settings = { startDate: s.startDate, weeklyHours: s.weeklyHours, budget: s.budget, allowances: Object.fromEntries(CATEGORIES.map(c => [c, s.allowances[c]])), pausedAt: s.pausedAt, pausedDays: s.pausedDays };
  clean.progress = Object.fromEntries(tasks.map(t => [t.id, { status: value.progress[t.id].status, note: value.progress[t.id].note, dueDate: value.progress[t.id].dueDate }]));
  clean.sessions = value.sessions.map(({id, date, minutes, taskId, reflection}) => ({id, date, minutes, taskId, reflection}));
  clean.evidence = value.evidence.map(({id, date, type, title, url, notes, taskId, score}) => ({id, date, type, title, url, notes, taskId, score}));
  clean.expenses = value.expenses.map(({id, date, category, title, planned, actual}) => ({id, date, category, title, planned, actual}));
  clean.reviews = Object.fromEntries(Object.entries(value.reviews).map(([key, {worked, blocked, priorities}]) => [key, {worked, blocked, priorities: [...priorities]}]));
  clean.credentials = Object.fromEntries(certifications.map(c => [c.id, { status: value.credentials[c.id].status, date: value.credentials[c.id].date, result: value.credentials[c.id].result }]));
  clean.lastBackup = value.lastBackup;
  return clean;
}
export const parseBackup = text => validateState(JSON.parse(text));
