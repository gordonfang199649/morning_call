import axios from "axios";
import dayjs from "dayjs";
import * as dotenv from "dotenv";
import { AirQuality } from "../model/AirQualityModel";
import { WeatherPredict } from "../model/WeatherPridictModel";
dotenv.config();

const airQualityRequest = axios.create({
  baseURL: "https://opendata.epa.gov.tw/api/v1/",
});

const weatherPredictRequest = axios.create({
  baseURL: "https://opendata.cwb.gov.tw/api/v1/rest/datastore/",
});

/**
 * 行政院環境保護署 - 環境資源資料開放平臺：開放資料 OpenAPI
 * @param site 監測站點
 * @param  skip 跳過筆數
 * @param  top 筆數
 * @returns 空氣品質監測數據
 */
export const getAirQualityData = (site: string, skip: number, top: number): Promise<AirQuality> =>
  airQualityRequest.get(
    `${site}?%24skip=${skip}&%24top=${top}&%24format=json`
  ).then((res: any) => {
    const data = res.data[0];
    return <AirQuality>
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
      }
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
    return <WeatherPredict>{
      locationsName: `${loc.locationsName}${process.env.LOCATION_NAME}`,
      startTime: el.startTime,
      endTime: el.endTime,
      elementValue: el.elementValue[0].value,
      createDate: dayjs().toDate(),
    };
  });