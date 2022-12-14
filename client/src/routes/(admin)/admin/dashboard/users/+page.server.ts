import type {PageServerLoad} from "./$types";
import db from "$lib/server/database/DatabaseGateway";

export const load: PageServerLoad = () => {
    const fetchUsers = async () => {
        return await db.userRepo.getAll();
    }

    return {
        users: fetchUsers(),
    }
}


