// Not needed, but lets not mess up the global anyway.
(function () {

// HELPERS

// Sometimes it's easier to work with edges instead of point + size
// {x, y, height, width} => {top, bottom, left right}
function frameToRect(frame) {
  return {
    left: frame.x,
    right: frame.x + frame.width,
    top: frame.y,
    bottom: frame.y + frame.height
  }
}

// {top, bottom, left right} => {x, y, height, width}
function rectToFrame(rect) {
  return {
    x: rect.left,
    y: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  }
}

// Cycle args for the function, if called repeatedly and uninterrupted.
// Calling a cycle resets all other cycles.
// cycleCalls(fn, [ [args1...] [args2...], ... ])
var lastCycle = null
function cycleCalls(fn, argsList) {
  var argIndex = 0, identifier = {}
  return function () {
    if (lastCycle !== identifier || ++argIndex >= argsList.length) argIndex = 0
    lastCycle = identifier
    fn.apply(this, argsList[argIndex])
  }
}


// ACTIONS

// toAnything(a,b). Sets the focusWindow size to screensize * a/b
function toLeft(fillCols, maxCols) {
  var win = Window.focusedWindow()
  var frame = win.frame()
  var screen = win.screen().frameWithoutDockOrMenu()
  frame.width = screen.width * (fillCols / maxCols)
  frame.x = screen.x
  win.setFrame(frame, win.screen())
}

function toRight(fillCols, maxCols) {
  var win = Window.focusedWindow()
  var frame = win.frame()
  var screen = win.screen().frameWithoutDockOrMenu()
  frame.width = screen.width * (fillCols / maxCols)
  frame.x = screen.x + screen.width - frame.width
  win.setFrame(frame, win.screen())
}

function toTop(fillRows, maxRows) {
  var win = Window.focusedWindow()
  var frame = win.frame()
  var screen = win.screen().frameWithoutDockOrMenu()
  frame.height = screen.height * (fillRows / maxRows)
  frame.y = screen.y
  win.setFrame(frame, win.screen())
}

function toBottom(fillRows, maxRows) {
  var win = Window.focusedWindow()
  var frame = win.frame()
  var screen = win.screen().frameWithoutDockOrMenu()
  frame.height = screen.height * (fillRows / maxRows)
  frame.y = screen.y + screen.height - frame.height
  win.setFrame(frame, win.screen())
}


// BINDS
var opts = ['ctrl', 'cmd']
var optsShift = ['ctrl', 'cmd', 'shift']
api.bind('h', opts, cycleCalls(
  toLeft,
  [
    [1,2],
    [1,3],
    [2,3],
    [1,1]
  ]
))
api.bind('l', opts, cycleCalls(
  toRight,
  [
    [1,2],
    [1,3],
    [2,3],
    [1,1]
  ]
))
api.bind('k', opts, cycleCalls(
  toTop,
  [
    [1,2],
    [1,1],
    [2,3]
  ]
))
api.bind('j', opts, cycleCalls(
  toBottom,
  [
    [1,2],
    [1,1],
    [1,3]
  ]
))

})()