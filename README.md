# page-poller

A simple Node.js script that polls a website and alerts when there's a change. This is easier on the CPU than a page refresher because it doesn't have to render the page. The only limitation is that it does not detect changes in content rendered by JavaScript after page load.

This can be used for any website by setting the `--url` option. It strips csrf tokens and all script tags sometimes contain tokens that are supposed to change on every refresh, but I haven't anticipated everything like this. I may add functionality to select certain parts of a page to check for changes, but for now it just checks whole pages.

I originally built this for myself to poll PAX sites to alert me when badges were available, and the `--pax` option is still there for that purpose.

When there's a change, the script will stop polling, print a diff to the command line, send a desktop notification, and immediately open the page in your default browser.

![Notification screenshot](https://raw.githubusercontent.com/timmywil/page-poller/master/page-poller.png)

## Requirements

Requires [Node.js](https://nodejs.org/en/download/) to run.

## Installation

```bash
$ git clone git@github.com:timmywil/page-poller.git
```

## Usage

```bash
$ cd page-poller
$ ./page-poller.js -u https://timmywil.com # Leave open in a terminal and let it run. Ctrl-c to quit.
$ ./page-poller.js --pax east
```

#### Options

```
  --url, -u   URL to poll                               [string]
  --poll, -p  Poll interval in milliseconds             [number]       [default: 5000]
  --pax       PAX site to poll        [choices: "west", "east", "aus", "south", "unplugged"]
  --version   Show version number                       [boolean]
  --help      Show help
```
