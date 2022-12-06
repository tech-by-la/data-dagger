export interface Translation {
    _id?: string;
    page: string;
    key: string;
    translations: { [key: string]: string }
}
