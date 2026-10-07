import test from 'node:test';
import assert from 'node:assert/strict';
import { tasks } from '../roadmap.mjs';
import { newState, dateToday, validDate, weekStart, weeklyMinutes, completion, spending, resume, planWeek, taskDate, parseBackup, validateState, nextTasks } from '../core.mjs';

test('roadmap is 225 hours, stable unique IDs, 20 labs and three write-ups', () => {
  assert.equal(tasks.reduce((sum,t) => sum+t.hours,0),225);
  assert.equal(new Set(tasks.map(t => t.id)).size,tasks.length);
  assert.equal(tasks.filter(t => t.kind === 'lab').length,20);
  assert.equal(tasks.filter(t => t.kind === 'writeup').length,3);
  assert.equal(completion(newState(),'milestone').total,13);
});
test('Johannesburg dates and Monday–Sunday boundaries ignore host timezone', () => {
  assert.equal(dateToday(new Date('2026-10-04T22:30:00Z')),'2026-10-05');
  assert.equal(weekStart('2026-10-11'),'2026-10-05');
  assert.equal(weekStart('2026-10-12'),'2026-10-12');
  assert.equal(validDate('2026-02-30'),false);
  assert.equal(validDate('2028-02-29'),true);
  const s = newState('2026-10-07');
  s.sessions = ['2026-10-04','2026-10-05','2026-10-11','2026-10-12'].map((date,i) => ({id: `s${i}`, date, minutes: 60, taskId: tasks[0].id, reflection: ''}));
  assert.equal(weeklyMinutes(s,'2026-10-07'),120);
});
test('hours and credential evidence do not complete tasks, and tasks can reopen', () => {
  const s = newState();
  s.sessions.push({id: 'study', date: s.settings.startDate, minutes: 300, taskId: tasks[0].id, reflection: ''});
  assert.equal(completion(s).done,0);
  assert.equal(s.credentials.az900.status,'preparing');
  s.progress[tasks[0].id].status = 'completed';
  assert.equal(completion(s).done,1);
  s.progress[tasks[0].id].status = 'in-progress';
  assert.equal(completion(s).done,0);
  s.progress[tasks[0].id].status = 'blocked';
  assert.ok(nextTasks(s).every(t => t.id !== tasks[0].id));
});
test('pause freezes week and resume shifts unfinished dates without erasing history', () => {
  const s = newState('2026-10-05');
  s.settings.pausedAt = '2026-10-12';
  s.progress[tasks[0].id] = {status: 'completed', dueDate: '2026-10-09', note: 'done'};
  s.progress[tasks[1].id].dueDate = '2026-10-16';
  assert.equal(planWeek(s,'2026-11-01'),2);
  resume(s,'2026-10-26');
  assert.equal(s.settings.pausedDays,14);
  assert.equal(s.settings.pausedAt,null);
  assert.equal(planWeek(s,'2026-10-26'),2);
  assert.equal(s.progress[tasks[0].id].dueDate,'2026-10-09');
  assert.equal(s.progress[tasks[0].id].note,'done');
  assert.equal(s.progress[tasks[1].id].dueDate,'2026-10-30');
  assert.equal(taskDate(s,tasks[2]),'2026-10-26');
});
test('expenses separate planned and actual spending, including category totals', () => {
  const s = newState();
  s.expenses = [{id:'cost1',title:'Exam',date:s.settings.startDate,category:'exams',planned:900,actual:800},{id:'cost2',title:'Cloud',date:s.settings.startDate,category:'labs',planned:100,actual:90}];
  assert.deepEqual(spending(s),{planned:1000,actual:890});
  assert.deepEqual(spending(s,'exams'),{planned:900,actual:800});
  assert.equal(s.settings.budget - spending(s).actual,2110);
});
test('a full backup round-trips notes, costs, credentials, reviews and dates', () => {
  const s = newState('2026-10-07');
  s.progress[tasks[0].id].note = '<script>untrusted</script>';
  s.credentials.az900 = {status:'passed',date:'2026-10-07',result:'Verified pass'};
  s.sessions.push({id:'session',date:'2026-10-07',minutes:60,taskId:tasks[0].id,reflection:'Learned shared responsibility'});
  s.evidence.push({id:'evidence',date:'2026-10-07',type:'practice',title:'Practice',url:'https://learn.microsoft.com/',notes:'Reviewed errors',taskId:tasks[0].id,score:90});
  s.reviews['2026-10-05'] = {worked:'Routine',blocked:'Time',priorities:['One','Two','Three']};
  s.expenses.push({id:'expense',date:'2026-10-07',category:'exams',title:'Quote',planned:1000,actual:0});
  s.lastBackup = '2026-10-07';
  assert.deepEqual(parseBackup(JSON.stringify(s)),s);
});
test('invalid backups are rejected without modifying existing state', () => {
  const original = newState('2026-10-07'), serialized = JSON.stringify(original);
  const corruptions = [s => s.version = 2, s => delete s.progress[tasks[0].id], s => s.settings.budget = 6000, s => s.settings.allowances.exams = 4000, s => s.credentials.az900.status = 'passed', s => s.sessions.push({id:'bad'}), s => s.evidence.push({id:'evil',date:'2026-10-07',type:'lab',title:'Bad link',url:'javascript:alert(1)',notes:'',taskId:'',score:null}), s => s.reviews['2026-10-07'] = {worked:'',blocked:'',priorities:['','','']}];
  for (const corrupt of corruptions) { const bad = structuredClone(original); corrupt(bad); assert.throws(() => validateState(bad)); }
  assert.throws(() => parseBackup('{invalid json'));
  assert.equal(JSON.stringify(original),serialized);
});
test('import ignores unknown fields and does not accept duplicate record IDs', () => {
  const s = newState(); s.extra = '<script>';
  assert.equal(validateState(s).extra,undefined);
  const session = {id:'same',date:s.settings.startDate,minutes:30,taskId:tasks[0].id,reflection:''};
  s.sessions = [session, {...session}];
  assert.throws(() => validateState(s));
});
test('rescheduled tasks move behind due work and completed default dates freeze on resume', () => {
  const s = newState('2026-10-05');
  s.progress[tasks[0].id].dueDate = '2026-12-01';
  assert.equal(nextTasks(s,'2026-10-07')[0].id,tasks[1].id);
  s.progress[tasks[1].id].status = 'completed';
  s.settings.pausedAt = '2026-10-07';
  resume(s,'2026-10-21');
  assert.equal(taskDate(s,tasks[1]),'2026-10-05');
  assert.equal(s.progress[tasks[0].id].dueDate,'2026-12-15');
});
test('money is totaled in cents without floating-point budget overflow', () => {
  const s = newState();
  s.settings.budget = .3;
  s.settings.allowances = {exams:.1,labs:.2,reserve:0,courses:0};
  assert.doesNotThrow(() => validateState(s));
  s.expenses = [{planned:.1,actual:.1},{planned:.2,actual:.2}];
  assert.deepEqual(spending(s),{planned:.3,actual:.3});
});
