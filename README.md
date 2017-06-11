# rltracker-queue

A real hack-ish way if limiting the requests to the RLTracker.pro API

usage:
```javascript
const rltracker = require('rltracker-api')({
  api_key: 'yey-ive-got-a-key'
})

const queue = require('rltracker-queue')({
  rank_check: rltracker
})

queue('steam', 'illegal-function', false, (err, rank) => {

})
```
