
import schedule from 'node-schedule';
import { connection, disconnection } from './connection/connect'
import Entity from "./model/Entity";
import { AirQuality } from "./model/AirQualityModel";
import AirQualityDao from "./Repository/AirQualityDao";
import AirQualityService from "./Service/AirQualityService";
import AirQualityServiceImpl from "./Service/AirQualityServiceImpl";
import { WeatherPredict } from "./model/WeatherPridictModel";
import WeatherPredictDao from "./Repository/WeatherPredictDao";
import WeatherPredictService from "./Service/WeatherPredictService";
import WeatherPredictServiceImpl from "./Service/WeatherPredictServiceImpl";
import { airQualityReportScript, weatherPredictReportScript } from './scripts/scripts'
import fs from 'fs';
import { getAudioBase64 } from 'google-tts-api';
import { exec, execSync } from "child_process";

/**
 * 排程-預先撈取天氣預測資料
 * @author Gordon Fang
 */
schedule.scheduleJob(process.env.NIGHT_CRONTAB, async (): Promise<void> => {
    connection();
    const weatherPredictService: WeatherPredictService = new WeatherPredictServiceImpl(new WeatherPredictDao());
    await weatherPredictService.saveMonitoringData();
    disconnection();
});


/**
 * 排程-播報每日地區空氣品質、天氣預測
 * @author Gordon Fang
 */
schedule.scheduleJob(process.env.MORNING_CRONTAB, async (): Promise<void> => {
    connection();
    const airQualityService: AirQualityService = new AirQualityServiceImpl(new AirQualityDao());
    await airQualityService.saveMonitoringData();
    const airQualityPo: Entity = await airQualityService.fetchMonitoringData();
    const weatherPredictService: WeatherPredictService = new WeatherPredictServiceImpl(new WeatherPredictDao());
    const weatherPredictPo: Entity = await weatherPredictService.fetchMonitoringData();
    disconnection();
    await playDailyReport(airQualityPo, "air_quality_report.mp3");
    await playDailyReport(weatherPredictPo, "weather_report_report.mp3");
});

/**
 * 播放每日空氣、氣象播報
 * @param entity 實體
 * @param fifleName 檔案名稱
 */
async function playDailyReport(entity: Entity, fifleName: string): Promise<void> {
    const fileName: string = fifleName;
    const script: string = generateScript(entity);
    await generateAudioBase64(script, fileName);
    executeCommands(fileName);
}
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
async function generateAudioBase64(script: string, fileName: string): Promise<void> {
    const base64 = await getAudioBase64(script, { lang: 'zh-TW' });
    const buffer = Buffer.from(base64, 'base64');
    fs.writeFileSync(fileName, buffer, { encoding: 'base64' });
    console.log('generated audio file.')
}

/**
 * 執行播放語音檔與刪檔命令
 * @param fileName 檔案名
 * @returns
 */
function executeCommands(fileName: string): void {
    execSync(`mpg123 ./${fileName}`);
    console.log(`finised playing file ${fileName}`);
    exec(`rm ./${fileName}`, (err, stdout, stderr) => {
        if (err) console.error(err);
        console.log(`deleted file ${fileName}`);
    });
}