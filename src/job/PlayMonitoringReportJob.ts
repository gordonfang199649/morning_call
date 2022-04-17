import dotenv from 'dotenv';
import path from 'path';
import { connection, disconnection } from '../utility/connection/Connection'
import { log } from '../utility/log/log';
import { AirQuality } from '../model/AirQualityModel';
import AirQualityDao from '../repository/AirQualityDao';
import WeatherPredictDao from '../repository/WeatherPredictDao';
import { WeatherPredict } from '../model/WeatherPridictModel';
import Entity from '../model/Entity';
import { airQualityReportScript, errorScript, weatherPredictReportScript } from '../utility/scripts/Scripts';
import { execSync, exec } from 'child_process';
import { getAllAudioBase64 } from 'google-tts-api';
import AudioText from '../model/AudioText';
import fs from 'fs';
dotenv.config({ path: path.resolve(`./${process.env.NODE_ENV}.env`) });

/**
 * PlayMonitoringReportJob
 * 播報空氣、天氣觀測數據
 * @author Gordon Fang
 * @date 2022-04-18
 */
const logger = log("PlayMonitoringReportJob");
(async (): Promise<void> => {
    const weatherPredictDao: WeatherPredictDao = new WeatherPredictDao();
    const airQualityDao: AirQualityDao = new AirQualityDao();
    logger.info('PlayMonitoringReportJob started.');
    await connection();

    let script = null;
    try {
        const airQualityPo: AirQuality = await airQualityDao.fetechLatestData();
        const weatherPredictPo: WeatherPredict = await weatherPredictDao.fetechLatestData();
        script = generateScript(Array<Entity>(airQualityPo, weatherPredictPo));
    } catch (e) {
        logger.error(e);
        // 若撈取資料異常時，播放警示訊息給要聽預報的人
        script = errorScript;
    }

    // 在部署實體機台上播放監測數據的語音腳本檔
    const fileName: string = `${__dirname}/morning_call.mp3`;
    await generateAudioFile(script, fileName);
    executeCommands(fileName);

    await disconnection();
    logger.info('PlayMonitoringReportJob terminated.');
})();

/**
 * 產生語音文字稿
 * @param airQualityPo 空氣品質實體
 * @returns script 文字稿
 */
function generateScript(entityList: Array<Entity>): string {
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
async function generateAudioFile(script: string, fileName: string): Promise<void> {
    const rawAudio: Array<AudioText> = await getAllAudioBase64(script, { lang: 'zh-TW' });
    const base64Audio: string = rawAudio.map((raw) => { return raw.base64 }).join();
    const audioBuffer = Buffer.from(base64Audio, 'base64');
    fs.writeFileSync(fileName, audioBuffer);
    logger.info(`generated audio file: ${fileName}`);
}

/**
 * 執行播放語音檔與刪檔命令
 * @param fileName 檔案名
 * @returns
 */
function executeCommands(fileName: string): void {
    execSync(`mpg123 --quiet ${fileName}`);
    logger.debug(`finised playing file ${fileName}`);
    exec(`rm ${fileName}`, (err, stdout, stderr) => {
        if (err) logger.error(err);
        if (stderr) logger.error(stderr);
        console.log(`deleted file ${fileName}`);
        logger.debug(`deleted file ${fileName}`);
    });
}