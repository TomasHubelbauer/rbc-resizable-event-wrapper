import React, { Component } from 'react';
import './App.css';
import BigCalendar, { stringOrDate, DateLocalizer, Components, BigCalendarProps, EventProps } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'antd/dist/antd.css';
import { Popover } from 'antd';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

// https://stackoverflow.com/q/54762077/2715716

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

type AppProps = {};

type AppState = { events: any[]; };

export default class App extends Component<AppProps, AppState> {
  public readonly state: AppState = { events: [] };

  private readonly localizer: DateLocalizer = BigCalendar.momentLocalizer(moment);

  private readonly components: Components = {
    event: EventComponent as any,
  };

  public render() {
    return (
      <div className="App">
        <DragAndDropCalendar
          localizer={this.localizer}
          events={this.state.events}
          defaultView="week"
          onSelectSlot={this.onCalendarSelectSlot}
          selectable
          components={this.components}
          onEventDrop={this.onCalendarEventDrop}
          onEventResize={this.onCalendarEventResize}
        />
      </div>
    );
  }

  private readonly onCalendarSelectSlot = (slotInfo: { start: stringOrDate, end: stringOrDate, slots: Date[] | string[], action: 'select' | 'click' | 'doubleClick' }) => {
    this.setState(state => ({ events: [...state.events, { start: slotInfo.start, end: slotInfo.end }] }));
  };

  private readonly onCalendarEventDrop = (args: { event: any, start: stringOrDate, end: stringOrDate, allDay: boolean }) => {
    this.setState(state => ({ events: [...state.events.map(e => e === args.event ? { ...e, start: args.start, end: args.end } : e)] }));
  };

  private readonly onCalendarEventResize = (args: { event: any, start: stringOrDate, end: stringOrDate, allDay: boolean }) => {
    this.setState(state => ({ events: [...state.events.map(e => e === args.event ? { ...e, start: args.start, end: args.end } : e)] }));
  };
}

class EventComponent extends React.Component<EventProps<{ start: Date, end: Date }>, never> {
  public render() {
    return (
      <Popover content={JSON.stringify(this.props.event)} placement="right">
        <div style={{ height: '100%' }} />
      </Popover>
    );
  }
}
