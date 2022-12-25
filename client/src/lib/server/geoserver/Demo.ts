import type {Feature} from "$lib/server/util/interfaces";
import geojson from "$lib/assets/geojson/1KM_tiles.json";

interface IDemo {
    generateDemo(size: number): Feature[];
}

class Demo implements IDemo {

    private readonly demofile = geojson as { features: Feature[] };
    private readonly features = this.demofile.features;

    // TODO: Update this logic to return tiles in a square instead of a row
    generateDemo(size = 30): Feature[] {
        const max = size;
        const total = this.features.length
        const demoLength = total < max ? total : max;

        const startIndex = total < max ? 0 : Math.round(Math.random() * (total-demoLength))

        return this.features.slice(startIndex, startIndex+demoLength);
    }
}

export default new Demo();
