
import Database from "better-sqlite3";
import path from "path";

const location: string = path.join(__dirname, "../../data");
const db = new Database(`${location}/main.db`, {verbose: console.log});

const controller = (req: any, res: any) => {
    try{
        const resultToday = db.prepare("SELECT *, dc.id as dc_id, tl.id as tl_id, tl.name as tl_name FROM daily_challanges dc JOIN track_list tl ON tl.id = dc.track_id JOIN albums a ON a.id = tl.album_id  ORDER BY dc_id DESC LIMIT 1").get();
        const streamingLinks = db.prepare("SELECT * FROM track_list_streaming_sites WHERE track_list_id = ?").all(resultToday.tl_id);
        const payloadToSend = JSON.stringify({
            today: resultToday,
            streaming_links: streamingLinks
        });
        
        const paddedResponse = btoa(payloadToSend);
        res.status(200).json({
            meta: {
                code: 200,
                is_error: false,
                message: ""
            },
            data: paddedResponse
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