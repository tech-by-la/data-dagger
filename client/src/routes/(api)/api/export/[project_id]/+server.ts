import type {RequestHandler} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import {StatusCode, StatusMessage} from "$lib/server/util/enums";
import GeoJSON from "ol/format/GeoJSON";

export const GET: RequestHandler = ({params, locals}) => {
    if (!locals.user) throw error(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });

    const data = new GeoJSON();
    // data.writeFeaturesObject()

    return new Response(JSON.stringify(data));
}
