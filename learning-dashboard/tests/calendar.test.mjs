import test from 'node:test';
import assert from 'node:assert/strict';
import { calendar, events } from '../calendar/generate.mjs';

test('28 daily sessions start Monday 12 October at 09:00 SAST and end 8 November', () => {
  const rows = events();
  assert.equal(rows.length,28);
  assert.equal(rows[0].date,'2026-10-12');
  assert.equal(new Date(rows[0].start).getUTCDay(),1);
  assert.equal(rows.at(-1).date,'2026-11-08');
  assert.equal(new Set(rows.map(row=>row.uid)).size,28);
  assert.ok(rows.every(row=>row.start.endsWith('T07:00:00.000Z')));
  assert.equal(rows.reduce((minutes,row)=>minutes+row.minutes,0),1200);
  for (let week=0;week<4;week++) assert.equal(rows.slice(week*7,week*7+7).reduce((minutes,row)=>minutes+row.minutes,0),300);
});
test('calendar has UTC times, 28 ten-minute alarms, CRLF and valid UTF-8 line folding', () => {
  const text = calendar(new Date('2026-10-07T12:00:00Z'));
  assert.equal((text.match(/BEGIN:VEVENT/g)||[]).length,28);
  assert.equal((text.match(/TRIGGER:-PT10M/g)||[]).length,28);
  assert.match(text,/DTSTART:20261012T070000Z/);
  assert.ok(text.split('\r\n').every(line=>Buffer.byteLength(line,'utf8')<=75));
  assert.equal(text.replaceAll('\r\n','').includes('\n'),false);
  const unfolded=text.replaceAll('\r\n ','');
  assert.match(unfolded,/DESCRIPTION:Day 1 of 28/);
  assert.ok(events().every(row=>row.goal && row.resource.startsWith('https://learn.microsoft.com/') && row.taskId));
});
