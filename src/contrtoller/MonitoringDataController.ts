import dayjs from "dayjs";
import { getAllAudioBase64 } from "google-tts-api";
import { AirQuality } from "../model/AirQualityModel";
import AudioText from "../model/AudioText";
import Entity from "../model/Entity";
import { WeatherPredict } from "../model/WeatherPridictModel";
import AirQualityDao from "../repository/AirQualityDao";
import WeatherPredictDao from "../repository/WeatherPredictDao";
import { airQualityReportScript, weatherPredictReportScript } from "../scripts/Scripts";
import AirQualityServiceImpl from "../service/impl/AirQualityServiceImpl";
import WeatherPredictServiceImpl from "../service/impl/WeatherPredictServiceImpl";
import MonitoringService from "../service/MonitoringService";
import fs from 'fs';
import NoDataError from "../model/NoDataError";
import { log } from "../log/log";
import Speaker from "speaker";
import lame from 'lame';

/**
 * MonitoringDataController 監測環境數據控制器
 * @author Gordon Fang
 * @date 2021-05-19
 */
export default class MonitoringDataController {
    /** weatherPredictService 天氣預測服務 */
    private weatherPredictService: MonitoringService;
    /** airQualityService 空氣品質服務 */
    private airQualityService: MonitoringService;
    /** looger */
    private logger = log(this.constructor.name);

    /**
     * 建構子-依賴注入
     * @param weatherPredictService 天氣預測服務
     * @param airQualityService 空氣品質服務
     */
    constructor(weatherPredictService: MonitoringService, airQualityService: MonitoringService) {
        this.weatherPredictService = weatherPredictService;
        this.airQualityService = airQualityService;
    }

    /**
     * 分派呼叫對應方法
     * @param args 參數
     * @returns
     */
    public async dispatch(args: Array<string>): Promise<void> {
        const controllerProxy = new Proxy(this, {
            get: (target: MonitoringDataController, prop: string): boolean => {
                this.logger.debug(`now calling ${prop}`);
                return Reflect.get(target, prop);
            }
        });
        if (args[2] !== undefined && args[2] in controllerProxy) {
            await controllerProxy[args[2]]();
        }
    }

    /**
     * 排程-播報每日地區空氣品質、天氣預測
     * @param
     * @returns
     */
    private async playDailyReport(): Promise<void> {
        let airQualityPo: Entity;
        let weatherPredictPo: Entity;
        let script: string;

        try {
            await this.airQualityService.saveMonitoringData();
            airQualityPo = await this.airQualityService.fetchMonitoringData();
            weatherPredictPo = await this.weatherPredictService.fetchMonitoringData();
            script = this.generateScript(Array<Entity>(airQualityPo, weatherPredictPo));
        } catch (err) {
            if (err instanceof NoDataError) {
                script = err.message;
            } else {
                this.logger.error(err);
            }
        }

        if (script !== undefined) {
            const fileName: string = `${__dirname}/morning_call.mp3`;
            await this.generateAudioFile(script, fileName);
            this.outputAudioToSpeaker(fileName);
        }
    }

    /**
     * 產生語音文字稿
     * @param airQualityPo 空氣品質實體
     * @returns script 文字稿
     */
    private generateScript(entityList: Array<Entity>): string {
        return entityList.map((entity) => {
            if (entity.type === 'AirQuality') {
                return airQualityReportScript(<AirQuality>(entity));
            } else if (entity.type === 'WeatherPredict') {
                return weatherPredictReportScript(<WeatherPredict>(entity));
            }
        }).join();
    }

    /**
     * 產生Base64編碼語音檔
     * @param script 文字稿
     * @param fileName 檔案名
     * @returns
     */
    private async generateAudioFile(script: string, fileName: string): Promise<void> {
        const rawAudio: Array<AudioText> = await getAllAudioBase64(script, { lang: 'zh-TW' });
        const base64Audio: string = rawAudio.map((raw) => { return raw.base64 }).join();
        const audioBuffer = Buffer.from(base64Audio, 'base64');
        fs.createWriteStream(fileName).write(audioBuffer, "base64");
        this.logger.info(`generated audio file: ${fileName}`);
    }

    /**
     * 執行播放語音檔
     * @param fileName 檔案名
     * @returns
     */
    private outputAudioToSpeaker(fileName: string): void {
        fs.createReadStream(fileName)
            .pipe(new lame.Decoder())
            .pipe(new Speaker());
    }

    /**
     * 排程-預先撈取天氣預測資料
     * @param
     * @returns
     */
    private async fetchMonitoringData(): Promise<void> {
        return await this.weatherPredictService.saveMonitoringData();
    }

    /**
      * 週期性刪除監測數據
      * @param
      * @returns
      */
    private async deleteMonitoringData(): Promise<void> {
        await this.weatherPredictService.deleteMonitoringData();
        await this.airQualityService.deleteMonitoringData();
    }
}