import {Targets} from "./types";

class Util {

    // If a target is not a valid IP address exits with code 1, else does nothing.
    verifyTargets(targets: Targets) {
        let pattern = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

        for (let target of Object.keys(targets)) {
            let address = targets[target];

            if (!address) {
                console.error(`Error! Missing environment variable: ${target}`);
                process.exit(1);
            }

            if (!address.startsWith('http://')) {
                console.error(`Error! Environment variable ${target} should start with 'http://`);
                process.exit(1);
            }
        }
    }
}

export default new Util();
