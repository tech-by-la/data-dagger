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

            if (address.startsWith('http://')) {
                address = address.slice(7)
                console.log(address);
            }

            const split = address.split(':');
            if (
                split.length < 1 ||
                split.length > 2 ||
                !split[0].match(pattern)
            ) {
                console.error(`Error! ${target} target IP is not a valid IP address`);
                process.exit(1);
            }

            if (
                split.length === 2 &&
                (
                    split[1].length > 4 ||
                    split[1].length < 2 ||
                    isNaN(Number.parseInt(split[1]))
                )
            ) {
                console.error(`Error! ${target} target port is not a valid port`);
                process.exit(1);
            }
        }
    }
}

export default new Util();
