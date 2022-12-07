import {PUBLIC_API_URL} from "$env/static/public";
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

        const response = await fetch( PUBLIC_API_URL + '/auth/keys/publickey');

        if (!response.ok) console.log("Public Key Fetch Error", response);

        this.jwtKey = Buffer.from(
            await response.text().catch(err => {
                console.log('Public Key Reponse Decode Error:', err);
                return ''
            })
        );
        
        return this.jwtKey;
    }
}

export default new PublicKey();
