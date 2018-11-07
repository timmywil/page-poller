#!/usr/bin/env node
require('isomorphic-fetch')

const argv = require('yargs')
  .usage('$0 [args]')
  .options({
    pax: {
      default: 'west',
      describe: 'PAX site to poll',
      choices: ['west', 'east', 'aus', 'south', 'unplugged']
    },
    poll: {
      default: 2000,
      describe: 'Poll interval in milliseconds',
      type: 'number'
    }
  })
  .help().argv
const diff = require('diff')
const chalk = require('chalk')
const notifier = require('node-notifier')

const url = `http://${argv.pax.toLowerCase()}.paxsite.com`
const pollTime = Math.max(argv.poll, 1000)

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
    console.log(`GET ${url}: next poll in ${pollTime}ms`)
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
        title: 'PAX Poller',
        message: 'PAX site has changed!',
        sound: true
      })
      return
    }
    setTimeout(poll, pollTime)
  })
}

poll()
