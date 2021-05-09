import * as dotenv from "dotenv";
dotenv.config();
import schedule from 'node-schedule';
import { connection, disconnection } from './connection/connect'
import AirQualityDao from "./Repository/AirQualityDao";
import { AirQualityService } from "./Service/AirQualityService";
import AirQualityServiceImpl from "./Service/AirQualityServiceImpl";
import fs from 'fs';
import { getAudioBase64 } from 'google-tts-api';
import { AirQuality } from "./model/AirQualityModel";
import { exec } from "child_process";
import dayjs from "dayjs";

schedule.scheduleJob(process.env.CRONTAB, async () => {
  connection();
  const airQualityService: AirQualityService = new AirQualityServiceImpl(new AirQualityDao());
  await airQualityService.saveEPAMonitoringData();
  const airQualityPo: AirQuality = await airQualityService.fetchMonitoringData();
  disconnection();
  const fileName: string = 'morning_call.mp3';
  const script: string = generateScript(airQualityPo);
  generateAudioBase64(script, fileName);
  executeCommands(fileName);
});

function generateScript(airQualityPo: AirQuality): string {
  let greeting: string;
  const hour: number = dayjs().hour();

  if (hour > 2 && hour < 12) {
    greeting = '早安';
  } else if (hour > 11 && hour < 19) {
    greeting = '午安';
  } else {
    greeting = '晚安';
  }
  console.log(hour, greeting);
  return `${process.env.OWNER}${greeting}，在${airQualityPo.county}
  ${airQualityPo.siteName}區空氣監測站點，監測時間${airQualityPo.monitorDate}，
  ${airQualityPo.itemName}濃度為${airQualityPo.concentration}，
  ${airQualityPo.suggestion}`;
}

async function generateAudioBase64(script: string, fileName: string): Promise<void> {
  const base64 = await getAudioBase64(script, { lang: 'zh-TW' });
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(fileName, buffer, { encoding: 'base64' });
  console.log('generated audio file.')
}

async function executeCommands(fileName: string) {
  exec(`mpg123 ./${fileName}`, (err, stdout, stderr) => {
    if (err) console.error(err);
    exec(`rm ./${fileName}`, (err, stdout, stderr) => {
      if (err) console.error(err);
      console.log(`deleted file ${fileName}`);
    });
  });
}