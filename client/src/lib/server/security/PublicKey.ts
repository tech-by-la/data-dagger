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
        const HOST = 'http://localhost:3000'
        const response = await fetch( HOST + '/api/auth/keys/publickey');
        if (response.ok) this.jwtKey = Buffer.from(await response.text());
        return this.jwtKey;
    }
}

export default new PublicKey();
