import Database from "better-sqlite3";
import path from "path";

const location: string = path.join(__dirname, "../../data");
const db = new Database(`${location}/main.db`, {verbose: console.log});

const controller = (req: any, res: any) => {
    let announcements = db.prepare("SELECT * FROM announcements ORDER BY id LIMIT 5").all();

    res.status(200).json({
        meta: {
            code: 200,
            is_error: false,
            message: ""
        },
        data: announcements
    });
};

export default controller;