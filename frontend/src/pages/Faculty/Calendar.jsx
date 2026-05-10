import AcademicCalendar from '../../components/Calendar/AcademicCalendar';

const Calendar = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div>
        <h1 className="text-3xl font-black text-surface-900 tracking-tight">Institutional Calendar</h1>
        <p className="text-surface-500 mt-2 font-medium">Review academic cycles, exam periods, and blocked dates.</p>
      </div>

      <AcademicCalendar />
    </div>
  );
};

export default Calendar;
