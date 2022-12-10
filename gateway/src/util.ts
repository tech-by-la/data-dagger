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

    getDate() {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth()+1).toString().length < 2 ? `0${date.getMonth()+1}` : date.getMonth()+1;
        const day = date.getDate().toString().length < 2 ? `0${date.getDate()}` : date.getDay();
        const hour = date.getHours().toString().length < 2 ? `0${date.getHours()}` : date.getHours();
        const minutes = date.getMinutes().toString().length < 2 ? `0${date.getMinutes()}` : date.getMinutes();
        const seconds = date.getSeconds().toString().length < 2 ? `0${date.getSeconds()}` : date.getSeconds();
        return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}   `
    }
}

export default new Util();
