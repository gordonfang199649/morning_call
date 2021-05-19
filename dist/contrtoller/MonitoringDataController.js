"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const dayjs_1 = __importDefault(require("dayjs"));
const google_tts_api_1 = require("google-tts-api");
const Scripts_1 = require("../scripts/Scripts");
const fs_1 = __importDefault(require("fs"));
const NoDataError_1 = __importDefault(require("../model/NoDataError"));
/**
 * MonitoringDataController 監測環境數據控制器
 * @author Gordon Fang
 * @date 2021-05-19
 */
class MonitoringDataController {
    /**
     * 建構子-依賴注入
     * @param weatherPredictService 天氣預測服務
     * @param airQualityService 空氣品質服務
     */
    constructor(weatherPredictService, airQualityService) {
        this.weatherPredictService = weatherPredictService;
        this.airQualityService = airQualityService;
    }
    /**
     * 分派呼叫對應方法
     * @param args 參數
     * @returns
     */
    async dispatch(args) {
        if (args !== null && args.length > 2) {
            if (Reflect.ownKeys(Object.getPrototypeOf(this)).find((method) => method === args[2])) {
                await this[args[2]]();
            }
        }
    }
    /**
     * 排程-播報每日地區空氣品質、天氣預測
     * @param
     * @returns
     */
    async playDailyReport() {
        let airQualityPo;
        let weatherPredictPo;
        let script;
        try {
            await this.airQualityService.saveMonitoringData();
            airQualityPo = await this.airQualityService.fetchMonitoringData();
            weatherPredictPo = await this.weatherPredictService.fetchMonitoringData();
            script = this.generateScript(Array(airQualityPo, weatherPredictPo));
        }
        catch (err) {
            if (err instanceof NoDataError_1.default) {
                script = err.message;
            }
            else {
                console.error(err);
            }
        }
        if (script !== undefined) {
            const fileName = `${__dirname}/morning_call.mp3`;
            await this.generateAudioFile(script, fileName);
            this.executeCommands(fileName);
        }
    }
    /**
     * 產生語音文字稿
     * @param airQualityPo 空氣品質實體
     * @returns script 文字稿
     */
    generateScript(entityList) {
        return entityList.map((entity) => {
            if (entity.type === 'AirQuality') {
                return Scripts_1.airQualityReportScript((entity));
            }
            else if (entity.type === 'WeatherPredict') {
                return Scripts_1.weatherPredictReportScript((entity));
            }
        }).join();
    }
    /**
     * 產生Base64編碼語音檔
     * @param script 文字稿
     * @param fileName 檔案名
     * @returns
     */
    async generateAudioFile(script, fileName) {
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
    executeCommands(fileName) {
        child_process_1.execSync(`mpg123 ${fileName}`);
        console.log(`finised playing file ${fileName}`);
        child_process_1.exec(`rm ${fileName}`, (err, stdout, stderr) => {
            if (err)
                console.error(err);
            console.log(`deleted file ${fileName}`);
        });
    }
    /**
     * 排程-預先撈取天氣預測資料
     * @param
     * @returns
     */
    async fetchMonitoringData() {
        return await this.weatherPredictService.saveMonitoringData();
    }
    /**
      * 週期性刪除監測數據
      * @param
      * @returns
      */
    async deleteMonitoringData() {
        await this.weatherPredictService.deleteMonitoringData(dayjs_1.default().add(-7, 'd').toDate(), dayjs_1.default().toDate());
        await this.airQualityService.deleteMonitoringData(dayjs_1.default().add(-7, 'd').toDate(), dayjs_1.default().toDate());
    }
}
exports.default = MonitoringDataController;
//# sourceMappingURL=MonitoringDataController.js.map