import AcademicCalendar from '../../components/Calendar/AcademicCalendar';

const ClubCalendar = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div>
        <h1 className="text-3xl font-black text-surface-900 tracking-tight">Academic Calendar</h1>
        <p className="text-surface-500 mt-2 font-medium">Plan your club activities around institutional schedules and blocked periods.</p>
      </div>

      <AcademicCalendar />
    </div>
  );
};

export default ClubCalendar;
