"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeatherPredictData = exports.getAirQualityData = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const airQualityRequest = axios_1.default.create({
    baseURL: "https://opendata.epa.gov.tw/api/v1/",
});
const weatherPredictRequest = axios_1.default.create({
    baseURL: "https://opendata.cwb.gov.tw/api/v1/rest/datastore/",
});
/**
 * 行政院環境保護署 - 環境資源資料開放平臺：開放資料 OpenAPI
 * @param site 監測站點
 * @param  skip 跳過筆數
 * @param  top 筆數
 * @returns 空氣品質監測數據
 */
const getAirQualityData = (site, skip, top) => airQualityRequest.get(`${site}?%24skip=${skip}&%24top=${top}&%24format=json`);
exports.getAirQualityData = getAirQualityData;
/**
 *中央氣象局開放資料平臺之資料擷取API
 * @param countryCode
 * @param locationName
 * @param startTime
 * @param  endTime
 * @returns 氣象局天氣預報綜合描述
 */
const getWeatherPredictData = (countryCode, locationName, startTime, endTime) => weatherPredictRequest.get(encodeURI(`${countryCode}?Authorization=${process.env.CWB_AUTH_KEY}&limit=1&offset=0&format=JSON&locationName=${locationName}&elementName=WeatherDescription&sort=time&startTime=${startTime}&timeFrom=${startTime}&timeTo=${endTime}`));
exports.getWeatherPredictData = getWeatherPredictData;
//# sourceMappingURL=api.js.map