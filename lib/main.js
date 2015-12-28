import promise from "stackp/promisejs/promise.js"
import hg from "mercury"
let h = hg.h

let ajaxInstruments = () => {
  return promise.get(
    "http://localhost:3000/instruments.json"
  )
}

let handleAJAX = (state, error, data) => {
  let parsed = JSON.parse(data)
  state.set(parsed)
}

let App = () => {
  let state = hg.state({
    instruments: hg.array([]),
    channels: {}
  })

  setInterval(() => {
    ajaxInstruments()
      .then(handleAJAX.bind(null, state.instruments))
  }, 1000)
  return state
}

App.inStock = (instrument) => {
  return instrument.amount - instrument.reserved
}

App.tableHeader = (...args) => {
  return [
    h("tr", args.map((header) => {
      return h("th", header)
    }))
  ]
}

App.render = (state) => {
  return h("div.container", [
    h("table",
      App.tableHeader("name", "amount", "price")
        .concat(
      state.instruments.map((instrument) => {
        return h("tr", [
          h("td", instrument.name),
          h("td", String(App.inStock(instrument))),
          h("td", instrument.price)
        ]
      )
    })))
  ])
}

hg.app(document.body, App(), App.render)
