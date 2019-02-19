import 'react-big-calendar';

declare module 'react-big-calendar/lib/addons/dragAndDrop' {
    function Test(calendar: BigCalendar): BigCalendar;

    export = Test;
};
