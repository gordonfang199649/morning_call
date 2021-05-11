"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("./connection/connect");
const WeatherPredictDao_1 = __importDefault(require("./Repository/WeatherPredictDao"));
const WeatherPredictServiceImpl_1 = __importDefault(require("./Service/WeatherPredictServiceImpl"));
const scripts_1 = require("./scripts/scripts");
const fs_1 = __importDefault(require("fs"));
const google_tts_api_1 = require("google-tts-api");
const child_process_1 = require("child_process");
/**
 * 排程-播報每日地區空氣品質、天氣預測
 * @author Gordon Fang
 */
(async () => {
    connect_1.connection();
    // const airQualityService: AirQualityService = new AirQualityServiceImpl(new AirQualityDao());
    // await airQualityService.saveMonitoringData();
    // const airQualityPo: Entity = await airQualityService.fetchMonitoringData();
    const weatherPredictService = new WeatherPredictServiceImpl_1.default(new WeatherPredictDao_1.default());
    weatherPredictService.saveMonitoringData();
    // const weatherPredictPo: Entity = await weatherPredictService.fetchMonitoringData();
    connect_1.disconnection();
    // await playDailyReport(airQualityPo, "air_quality_report.mp3");
    // await playDailyReport(weatherPredictPo, "weather_report_report.mp3");
})();
/**
 * 播放每日空氣、氣象播報
 * @param entity 實體
 * @param fifleName 檔案名稱
 */
async function playDailyReport(entity, fifleName) {
    const fileName = fifleName;
    const script = generateScript(entity);
    await generateAudioBase64(script, fileName);
    executeCommands(fileName);
}
/**
 * 產生語音文字稿
 * @param airQualityPo 空氣品質實體
 * @returns script 文字稿
 * @todo 文字稿腳本擬另一個檔案存放
 */
function generateScript(entity) {
    if (entity.type === 'AirQuality') {
        return scripts_1.airQualityReportScript((entity));
    }
    else if (entity.type === 'WeatherPredict') {
        return scripts_1.weatherPredictReportScript((entity));
    }
}
/**
 * 產生Base64編碼語音檔
 * @param script 文字稿
 * @param fileName 檔案名
 * @returns
 */
async function generateAudioBase64(script, fileName) {
    const base64 = await google_tts_api_1.getAudioBase64(script, { lang: 'zh-TW' });
    const buffer = Buffer.from(base64, 'base64');
    fs_1.default.writeFileSync(fileName, buffer, { encoding: 'base64' });
    console.log('generated audio file.');
}
/**
 * 執行播放語音檔與刪檔命令
 * @param fileName 檔案名
 * @returns
 */
function executeCommands(fileName) {
    child_process_1.execSync(`mpg123 ./${fileName}`);
    console.log(`finised playing file ${fileName}`);
    child_process_1.exec(`rm ./${fileName}`, (err, stdout, stderr) => {
        if (err)
            console.error(err);
        console.log(`deleted file ${fileName}`);
    });
}
//# sourceMappingURL=index.js.map