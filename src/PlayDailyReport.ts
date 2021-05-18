import { connection, disconnection } from './connection/Connection'
import Entity from "./model/Entity";
import { AirQuality } from "./model/AirQualityModel";
import AirQualityDao from "./repository/AirQualityDao";
import AirQualityServiceImpl from "./service/impl/AirQualityServiceImpl";
import { WeatherPredict } from "./model/WeatherPridictModel";
import WeatherPredictDao from "./repository/WeatherPredictDao";
import WeatherPredictServiceImpl from "./service/impl/WeatherPredictServiceImpl";
import { airQualityReportScript, weatherPredictReportScript } from './scripts/Scripts'
import fs from 'fs';
import { getAllAudioBase64 } from 'google-tts-api';
import { exec, execSync } from "child_process";
import AudioText from './model/AudioText';
import NoDataError from './model/NoDataError';
import MonitoringService from './service/MonitoringService';

/**
 * 排程-播報每日地區空氣品質、天氣預測
 * @author Gordon Fang
 * @date 2021-05-10
 */
(async (): Promise<void> => {
    connection();
    const weatherPredictService: MonitoringService = new WeatherPredictServiceImpl(new WeatherPredictDao());
    const airQualityService: MonitoringService = new AirQualityServiceImpl(new AirQualityDao());
    let airQualityPo: Entity;
    let weatherPredictPo: Entity;
    let script: string;

    try {
        await airQualityService.saveMonitoringData();
        airQualityPo = await airQualityService.fetchMonitoringData();
        weatherPredictPo = await weatherPredictService.fetchMonitoringData();
        script = generateScript(airQualityPo).concat(generateScript(weatherPredictPo))
    } catch (err) {
        if (err instanceof NoDataError) {
            script = err.message;
        } else {
            console.error(err);
        }
    } finally {
        disconnection();
    }

    if (script !== undefined) {
        const fileName: string = `${__dirname}/morning_call.mp3`;
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
function generateScript(entity: Entity): string {
    if (entity.type === 'AirQuality') {
        return airQualityReportScript(<AirQuality>(entity));
    } else if (entity.type === 'WeatherPredict') {
        return weatherPredictReportScript(<WeatherPredict>(entity));
    }
}

/**
 * 產生Base64編碼語音檔
 * @param script 文字稿
 * @param fileName 檔案名
 * @returns
 */
async function generateAudioFile(script: string, fileName: string): Promise<void> {
    const rawAudio: Array<AudioText> = await getAllAudioBase64(script, { lang: 'zh-TW' })
    const base64Audio: string = rawAudio.map((raw) => { return raw.base64 }).join('');
    const audioBuffer = Buffer.from(base64Audio, 'base64');
    fs.writeFileSync(`${fileName}`, audioBuffer);
    console.log(`generated audio file: ${fileName}`)
}

/**
 * 執行播放語音檔與刪檔命令
 * @param fileName 檔案名
 * @returns
 */
function executeCommands(fileName: string): void {
    execSync(`mpg123 ${fileName}`);
    console.log(`finised playing file ${fileName}`);
    exec(`rm ${fileName}`, (err, stdout, stderr) => {
        if (err) console.error(err);
        console.log(`deleted file ${fileName}`);
    });
}