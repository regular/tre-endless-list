const h = require('mutant/html-element')
const pull = require('pull-stream')
const styles = require('module-styles')('tre-endless-list')
const list = require('.')

styles(`
  .tre-endless-list {
    height: 100px;
    background: blue;
  }
  .tre-endless-list > ul {
    background: green;
  }
`)

document.body.appendChild(
  list(
    pull.count(100),
    pull.count(50),
    x=>h('li', x)
  )
)
