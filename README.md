# React Big Calendar Resizable + Custom `EventWrapper` Component

In this repository I explore options for getting React Big Calendar to work
together with the addon which adds handles for resizeability, but also without
breaking the support for the custom `EventWrapper` component.

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

- [ ] Document the addition of DnD and confirm that it breaks the event wrapper
- [ ] Document approaches to making it work together
  - https://github.com/intljusticemission/react-big-calendar/blob/master/src/addons/dragAndDrop/EventWrapper.js#L143
  - Maybe instead of line 143 clone the event wrapper instance and prepend and append to its children
- [ ] Update this issue when figured out https://github.com/intljusticemission/react-big-calendar/issues/377

https://github.com/arecvlohe/rbc-with-dnd-starter/blob/master/src/App.js

