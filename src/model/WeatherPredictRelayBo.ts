import { WeatherPredict } from "./WeatherPridictModel";

export default class WeatherPredictRelayBo implements WeatherPredict {
    type: string = "";
    locationsName: string = "";
    startTime: string = "";
    endTime: string = "";
    elementValue: string = "";
    createDate: Date = null;
}