require('isomorphic-fetch')
const diff = require('diff')
const chalk = require('chalk')
const notifier = require('node-notifier')

const url = 'http://east.paxsite.com'
const POLL_TIME = 2000

function getPage() {
  return fetch(url).then((response) => response.text())
}

function removeCsrf(text) {
  return text.replace(/name="csrf_token" value="[\w\d]+"/, 'name="csrf_token"')
}

function removeCountdown(text) {
  return text.replace(/<p id="countdown">[\w\W]+<\/p>/, '')
}

function format(text) {
  return removeCountdown(removeCsrf(text))
}

let data

function poll() {
  return getPage().then((text) => {
    console.log(`GET ${url}`)
    text = format(text)
    if (!data) {
      data = text
    } else if (data !== text) {
      const parts = diff.diffChars(data, text)
      parts.forEach((part) => {
        console.log(chalk[part.added ? 'green' : 'red'](part.value))
      })
      console.log()
      notifier.notify({
        title: 'PAX',
        message: 'PAX site has changed!'
      })
      return
    }
    setTimeout(poll, POLL_TIME)
  })
}

poll()
