/**
 * @typedef {Object} WifiNetwork
 * @property {string} ssid - SSID of the wifi
 * @property {string} mac - MAC-Address of the wifi
 * @property {number} channel - Channel of the wifi
 * @property {number} rssi - Signalstrength of Wifi-Network (RSSI)
 * @property {boolean} encrypted - Encrypted
 */


/**
 * node-wifi-scanner
 * Created by kc on 04.04.16. - Forked and updated by Tobias Hopp 27.03.2024
 */

const {exec, spawn}    = require('child_process');

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
  const cmd = scanner.cmdLine.split(" ");
  const args = cmd.slice(1);
  const child = spawn((useSudo ? "sudo " : "" ) + cmd[0], args, { stdio: ['ignore', 'pipe', 'pipe'], detached: true });

  child.on("error", (err) => callback(err, null) );

  let stdoutData = '';
  child.stdout.on('data', (data) => {
    stdoutData += data;
  });

  child.on('close', (code) => {
    if (code === 0) {
      // Prozess erfolgreich beendet, Ausgabe verarbeiten
      scanner.parseOutput(stdoutData, callback);
    } else {
      // Prozess mit Fehler beendet
      callback(new Error(`Exited with code ${code}`), null);
    }
  });

  /*exec((useSudo ? "sudo ":"") + scanner.cmdLine, { shell: true }, function (err, stdout) {
    if (err) {
      callback(err, null);
      return;
    }
    scanner.parseOutput(stdout, callback);
  });*/

}

module.exports = {
  /**
 * Scan for wifi networks
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
	scanNetworks((err, result) => {
        	if(err)
                	return reject(err);
		if(!result)
			result = [];
        	resolve(result);
        }, useSudo);

      });
      return;
    }
    scanNetworks((err, result) => {
	if(err)
		return reject(err);
	if(!result)
		result = [];
	resolve(result);
	}, useSudo);
    } );
  }
};
