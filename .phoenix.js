// Not needed, but lets not mess up the global anyway.
(function () {

// HELPERS

var _slice = Array.prototype.slice
function noop() {}
function Scaner(init, fn) {
  return function scaner(next) {
    return init = fn(init, next)
  }
}
function invoke(name, args) {
  if (Array.isArray(args)) args = _slice.call(arguments, 1)
  return function invoker(obj) {
    return obj[name].apply(obj, args)
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
    return fn.apply(this, argsList[argIndex])
  }
}

function logString(obj) {
  _.compose(api.alert, JSON.stringify)(obj)
  return obj
}

function windowStack() {
  return Window.visibleWindowsMostRecentFirst().filter(invoke('isNormalWindow'))
}

// ACTIONS

// toAnything(a,b). Sets the focusWindow size to screensize * a/b
function toLeft(fillCols, maxCols) {
  var win = Window.focusedWindow()
  var frame = win.frame()
  var screen = win.screen().frameWithoutDockOrMenu()
  frame.width = screen.width * (fillCols / maxCols)
  frame.x = screen.x
  return win.setFrame(frame, win.screen())
}
function toRight(fillCols, maxCols) {
  var win = Window.focusedWindow()
  var frame = win.frame()
  var screen = win.screen().frameWithoutDockOrMenu()
  frame.width = screen.width * (fillCols / maxCols)
  frame.x = screen.x + screen.width - frame.width
  return win.setFrame(frame, win.screen())
}
function toTop(fillRows, maxRows) {
  var win = Window.focusedWindow()
  var frame = win.frame()
  var screen = win.screen().frameWithoutDockOrMenu()
  frame.height = screen.height * (fillRows / maxRows)
  frame.y = screen.y
  return win.setFrame(frame, win.screen())
}
function toBottom(fillRows, maxRows) {
  var win = Window.focusedWindow()
  var frame = win.frame()
  var screen = win.screen().frameWithoutDockOrMenu()
  frame.height = screen.height * (fillRows / maxRows)
  frame.y = screen.y + screen.height - frame.height
  return win.setFrame(frame, win.screen())
}

function focusIndex(idx) {
  var wins = windowStack()
  if (idx >= wins.length) idx = wins.length - 1
  wins[idx].focusWindow()
  return true
}

// BINDS
var opts = ['ctrl', 'cmd']
var optsShift = ['ctrl', 'cmd', 'shift']

api.bind('u', opts, function () {

})

api.bind('i', opts, function () {
})


var cycleCalls

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



api.bind('h', optsShift, function () {
  var win = Window.focusedWindow()
  win.focusWindowLeft()
  return true
})
api.bind('j', optsShift, function () {
  focusIndex(1000) // Massive hack, use (index out of range) => last.
  return true
})
api.bind('k', optsShift, function () {
  focusIndex(1)
  return true
})
api.bind('l', optsShift, function () {
  var win = Window.focusedWindow()
  win.focusWindowRight()
  return true
})


})()
