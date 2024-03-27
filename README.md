# Fork of node-wifi-scanner

This fork is used to add the ability to scan as sudo under linux.
Why the fork?

- Add ability to execute command with prefix 'sudo' to get iwlist working on linux!
- Uses promise instead of callback in module exports to make it easier and prevent callback hells.
- Add `encrypted:boolean` to the output, to determine if the network is encrypted (Currently only works under iwlist/linux, otherwise just returns false)


To use sudo, just pass `true` to the scan method and it will use sudo.
For ex.
```js
const wifiScan = require("node-wifi-scanner");
let result = await wifiScan.scan(true);
```

Beforehand you should add the iwlist scan command to the sudoers file.
`%mygroup ALL = (root) NOPASSWD: iwlist wlanX scan` [src](https://stackoverflow.com/questions/53710368/how-do-i-add-typescript-types-to-a-javascript-module-without-switching-to-typesc)


### Installation
`yarn add git+https://github.com/Tobstr02/node-wifi-scanner.git`
or `npm install git+https://github.com/Tobstr02/node-wifi-scanner.git`


### Type definitions
I also tried to add type definitions (see /types/index.d.ts), but as far as i know i did it wrong haha.
Since this is my first ever module (-fork) i don't really know how to do it. - Let me know in the issues tab or create a pull request :)
But i added jsdoc to the functions to add the ability to make the coding process a bit cleaner.


<br>
<i>Fork from: [Node-Wifi-Scanner Github](https://github.com/ancasicolica/node-wifi-scanner/)</i>


<br><br>
----
# Node-Wifi-Scanner


[![Build Status](https://travis-ci.org/ancasicolica/node-wifi-scanner.svg?branch=master)](https://travis-ci.org/ancasicolica/node-wifi-scanner)
[![npm](https://img.shields.io/npm/v/node-wifi-scanner.svg)]()
[![npm](https://img.shields.io/npm/dt/node-wifi-scanner.svg)](https://www.npmjs.com/package/node-wifi-scanner)

This module for node.js scans available wifi networks. The main purpose was to enhance my node.js based
[ZigBee Site Survey Tool](http://ancasicolica.github.io/ZigBeeSiteSurvey/) with WiFi coexistence charts. This tool
claims to be compatible with current versions of Mac OS-X, Windows and Linux so I'll fix bugs as fast as possible.
Feature extensions on the other hand are not planned.

The module was inspired from Maurice Sways "[node-wifiscanner](https://github.com/mauricesvay/node-wifiscanner)". I didn't use node-wifiscanner because I
had to handle much more complex network environments and also wanted to be independent of the operating
system language. The adaptions needed would have been too comprehensive for a pull request so I decided to write an own module.

## Operating Systems

It was tested with the following operating systems:
* Mac OS-X [Not tested by fork author]
* Windows 10 [Not tested by fork author]
* Ubuntu 14.04 [Tested by fork author]
* Raspbian "Jessie" [Tested by fork author]

## Installation

    yarn add git+https://git.gaminggeneration.de/tobiash/node-wifi-scanner

## Usage

The tool returns an array with objects, each object representing a network with the following properties:

* channel: WiFi channel
* ssid: SSID of the network (if available)
* mac: MAC Address of the network access point (if available, otherwise empty string)
* rssi: signal strength
* encrypted: boolean - Is network encrypted?

In contrary to other wifi scanners no information about security is returned. This is due to the very different implementation
of the command line tools which do not allow a flawless detection.

## Technical background

The module uses command line tools for gathering the network information:

* airport on Mac OS-X: `airport -s`
* netsh on Windows: `netsh wlan show networks mode=Bssid`
* iwlist on Linux: `iwlist scan`


Unfortunately, Mac OS-X and Windows use the system language for the output which requires a quite
generic way of parsing the data. If you experience any troubles, please create a GitHub issue and supply
the output of the tool.

## Limits of the tool

There is no such thing as perfect software  and this is all the more true when the tools used require different 
access rights depending on
the operating system. Please note the following restrictions 
before using this tool in a productive system.

**Linux**: iwlist does only return all found networks if run as sudo! Otherwise you'll
get only the network you're connected to. <i>That's where my fork comes in!!</i>

**Windows**: there are some network cards which do not 
return the MAC address and other parameters of the found networks. In this case
the "found" networks are ignored as there is no valuable data. If you have this effect
on your system, please provide as many information about your system (PC manufacturer, network
card, OS,...) as available. Thanks

## Licence

The MIT License (MIT)

Copyright (c) 2016-2024 Christian Kuster, Tobias Hopp

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

