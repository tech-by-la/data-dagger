import REST from './protocols/Rest';
import WFS from './protocols/WFS';

interface IGeoServer {
    REST: typeof REST,
    WFS: typeof WFS,
}

class GeoServer implements IGeoServer {
    public readonly REST = REST;
    public readonly WFS  = WFS;
}

export default new GeoServer();

