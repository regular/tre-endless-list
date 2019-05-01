tre-endless-list
---

Scroll through endless lists of data provided by two pull-streams, one for down,, one for up.

## Example

```js
const h = require('mutant/html-element')
const pull = require('pull-stream')
const list = require('tre-endless-list')

document.body.appendChild(
  list(
    pull.count(100),
    pull.count(50),
    x=>h('li', x)
  )
)
```

---
License: AGPLv3
