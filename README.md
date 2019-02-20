# React Big Calendar Resizable + Custom `EventWrapper` Component

In this repository I explore options for getting React Big Calendar to work
together with the addon which adds handles for resizeability, but also without
breaking the support for the custom `EventWrapper` component.

**If you only care about the solution, scroll all the way down.** This document
is a stream-of-consciousness style exploration with dead ends and useless info.

This may work out of the box because in the real codebase I am using a modified
version of RBC, but in any case this exploration will be useful to lock down
the cause.

We start by creating a demo application which makes use of RCB. We'll use CRA
for ease of use and development. We also install Moment as a localizer as RBC
requires a localizer of some sort. Moment has its own types.

```powershell
create-react-app . --typescript
npm install react-big-calendar moment --save
npm install @types/react-big-calendar --save-dev
```

Next we set up the calendar as per the docs:

http://intljusticemission.github.io/react-big-calendar/examples/index.html

We do not forget to `import 'react-big-calendar/lib/css/react-big-calendar.css'`
to get the RBC styling in.

Now running `npm start` will bring us to a page showing the calendar set up
and ready to go.

Let's set up the calendar to default to the week view (`defaultView="week"`)
and hook up the event creating by listening to `onSelectSlot` and propagating
the new value to the array of `events`. We also have to make the calendar
`selectable`.

With this set up, the next step is to make use of a custom event wrapper
component through the `components` prop of the calendar.

For now we're using a pass-through `eventWrapper`:
`eventWrapper: props => <>{props.children}</>`. Next step is to display an
Ant `Popover` when hovering over the event slot. For that we need to bring
in the Ant design package.

```powershell
npm install antd --save
```

We can't forget to `import 'antd/dist/antd.css';` like we did with the RBC
styles.

At this point we have a working setup where the RBC displays the Ant popover
upon even slot hover. Ideally we'll find a way to preserve this behavior while
also supporting the DnD handles.

To add drag and drop support to the calendar (which includes resizing in it), we
will make use of the one and only addon the calendar contains -
`withDragAndDrop`.

To add it, we can follow the starter guide here:

https://github.com/arecvlohe/rbc-with-dnd-starter/blob/master/src/App.js

It's just a simple HOC which we import, wrap the original calendar in and use in
JSX like we would with the original calendar, gaining a few extra props.

After implementing this we can find that the calendar now has drag to resize
handles and supports dragging the slots across columns and rows.

What we do not see anymore though is the popover on event slot hover.

Clearly there was an idea of making the calendar extensible,
but seemingly it never came to real fruition because no other addons are
available AFAIK and the only addon that exists breaks the basic functionality of
the very calendar it is supposed to extend :-)

Let's compare the HTML generated in the working case (no DnD) and the broken
case.

**Without DnD and event wrapper propagates the children:**

```html
<div class="rbc-events-container">
  <!-- The following div is propagated through the event wrapper: props => <>{props.children}</> -->
  <div class="rbc-event" style="top: 22.9167%; height: 18.75%; left: 0%; width: 100%;">
    <div class="rbc-event-label">5:30 AM — 10:00 AM</div>
    <div class="rbc-event-content"></div>
  </div>
</div>
```

When the mouse hovers over the event slot `div` it gains an extra class
`ant-popover-open`. The popover HTML content itself is in a separate `div` at
the end of the document body and it is positioned absolutely.

**With DnD and event wrapper wraps children:**

```html
<div class="rbc-events-container">
  <!-- The following div is created in the event wrapper: props => <div>{props.children}</div> -->
  <div>
    <div class="rbc-event" style="top: 16.6667%; height: 29.1667%; left: 0%; width: 100%;">
      <div class="rbc-event-label">4:00 AM — 11:00 AM</div>
      <div class="rbc-event-content"></div>
    </div>
  </div>
</div>
```

**With DnD and event wrapper propagates the children:**

```html
<div class="rbc-events-container">
  <div class="rbc-event" style="top: 14.5833%; height: 39.5833%; left: 0%; width: 100%;">
    <div class="rbc-addons-dnd-resizable">
      <div class="rbc-addons-dnd-resize-ns-anchor">
        <div class="rbc-addons-dnd-resize-ns-icon"></div>
      </div>
      <div class="rbc-event-label">3:30 AM — 1:00 PM</div>
      <div class="rbc-event-content"></div>
      <div class="rbc-addons-dnd-resize-ns-anchor">
        <div class="rbc-addons-dnd-resize-ns-icon"></div>
      </div>
    </div>
  </div>
</div>
```

At first glance there should be no problem, but maybe the DnD addon must be
messing with the `rbc-event` container (maybe recreating it or something) in a
way which strips it of the mouse handlers the Ant popover adds - speculation.

**With DnD and the event wrapper wraps the children:**

```html
<div class="rbc-events-container">
  <!-- This div is the event wrapper one -->
  <div>
    <div class="rbc-event" style="top: 14.5833%; height: 39.5833%; left: 0%; width: 100%;">
        <div class="rbc-addons-dnd-resizable">
        <div class="rbc-addons-dnd-resize-ns-anchor">
            <div class="rbc-addons-dnd-resize-ns-icon"></div>
        </div>
        <div class="rbc-event-label">3:30 AM — 1:00 PM</div>
        <div class="rbc-event-content"></div>
        <div class="rbc-addons-dnd-resize-ns-anchor">
            <div class="rbc-addons-dnd-resize-ns-icon"></div>
        </div>
        </div>
    </div>
  </div>
</div>
```

The event wrapper `div` is there but when inspecting it using the dev tools, it
is a zero height element on top of the day column, the actual `rbc-event` div
is positioned and everything, but doesn't seem to respond to mouse events.

**With DnD and the event wrapper wraps the children and the popover wraps _that_:**

Specificall this means:

```tsx
class EventWrapper extends React.Component<EventWrapperProps, never> {
  public render() {
    return (
      <Popover content={JSON.stringify(this.props.event)}>
        <div className="eventWrapper">
          {this.props.children}
        </div>
      </Popover>
    );
  }
}
```

This works! Kinda - the popover is shown on top of the day column - because that
is where the event wrapper div ends up since the `rbc-event` one is positioned
absolutely so it sort of escapes it. We cannot get the calendar to position the
event wrapper div around the even div, but maybe the event component is a way to
go?

**Dnd and event component not event wrapper component:**

With `Event` this seems to work! It receives `event` as the event wrapper does,
but instead of placing the popover around the slot it places it within the slot
and we create a phantom `div` to fill up the height to receive mouse events
across basically the whole slot.

In my use case this is enough because I am hiding the time span using CSS
anyway so it works out that the whole slot `div` is covered so this is resolved.

Now I'll wire up the resize and drag handlers of the DnD addon and call it a
day.

- [ ] https://github.com/DefinitelyTyped/DefinitelyTyped/pull/33225
