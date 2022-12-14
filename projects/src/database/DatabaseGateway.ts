import mongoose, {Connection} from 'mongoose';
import ProjectsRepo from "./repos/ProjectsRepo.js";

interface IDatabaseGateway {
    projects: ProjectsRepo;
}

class DatabaseGateway implements IDatabaseGateway {
    private readonly db: Connection;

    public readonly projects: ProjectsRepo;

    constructor() {
        const url = process.env.DATABASE_URL;
        if (!url) throw Error('DATABASE_URL is missing in environment');

        this.db = mongoose.createConnection(url);
        this.projects = new ProjectsRepo(this.db);
    }
}

export default new DatabaseGateway();
