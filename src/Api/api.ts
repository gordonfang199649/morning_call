import * as dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import dayjs from "dayjs";
import { AirQuality } from "../model/AirQualityModel";
import { WeatherPredict } from "../model/WeatherPridictModel";
import MonitoringItem from "../Enum/MonitoringItem";

const airQualityRequest = axios.create({
  baseURL: "https://data.epa.gov.tw/api/v1/",
});

const weatherPredictRequest = axios.create({
  baseURL: "https://opendata.cwb.gov.tw/api/v1/rest/datastore/",
});

/**
 * 行政院環境保護署 - 環境資源資料開放平臺：開放資料 OpenAPI
 * @param  offset 跳過筆數
 * @param  limit 筆數
 * @returns 空氣品質監測數據
 */
export const getAirQualityData = (offset: number, limit: number): Promise<AirQuality> =>
  airQualityRequest.get(
    `${process.env.EPA_API_ID}?offset=${offset}&limit=${limit}&api_key=${process.env.EPA_AUTH_KEY}`
  ).then((res: any) => {
    const data: any = res.data.records.find((record: any) => record.ItemName == MonitoringItem.PM2PT5);
    return Promise.resolve(<AirQuality>
      {
        siteId: Number.parseInt(data.SiteId),
        county: data.County,
        siteName: data.SiteName,
        monitorDate: data.MonitorDate,
        itemName: data.ItemName,
        itemEngName: data.ItemEngName,
        concentration: Number.parseInt(data.Concentration),
        suggestion: '',
        createDate: dayjs().toDate(),
      })
  });

/**
 *中央氣象局開放資料平臺之資料擷取API
 * @param countryCode
 * @param locationName
 * @param startTime
 * @param  endTime
 * @returns 氣象局天氣預報綜合描述
 */
export const getWeatherPredictData = (countryCode: string, locationName: string, startTime: string, endTime: string): Promise<WeatherPredict> =>
  weatherPredictRequest.get(
    encodeURI(
      `${countryCode}?Authorization=${process.env.CWB_AUTH_KEY}&limit=1&offset=0&format=JSON&locationName=${locationName}&elementName=WeatherDescription&sort=time&timeFrom=${startTime}&timeTo=${endTime}`
    )
  ).then((res: any) => {
    const loc = res.data.records.locations[0];
    const el = loc.location[0].weatherElement[0].time[0];
    return Promise.resolve(<WeatherPredict>{
      locationsName: `${loc.locationsName}${process.env.LOCATION_NAME}`,
      startTime: el.startTime,
      endTime: el.endTime,
      elementValue: el.elementValue[0].value,
      createDate: dayjs().toDate(),
    });
  });