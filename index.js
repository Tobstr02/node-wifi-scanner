/**
 * @typedef {Object} WifiNetwork
 * @property {string} ssid - SSID des WLAN-Netzwerks
 * @property {string} mac - MAC-Adresse des WLAN-Netzwerks
 * @property {number} channel - Kanal des WLAN-Netzwerks
 * @property {number} rssi - Signalstärke des WLAN-Netzwerks (RSSI)
 */


/**
 * node-wifi-scanner
 * Created by kc on 04.04.16.
 */

const exec    = require('child_process').exec;
const async   = require('async');
const _       = require('lodash');
// The tools
const airport = require('./lib/airport');
const iwlist  = require('./lib/iwlist');
const netsh   = require('./lib/netsh');

let scanner;

// Initializing the tools
function initTools(callback) {

  // When a command is not found, an error is issued and async would finish. Therefore we pack
  // the error into the result and check it later on.
  async.parallel([
      function (cb) {
        exec(airport.detector, function (err) {
            cb(null, {err: err, scanner: airport}
            )
          }
        );
      },
      function (cb) {
        exec(iwlist.detector, function (err) {
            cb(null, {err: err, scanner: iwlist}
            )
          }
        );
      },
      function (cb) {
        exec(netsh.detector, function (err) {
            cb(null, {err: err, scanner: netsh}
            )
          }
        );
      }
    ],
    function (err, results) {
      let res = _.find(results,
        function (f) {
          return !f.err
        });

      if (res) {
        return callback(null, res.scanner);
      }
      callback(new Error('No scanner found'));
    }
  );
}

/**
 * Scan the networks with the scanner detected before
 * @param {Function|any} callback
 * @param {boolean} useSudo - Use sudo for access?
 */
function scanNetworks(callback, useSudo) {
  exec((useSudo && "sudo ") + scanner.cmdLine, function (err, stdout) {
    if (err) {
      callback(err, null);
      return;
    }
    scanner.parseOutput(stdout, callback);
  });
}

module.exports = {
  /**
 * Funktion zum Scannen von WLAN-Netzwerken
 * @param {boolean} useSudo? - Defaults to false | Should sudo be used to get the output?
 * @return {Promise<WifiNetwork[]|null>} WiFinetwork Array or null
 * @rejects Returns error on reject
 */
  scan: function (useSudo = false) {
    return new Promise( (resolve, reject) => {
      if (!scanner) {
        initTools(function (err, s) {
        if (err) {
          return reject(err);
        }
        scanner = s;
        scanNetworks(resolve, useSudo);
      });
      return;
    }
    scanNetworks(resolve, useSudo);
    } )
  }
};
