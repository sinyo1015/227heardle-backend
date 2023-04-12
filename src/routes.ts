import express from "express";

import getDailyChallangeController from "./controllers/daily-challanges";
import getSongList from "./controllers/song-list";
import getAnnouncements from "./controllers/announcement";

const routes = (app: express.Express) => {
    app.get("/daily_challanges", (req, res) => {
        return getDailyChallangeController(req, res);
    });
    app.get("/song_list", (req, res) => {
        return getSongList(req, res);
    });
    app.get("/announcements", (req, res) => {
        return getAnnouncements(req, res);
    });
};

export default routes;