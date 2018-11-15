#!/usr/bin/env node
require('isomorphic-fetch')
const URL = require('url').URL

const argv = require('yargs')
  .usage('$0 [args]')
  .options({
    pax: {
      describe: 'PAX site to poll',
      conflicts: 'url',
      choices: ['west', 'east', 'aus', 'south', 'unplugged']
    },
    poll: {
      alias: 'p',
      default: 5000,
      describe: 'Poll interval in milliseconds. Minimum is 500.',
      type: 'number'
    },
    url: {
      alias: 'u',
      describe: 'Override the polled URL',
      conflicts: 'pax',
      type: 'string'
    }
  })
  .help().argv
const diff = require('diff')
const chalk = require('chalk')
const notifier = require('node-notifier')
const unparsedUrl = argv.url || `http://${argv.pax.toLowerCase()}.paxsite.com`
const url = new URL(unparsedUrl)

const pollTime = Math.max(argv.poll, 500)

function getPage() {
  // This is the only way to cache bust with node
  url.search = url.search ? `${url.search}&${Date.now()}` : Date.now()
  return fetch(url.href).then((response) => response.text())
}

function removeCsrf(text) {
  return text.replace(/name=["']csrf_token['"] value=['"][\w\d]+['"]/g, 'name="csrf_token"')
}

function removeCountdown(text) {
  return text.replace(/<p id="countdown">[\w\W]+<\/p>/, '')
}

function removeScripts(text) {
  return text.replace(/<script[\w\W]*?<\/script>/g, '')
}

function format(text) {
  return removeScripts(removeCountdown(removeCsrf(text)))
}

let data

function poll() {
  return getPage().then((text) => {
    console.log(`GET ${unparsedUrl}: next poll in ${pollTime}ms`)
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
        title: 'Page Poller',
        message: 'URL content has changed!',
        sound: true
      })
      return
    }

    setTimeout(poll, pollTime)
  })
}

poll()
