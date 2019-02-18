import React, { Component } from 'react';
import './App.css';
import BigCalendar, { stringOrDate, DateLocalizer, Components, EventWrapperProps } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'antd/dist/antd.css';
import { Popover } from 'antd';

type AppProps = {};

type AppState = { events: any[]; };

export default class App extends Component<AppProps, AppState> {
  public readonly state: AppState = { events: [] };

  private readonly localizer: DateLocalizer = BigCalendar.momentLocalizer(moment);

  private readonly components: Components = {
    eventWrapper: EventWrapper,
  };

  public render() {
    return (
      <div className="App">
        <BigCalendar
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
    this.setState(state => ({ events: [ ...state.events, { start: slotInfo.start, end: slotInfo.end } ] }));
  };
}

class EventWrapper extends React.Component<EventWrapperProps, never> {
  public render() {
    return (
      <Popover content={JSON.stringify(this.props.event)}>
        {this.props.children}
      </Popover>
    );
  }
}
