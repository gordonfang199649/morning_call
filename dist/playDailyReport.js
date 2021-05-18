"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connection_1 = require("./connection/Connection");
const AirQualityDao_1 = __importDefault(require("./repository/AirQualityDao"));
const AirQualityServiceImpl_1 = __importDefault(require("./service/impl/AirQualityServiceImpl"));
const WeatherPredictDao_1 = __importDefault(require("./repository/WeatherPredictDao"));
const WeatherPredictServiceImpl_1 = __importDefault(require("./service/impl/WeatherPredictServiceImpl"));
const Scripts_1 = require("./scripts/Scripts");
const fs_1 = __importDefault(require("fs"));
const google_tts_api_1 = require("google-tts-api");
const child_process_1 = require("child_process");
const NoDataError_1 = __importDefault(require("./model/NoDataError"));
/**
 * 排程-播報每日地區空氣品質、天氣預測
 * @author Gordon Fang
 * @date 2021-05-10
 */
(async () => {
    Connection_1.connection();
    const weatherPredictService = new WeatherPredictServiceImpl_1.default(new WeatherPredictDao_1.default());
    const airQualityService = new AirQualityServiceImpl_1.default(new AirQualityDao_1.default());
    let airQualityPo;
    let weatherPredictPo;
    let script;
    try {
        await airQualityService.saveMonitoringData();
        airQualityPo = await airQualityService.fetchMonitoringData();
        weatherPredictPo = await weatherPredictService.fetchMonitoringData();
        script = generateScript(airQualityPo).concat(generateScript(weatherPredictPo));
    }
    catch (err) {
        if (err instanceof NoDataError_1.default) {
            script = err.message;
        }
        else {
            console.error(err);
        }
    }
    finally {
        Connection_1.disconnection();
    }
    if (script !== undefined) {
        const fileName = `${__dirname}/morning_call.mp3`;
        await generateAudioFile(script, fileName);
        executeCommands(fileName);
    }
})();
/**
 * 產生語音文字稿
 * @param airQualityPo 空氣品質實體
 * @returns script 文字稿
 * @todo 文字稿腳本擬另一個檔案存放
 */
function generateScript(entity) {
    if (entity.type === 'AirQuality') {
        return Scripts_1.airQualityReportScript((entity));
    }
    else if (entity.type === 'WeatherPredict') {
        return Scripts_1.weatherPredictReportScript((entity));
    }
}
/**
 * 產生Base64編碼語音檔
 * @param script 文字稿
 * @param fileName 檔案名
 * @returns
 */
async function generateAudioFile(script, fileName) {
    const rawAudio = await google_tts_api_1.getAllAudioBase64(script, { lang: 'zh-TW' });
    const base64Audio = rawAudio.map((raw) => { return raw.base64; }).join('');
    const audioBuffer = Buffer.from(base64Audio, 'base64');
    fs_1.default.writeFileSync(`${fileName}`, audioBuffer);
    console.log(`generated audio file: ${fileName}`);
}
/**
 * 執行播放語音檔與刪檔命令
 * @param fileName 檔案名
 * @returns
 */
function executeCommands(fileName) {
    child_process_1.execSync(`mpg123 ${fileName}`);
    console.log(`finised playing file ${fileName}`);
    child_process_1.exec(`rm ${fileName}`, (err, stdout, stderr) => {
        if (err)
            console.error(err);
        console.log(`deleted file ${fileName}`);
    });
}
//# sourceMappingURL=PlayDailyReport.js.map