import { WeatherPredict } from "./WeatherPridictModel";

export default class WeatherPredictRelayDo implements WeatherPredict {
    type: string = "";
    locationsName: string = "";
    startTime: string = "";
    endTime: string = "";
    elementValue: string = "";
    createDate: Date = null;
}