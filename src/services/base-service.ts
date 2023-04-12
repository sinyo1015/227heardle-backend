import AUDIO_CROPPER_BACKGROUND_SERVICE from "./audio-cropper-service";

const SERVICES: any[] = [
    AUDIO_CROPPER_BACKGROUND_SERVICE
];

const BASE_SERVICES = () => {
    for(const service of SERVICES)
        service();
}

export default BASE_SERVICES;