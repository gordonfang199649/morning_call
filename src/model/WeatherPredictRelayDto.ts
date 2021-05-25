import { WeatherPredict } from "./WeatherPridictModel";

export default class WeatherPredictRelayDto implements WeatherPredict {
    type: string = "";
    locationsName: string = "";
    startTime: string = "";
    endTime: string = "";
    elementValue: string = "";
    createDate: Date = null;
}