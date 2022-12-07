import { PUBLIC_API_URL }	from '$env/static/public'
class PublicKey {
    private jwtKey: Buffer = Buffer.from([]);

    constructor() {
        (async () => {
            this.jwtKey = await this.fetchJwtKey().catch(() => this.jwtKey);
        })();
    }

    public async getJwtKey(): Promise<Buffer> {
        if (!this.jwtKey || this.jwtKey+'' === '') this.jwtKey = await this.fetchJwtKey();
        return this.jwtKey;
    }

    private async fetchJwtKey(): Promise<Buffer> {
        try {
            const response = await fetch( PUBLIC_API_URL + '/auth/keys/publickey');
            console.log(response);
            if (response.ok) this.jwtKey = Buffer.from(await response.text());
            return this.jwtKey;
        } catch (err) {
            console.log(err);
            return this.jwtKey;
        }

    }
}

export default new PublicKey();
