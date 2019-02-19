import React, { Component } from 'react';
import './App.css';
import BigCalendar, { stringOrDate, DateLocalizer, Components, EventWrapperProps } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'antd/dist/antd.css';
import { Popover } from 'antd';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

// https://stackoverflow.com/q/54762077/2715716
// import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

const withDragAndDrop = require('react-big-calendar/lib/addons/dragAndDrop');
const DragAndDropCalendar: typeof BigCalendar = true ? withDragAndDrop(BigCalendar) : BigCalendar;

type AppProps = {};

type AppState = { events: any[]; };

export default class App extends Component<AppProps, AppState> {
  public readonly state: AppState = { events: [] };

  private readonly localizer: DateLocalizer = BigCalendar.momentLocalizer(moment);

  private readonly components: Components = {
    // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/33188
    event: EventComponent as any,
    //eventWrapper: EventWrapperComponent,
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
        />
      </div>
    );
  }

  private readonly onCalendarSelectSlot = (slotInfo: { start: stringOrDate, end: stringOrDate, slots: Date[] | string[], action: 'select' | 'click' | 'doubleClick' }) => {
    this.setState(state => ({ events: [...state.events, { start: slotInfo.start, end: slotInfo.end }] }));
  };
}

class EventWrapperComponent extends React.Component<EventWrapperProps<{ start: Date, end: Date }>, never> {
  public render() {
    return (
      <Popover content={JSON.stringify(this.props.event)}>
        <div className="TEST">
          {this.props.children}
        </div>
      </Popover>
    );
  }
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/33188
class EventComponent extends React.Component<EventWrapperProps<{ start: Date, end: Date }>, never> {
  public render() {
    return (
      <Popover content={JSON.stringify(this.props)}>
        <div style={{ height: '100%' }} />
      </Popover>
    );
  }
}
