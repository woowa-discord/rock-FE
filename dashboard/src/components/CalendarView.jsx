import Calendar from 'react-calendar';
import Badge from './badge';

export default function CalendarView({ attendanceDates }) {
  return (
    <Calendar
      tileContent={({ date, view }) =>
        view === 'month' &&
        attendanceDates.includes(date.toISOString().split('T')[0]) ? (
          <Badge text="출석" />
        ) : null
      }
    />
  );
}
