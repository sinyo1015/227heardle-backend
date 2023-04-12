import BOOTSTRAPS from "./bootstraps/bootstrap-registry";
import fs from "fs";
import path from "path";
import BASE_SERVICES from "./services/base-service";

const INITIALIZE = () => {
    for (const BOOTSTRAP of BOOTSTRAPS)
        BOOTSTRAP();

    /*
    *   Make sure cropped music get their directory right
    */
    if(!fs.existsSync(path.join(__dirname, "../cropped_music")))
        fs.mkdirSync(path.join(__dirname, "../cropped_music"));

    /**
     *  Run services
     */
     BASE_SERVICES();
};


export default INITIALIZE;