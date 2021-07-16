import React from 'react'
import yallist from 'yallist'

var myList = yallist.create([1, 2, 3])

myList.push('foo')
myList.unshift('bar')
// of course pop() and shift() are there, too
console.log(myList.toArray()) // ['bar', 1, 2, 3, 'foo']
myList.forEach(function (k) {
  // walk the list head to tail
})
myList.forEachReverse(function (k, index, list) {
  // walk the list tail to head
})
var myDoubledList = myList.map(function (k) {
  return k + k
})
// now myDoubledList contains ['barbar', 2, 4, 6, 'foofoo']
// mapReverse is also a thing
var myDoubledListReverse = myList.mapReverse(function (k) {
  return k + k
}) // ['foofoo', 6, 4, 2, 'barbar']

var reduced = myList.reduce(function (set, entry) {
  set += entry
  return set
}, 'start')
console.log(reduced) // 'startfoo123bar'

export default function yallistComponent() {
  return (
    <div>
      This is a yallist component. It was created in order to handle the craco build error on Vercel that required yallist to be installed.
    </div>
  )
}
