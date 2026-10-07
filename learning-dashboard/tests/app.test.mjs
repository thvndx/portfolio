import test from 'node:test';
import assert from 'node:assert/strict';
import { STORAGE_KEY, newState, dateToday } from '../core.mjs';

// Isolated DOM/storage adapter: exercises the real app entrypoint and event handlers
// without touching the user's browser profile or adding a test dependency.
async function harness({ saved = null, storageFails = false } = {}) {
  const events = {}, nodes = new Map();
  const node = key => {
    if (!nodes.has(key)) nodes.set(key, {textContent:'',innerHTML:'',hidden:true,classList:{toggle(){}},querySelector(){return null;},focus(){},addEventListener(type,fn){events[`content:${type}`]=fn;}});
    return nodes.get(key);
  };
  let stored = saved, confirmed = true;
  globalThis.document = {querySelector: node,querySelectorAll:()=>[],addEventListener:(type,fn)=>events[type]=fn};
  globalThis.window = {addEventListener:(type,fn)=>events[`window:${type}`]=fn};
  globalThis.location = {hash:'#today'};
  globalThis.localStorage = {getItem(){if(storageFails)throw new Error('blocked');return stored;},setItem(key,value){assert.equal(key,STORAGE_KEY);if(storageFails)throw new Error('blocked');stored=value;}};
  globalThis.confirm = () => confirmed;
  globalThis.FormData = class {constructor(form){this.data=Object.entries(form.data);} [Symbol.iterator](){return this.data[Symbol.iterator]();}};
  await import(`../app.mjs?test=${crypto.randomUUID()}`);
  return {node, events, saved:()=>stored, setConfirm:value=>confirmed=value, submit(type,data,id){events['content:submit']({preventDefault(){},target:{closest:()=>({dataset:{form:type,id},data})}});}, click(action,id){events.click({target:{closest:()=>({dataset:{action,id}})}});}, async import(value){const target={id:'import-backup',value:'backup.json',files:[{size:100,text:async()=>value}]};await events.change({target});}};
}

test('new dashboard saves defaults and study sessions reload without completing tasks', async () => {
  const app = await harness();
  app.submit('session',{date:dateToday(),minutes:'45',taskId:'az-concepts',reflection:'Test insight'});
  const saved = JSON.parse(app.saved());
  assert.equal(saved.sessions[0].minutes,45);
  assert.equal(saved.progress['az-concepts'].status,'planned');
  const reloaded = await harness({saved:app.saved()});
  assert.match(reloaded.node('#content').innerHTML,/Test insight/);
  assert.match(reloaded.node('#content').innerHTML,/0.8/);
});
test('storage failures show a warning and allow in-memory progress', async () => {
  const app = await harness({storageFails:true});
  assert.equal(app.node('#storage-alert').hidden,false);
  assert.match(app.node('#storage-alert').textContent,/memory/);
  app.submit('session',{date:dateToday(),minutes:'60',taskId:'az-concepts',reflection:'Memory-only study'});
  assert.match(app.node('#content').innerHTML,/Memory-only study/);
  assert.match(app.node('#notice').textContent,/memory only/);
  assert.equal(app.saved(),null);
});
test('unreadable stored data is not overwritten and invalid/canceled imports preserve it', async () => {
  const app = await harness({saved:'corrupted original'});
  app.submit('session',{date:dateToday(),minutes:'60',taskId:'az-concepts',reflection:'Keep this'});
  await app.import('{"version":2}');
  assert.equal(app.saved(),'corrupted original');
  app.setConfirm(false);
  await app.import(JSON.stringify(newState()));
  assert.equal(app.saved(),'corrupted original');
  assert.match(app.node('#content').innerHTML,/Keep this/);
});
test('evidence notes render as text and a pass cannot be recorded without verification', async () => {
  const app = await harness();
  app.submit('evidence',{date:dateToday(),type:'lab',taskId:'security-lab-01',title:'<script>alert(1)</script>',url:'',notes:'<img onerror=x>',score:''});
  location.hash='#evidence';app.events['window:hashchange']();
  assert.match(app.node('#content').innerHTML,/&lt;script&gt;/);
  assert.doesNotMatch(app.node('#content').innerHTML,/<script>alert/);
  app.submit('credential',{status:'passed',date:'',result:''},'az900');
  assert.equal(JSON.parse(app.saved()).credentials.az900.status,'preparing');
  assert.match(app.node('#notice').textContent,/verification note/);
});
test('confirmed import replaces progress and settings reject oversubscribed allowances', async () => {
  const app = await harness();
  const imported = newState();imported.settings.weeklyHours=7;
  await app.import(JSON.stringify(imported));
  assert.equal(JSON.parse(app.saved()).settings.weeklyHours,7);
  app.submit('settings',{startDate:dateToday(),weeklyHours:'5',budget:'1000',exams:'2000',labs:'300',reserve:'700',courses:'0'});
  assert.equal(JSON.parse(app.saved()).settings.weeklyHours,7);
  assert.match(app.node('#notice').textContent,/Reduce the allowances/);
});
