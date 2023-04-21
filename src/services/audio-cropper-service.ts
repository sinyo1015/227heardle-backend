import {CronJob} from "cron";
import Database from "better-sqlite3";
import path from "path";
import YTDlpWrap from "yt-dlp-wrap";
import md5 from "md5";
import ffmpeg from "js-ffmpeg";
import { Duration, DateTime } from "luxon";
import fs from "fs";

const location: string = path.join(__dirname, "../../data");
const db = new Database(`${location}/main.db`, {verbose: console.log});
const ytDlpWrap = new YTDlpWrap();

const _doWork = () => {
    //Get random music
    const previousChallange: any = db.prepare("SELECT * FROM daily_challanges ORDER BY id DESC LIMIT 1").get();
    const queryResult: any = db.prepare("SELECT *, track_list.id as track_list_id FROM track_list JOIN albums ON albums.id = track_list.album_id ORDER BY RANDOM() LIMIT 1").get();
    const selectedSong: any = db.prepare(`SELECT * FROM track_list_streaming_sites WHERE track_list_id = ? AND type = ?`).get(queryResult.track_list_id, "youtube");

    
    const filename = `${md5(new Date().getMilliseconds().toString())}`;
    const startQuizTime = DateTime.fromObject({hour: 0, minute: 0}).toISO({includeOffset: false});
    const endQuizTime = DateTime.fromObject({hour: 23, minute: 59}).toISO({includeOffset: false});

    ytDlpWrap.execPromise([
        selectedSong.link,
        '-f',
        'bestaudio[ext=m4a]',
        '-o',
        `/tmp/${filename}.m4a`
    ])
    .then((result) => {
        ffmpeg.ffprobe(`/tmp/${filename}.m4a`)
            .toNativePromise()
            .then((res) => {
                const maxDuration = Number(res.format.duration) - 30;
                const positionWanted = Math.floor(Math.random() * (maxDuration - 0 + 1)) + 0;
                const durationFrom = Duration.fromObject({seconds: positionWanted});
                const startFrom = durationFrom.toFormat("hh:mm:ss.00");
                
                ffmpeg.ffmpeg(`/tmp/${filename}.m4a`, [
                    `-ss ${startFrom}`,
                    '-t 30'
                ], path.join(__dirname, `../../cropped_music/${filename}.mp3`))
                .toNativePromise()
                .then((res) => {
                    fs.unlink(`/tmp/${filename}.m4a`, err => {
                        //No-op
                    });
                    if(previousChallange != null){
                        fs.unlink(path.join(__dirname, `../../cropped_music/${previousChallange.file_name}`), err => {
                            //No-op
                        });
                    }
                    db.prepare("INSERT INTO daily_challanges VALUES(null, ?, ?, ?, ?)").run(startQuizTime, endQuizTime, queryResult.track_list_id, `${filename}.mp3`);
                    console.log("Done inserting");
                })
                .catch((err) => {
                    console.log("FFMPEG Error");
                    console.log(err);
                })
            })
            .catch((err) => {
                console.log("FFPROBE Error");
                console.log(err);
            });
    })
    .catch((err) => {
        console.log("Yt-dlp err");
        console.log(err);
        _doWork();
    });
};

const AUDIO_CROPPER_BACKGROUND_SERVICE = () => {    
    //Change the cronjob pattern as you desired
    const job = new CronJob("* * * * *", _doWork);

    job.start();
}


export default AUDIO_CROPPER_BACKGROUND_SERVICE;
