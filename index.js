const h = require('mutant/html-element')
const Value = require('mutant/value')
const multicb = require('multicb')

module.exports = function list(sourceDown, sourceUp, render) {
  let el, ul

  const marginBottom = Value()
  const marginTop = Value()
  
  if (sourceDown) marginBottom.set('5em')
  if (sourceUp) marginTop.set('5em')

  let filling = false
  function fill() {
    if (filling) return
    filling = true
    _fill( err =>{
      if (err) console.error(err)
      filling = false
    })
  }

  function _fill(cb) {
    const elbb = el.getBoundingClientRect()

    const done = multicb()
    fillAbove(done())
    fillBelow(done())
    done(cb)

    function space() {
      const ulbb = ul.getBoundingClientRect()
      const below = elbb.bottom - ulbb.bottom
      const above = ulbb.top - elbb.top
      //console.log('space below', below, 'above', above)
      return {below, above}
    }
    
    function fillBelow(cb) {
      if (!sourceDown) return cb(null)
      if (space().below <= 0) return cb(null)
      sourceDown(null, (err, data) => {
        if (err == true) {
          marginBottom.set(null)
          return cb(null)
        }
        if (err) return cb(err)
        let lis = render(data)
        if (!Array.isArray(lis)) lis = [lis]
        lis.forEach( li=>ul.appendChild(li))
        fillBelow(cb)
      })
    }

    function fillAbove(cb) {
      if (!sourceUp) return cb(null)
      if (space().above <= 0) return cb(null)
      sourceUp(null, (err, data) => {
        if (err == true) {
          marginTop.set(null)
          return cb(null)
        }
        if (err) return cb(err)
        const li = render(data)
        ul.insertBefore(li, ul.firstElementChild)
        const libb = li.getBoundingClientRect()
        el.scrollTop += libb.height
        fillAbove(cb)
      })
    }

  }

  el =  h('.tre-endless-list', {
    hooks: [el=>{
      fill()
      return el=>{}
    }],
    style: {
      'overflow-y': 'scroll'
    },
    'ev-scroll': e => {
      fill()
    }
  }, [
    ul = h('ul', {
      style: {
        'margin-bottom': marginBottom,
        'margin-top': marginTop
      }
    })
  ])
  return el
}

