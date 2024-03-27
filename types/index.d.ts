declare module 'node-wifi-scanner' {
    type Callback<T> = (error: Error | null, result: T | null) => void;

    interface WifiNetwork {
        ssid: string;
        mac: string;
        channel: number;
        rssi: number;
    }

    interface Scanner {
        cmdLine: string;
        parseOutput(output: string, callback: Callback<WifiNetwork[]>): void;
    }

    interface Tool {
        detector: string;
    }

    const airport: Tool;
    const iwlist: Tool;
    const netsh: Tool;

    /**
     * Initialize the scanner tools
     * @param callback Callback function
     */
    function initTools(callback: Callback<Scanner>): void;

    /**
     * Scan the networks
     * @param callback Callback function
     */
    function scanNetworks(callback: Callback<WifiNetwork[]>): void;

    /**
     * Scan for WiFi networks
     * @param callback Callback function
     */
    function scan(callback: Callback<WifiNetwork[]>): void;
}
