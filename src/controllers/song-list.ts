import Database from "better-sqlite3";
import path from "path";

const location: string = path.join(__dirname, "../../data");
const db = new Database(`${location}/main.db`, {verbose: console.log});

const controller = (req: any, res: any) => {
    try{
        const songList = db.prepare("SELECT * FROM track_list").all();

        res.status(200).json({
            meta: {
                code: 200,
                is_error: false,
                message: ""
            },
            data: songList
        });

    }
    catch(err){
        res.status(500).json({
            meta: {
                code: 500,
                is_error: true,
                message: "Server Error"
            },
            data: {}
        });
    }
};


export default controller;