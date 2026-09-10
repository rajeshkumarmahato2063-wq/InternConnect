/**
 * Calendar Utilities for InternConnect AI
 * Provides Google Calendar URL generation and .ics iCalendar file downloads.
 */

/**
 * Format a Date object to UTC ISO string formatted for iCalendar / Google Calendar (YYYYMMDDTHHMMSSZ)
 */
function formatCalendarDate(dateStr, timeStr) {
  try {
    const combined = new Date(`${dateStr} ${timeStr || '10:00 AM'}`);
    if (isNaN(combined.getTime())) {
      const now = new Date();
      now.setDate(now.getDate() + 1);
      return now.toISOString().replace(/-|:|\.\d+/g, '');
    }
    return combined.toISOString().replace(/-|:|\.\d+/g, '');
  } catch {
    const d = new Date();
    return d.toISOString().replace(/-|:|\.\d+/g, '');
  }
}

/**
 * Get end time (default 45 minutes after start)
 */
function formatCalendarEndDate(dateStr, timeStr) {
  try {
    const start = new Date(`${dateStr} ${timeStr || '10:00 AM'}`);
    if (isNaN(start.getTime())) {
      const now = new Date();
      now.setDate(now.getDate() + 1);
      now.setMinutes(now.getMinutes() + 45);
      return now.toISOString().replace(/-|:|\.\d+/g, '');
    }
    const end = new Date(start.getTime() + 45 * 60 * 1000);
    return end.toISOString().replace(/-|:|\.\d+/g, '');
  } catch {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 45);
    return d.toISOString().replace(/-|:|\.\d+/g, '');
  }
}

/**
 * Generate Google Calendar Event creation link
 */
export function getGoogleCalendarUrl({ title, companyName, interviewType, date, time, meetingLink, notes }) {
  const eventTitle = encodeURIComponent(`Interview: ${title || 'Internship Role'} at ${companyName || 'Tech Company'}`);
  const details = encodeURIComponent(
    `Video Interview (${interviewType || 'Technical Screening'})\n` +
    `Platform / Meeting Link: ${meetingLink || 'To be shared'}\n` +
    (notes ? `Notes: ${notes}\n` : '') +
    `Scheduled via InternConnect AI`
  );
  const location = encodeURIComponent(meetingLink || 'Online Video Call');
  const startIso = formatCalendarDate(date, time);
  const endIso = formatCalendarEndDate(date, time);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

/**
 * Download .ics iCalendar file for Apple Calendar, Outlook, and Google
 */
export function downloadIcsFile({ title, companyName, interviewType, date, time, meetingLink, notes }) {
  const startIso = formatCalendarDate(date, time);
  const endIso = formatCalendarEndDate(date, time);
  const summary = `Interview: ${title || 'Internship Role'} at ${companyName || 'Tech Company'}`;
  const description = `Video Interview (${interviewType || 'Technical Screening'}). Link: ${meetingLink || 'Online'}. ${notes || ''}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//InternConnect AI//Video Interview Portal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:int-${Date.now()}@internconnect.ai`,
    `DTSTAMP:${startIso}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${meetingLink || 'Online Video Call'}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Upcoming InternConnect Video Interview in 1 hour',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `interview-${companyName || 'internconnect'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
