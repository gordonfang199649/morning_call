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
exports.noDataFoundScript = exports.weatherPredictReportScript = exports.airQualityReportScript = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
/**
 * 產生空氣品質播報腳本
 * @param airQuality 空氣品質實體
 * @returns 播報腳本
 */
const airQualityReportScript = (airQuality) => {
    let greeting;
    const hour = dayjs_1.default().hour();
    if (hour > 2 && hour < 12) {
        greeting = '早安';
    }
    else if (hour > 11 && hour < 19) {
        greeting = '午安';
    }
    else {
        greeting = '晚安';
    }
    return `${process.env.OWNER}${greeting}，在${airQuality.county}${airQuality.siteName}區空氣監測站點，監測時間${airQuality.monitorDate}，${airQuality.itemName}濃度為${airQuality.concentration}，${airQuality.suggestion}`;
};
exports.airQualityReportScript = airQualityReportScript;
/**
 * 產生天氣預測播報腳本
 * @param weatherPredict 天氣預測實體
 * @returns 播報腳本
 */
const weatherPredictReportScript = (weatherPredict) => {
    return `接下來為您播報今日天氣，${weatherPredict.locationsName}從${weatherPredict.startTime}到${weatherPredict.endTime}，天氣狀況為${weatherPredict.elementValue}，今日氣象預報播報完畢，祝您有美好的一天再見!`;
};
exports.weatherPredictReportScript = weatherPredictReportScript;
/**
 * 提供資料庫無監測數據的語音腳本
 * @param type 監測數據類別
 * @returns 語音腳本
 */
const noDataFoundScript = (type) => `很抱歉，資料庫目前尚無${type == 'airQuality' ? '空氣' : '天氣預測'}監測數據，請重新撈取資料，謝謝。`;
exports.noDataFoundScript = noDataFoundScript;
//# sourceMappingURL=scripts.js.map