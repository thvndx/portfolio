import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { addDays } from '../core.mjs';
import { schedule, calendarDefaults } from './schedule.mjs';

const escapeText = text => text.replaceAll('\\','\\\\').replaceAll('\n','\\n').replaceAll(';','\\;').replaceAll(',','\\,');
function fold(line) {
  const parts = []; let part = '';
  for (const char of line) {
    if (Buffer.byteLength(part+char,'utf8') > 75) { parts.push(part); part=' '; }
    part+=char;
  }
  parts.push(part); return parts.join('\r\n');
}
const timestamp = date => date.toISOString().replaceAll('-','').replaceAll(':','').replace(/\.\d{3}Z$/,'Z');
export function events() {
  return schedule.map(row => {
    const date = addDays(calendarDefaults.startDate,row.day-1);
    const start = new Date(`${date}T${calendarDefaults.startTime}:00+02:00`);
    const end = new Date(start.getTime()+row.minutes*60000);
    return {...row,date,start:start.toISOString(),end:end.toISOString(),uid:`learning-desk-az900-${date}@learning-desk.invalid`,description:`Day ${row.day} of 28 | ${row.minutes} minutes | 09:00 Johannesburg time\n\n${row.goal}\n\nFree resource: ${row.resource}\nRelated roadmap task: ${row.taskId}\n\nFinish by logging your actual study minutes and one insight in Learning desk: http://localhost:4317/\nThe local dashboard link works only on the computer where its server is running.\n\nStay within five hours weekly. A missed session carries forward; do not double tomorrow’s workload. Paid exams are budget-dependent. No purchase is needed to read the learning material.`};
  });
}
export function calendar(stamp = new Date()) {
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Learning Desk//AZ900 Daily Learning//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Learning desk - Azure foundation','X-WR-TIMEZONE:Africa/Johannesburg'];
  for (const event of events()) {
    lines.push('BEGIN:VEVENT',`UID:${event.uid}`,`DTSTAMP:${timestamp(stamp)}`,`DTSTART:${timestamp(new Date(event.start))}`,`DTEND:${timestamp(new Date(event.end))}`,`SUMMARY:${escapeText(`Learning desk: ${event.title}`)}`,`DESCRIPTION:${escapeText(event.description)}`,`URL:${event.resource}`,'STATUS:CONFIRMED','TRANSP:OPAQUE','BEGIN:VALARM',`TRIGGER:-PT${calendarDefaults.reminderMinutes}M`,'ACTION:DISPLAY',`DESCRIPTION:${escapeText(`Learning starts in 10 minutes: ${event.title}`)}`,'END:VALARM','END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n')+'\r\n';
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const directory = new URL('./',import.meta.url);
  await writeFile(new URL('learning-reminders-2026-10-12.ics',directory),calendar());
  await writeFile(new URL('learning-reminders-2026-10-12.json',directory),JSON.stringify({defaults:calendarDefaults,events:events()},null,2)+'\n');
  const rows = events().map(e=>`| ${e.date} | 09:00 | ${e.minutes} min | [${e.title}](${e.resource}) |`);
  const descriptions = events().map(e=>`### ${e.date} · ${e.title}\n\n${e.goal}\n\nResource: [Open learning material](${e.resource})\n\nRoadmap task: ${e.taskId}\n`);
  await writeFile(new URL('learning-reminders-2026-10-12.md',directory),`# Daily learning sessions: 12 October–8 November 2026\n\nDaily at 09:00 Africa/Johannesburg. Monday–Saturday: 45 minutes; Sunday: 30 minutes. Five hours weekly, 20 hours total. Calendar notifications: 10 minutes before each session. Topics checked against Microsoft Learn on 7 October 2026.\n\n## Schedule\n\n| Date | Start | Duration | Topic and free resource |\n|---|---|---|---|\n${rows.join('\n')}\n\n## Session goals\n\n${descriptions.join('\n')}\n\n## Calendar delivery\n\nThe ICS file contains 28 individual events with source links, goals and display alarms. A file on disk is not evidence that events were added to Google Calendar. If importing manually, use a dedicated calendar and check its notification settings afterward: calendar providers may ignore imported alarms. Do not both import and create the same events through a connector; that would create duplicates.\n`);
  console.log(`Prepared ${events().length} events; ${schedule.reduce((total,row)=>total+row.minutes,0)/60} hours. Calendar files saved beside this script.`);
}
