# pax-poller
A simple Node.js script that polls a PAX site and alerts when there's a change.

When there's a change, the script will stop polling, print a diff to the command line, and send a desktop notification.

![Notification screenshot](https://raw.githubusercontent.com/timmywil/pax-poller/master/pax-poller.png)

## Requirements

Requires [Node.js](https://nodejs.org/en/download/) to run.

## Installation

```bash
$ git clone git@github.com:timmywil/pax-poller.git
```

## Usage

```bash
$ cd pax-poller
$ ./index.js
```

#### Options

```
  --version  Show version number                                       [boolean]
  --pax      PAX site to poll
        [choices: "west", "east", "aus", "south", "unplugged"] [default: "west"]
  --poll     Poll interval in milliseconds              [number] [default: 2000]
  --help     Show help                                                 [boolean]
```
