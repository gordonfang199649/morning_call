import dayjs from "dayjs";
import * as dotenv from "dotenv";
import { AirQuality } from "../model/AirQualityModel";
import { WeatherPredict } from "../model/WeatherPridictModel";
dotenv.config();

/**
 * 產生空氣品質播報腳本
 * @param airQuality 空氣品質實體
 * @returns 播報腳本
 */
export const airQualityReportScript = (airQuality: AirQuality): string => {
    let greeting: string;
    const hour: number = dayjs().hour();

    if (hour > 2 && hour < 12) {
        greeting = '早安';
    } else if (hour > 11 && hour < 19) {
        greeting = '午安';
    } else {
        greeting = '晚安';
    }

    return `${process.env.OWNER}${greeting}，在${airQuality.county}${airQuality.siteName}區空氣監測站點，監測時間${airQuality.monitorDate}，${airQuality.itemName}濃度為${airQuality.concentration}，${airQuality.suggestion}`;
}

/**
 * 產生天氣預測播報腳本
 * @param weatherPredict 天氣預測實體
 * @returns 播報腳本
 */
export const weatherPredictReportScript = (weatherPredict: WeatherPredict): string => {
    return `接下來為您播報今日天氣，${weatherPredict.locationsName}從${weatherPredict.startTime}到${weatherPredict.endTime}，天氣狀況為${weatherPredict.elementValue}，今日氣象預報播報完畢，祝您有美好的一天再見!`;
}