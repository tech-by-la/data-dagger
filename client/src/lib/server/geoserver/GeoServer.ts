import REST from './protocols/REST';
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

