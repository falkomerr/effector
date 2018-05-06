//@flow

import {addToArray} from './util'
import {CHANGED} from './status'
import {detach} from './detach'
import {REACTOR} from '../kind/case/derive'

export class Reactor {
 _governor: * = null
 _parent: *
 react: *
 _active = false
 _reacting = false
 /*::;+*/ kind = REACTOR
 constructor(parent: *, react: *) {
  this._parent = parent
  this.react = react
 }
 start() {
  this._active = true

  addToArray(this._parent._activeChildren, this)

  this._parent.get()
 }

 _force(nextValue: *) {
  this._reacting = true
  try {
   this.react(nextValue)
  } finally {
   this._reacting = false
  }
 }

 force() {
  this._force(this._parent.get())
 }

 stop() {
  detach(this._parent, this)
  this._active = false
 }

 _maybeReact() {
  if (this._reacting || !this._active) return
  if (this._governor !== null) {
   this._governor._maybeReact()
  }
  // maybe the reactor was stopped by the parent
  if (!this._active) return
  const nextValue = this._parent.get()
  if (this._parent._state === CHANGED) {
   this._force(nextValue)
  }
 }
}
