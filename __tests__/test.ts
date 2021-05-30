import dotenv from 'dotenv';
import path from 'path';
import dayjs from 'dayjs';
import { connection, disconnection } from '../src/utility/connection/Connection'
import WeatherPredictDao from "../src/repository/WeatherPredictDao";
import MonitoringService from '../src/service/MonitoringService';
import WeatherPredictServiceImpl from "../src/service/impl/WeatherPredictServiceImpl";
import WeatherPredictRelayBo from '../src/model/WeatherPredictRelayBo';
import AirQualityServiceImpl from "../src/service/impl/AirQualityServiceImpl";
import AirQualityRelayBo from '../src/model/AirQualityRelayBo';
import AirQualityDao from '../src/repository/AirQualityDao';
import { errorScript } from '../src/utility/scripts/Scripts';
import DataType from '../src/enum/DataType';
import MonitoringDataController from '../src/contrtoller/MonitoringDataController';
import AirQualityDto from '../src/model/AirQualityDto';
import WeatherPredictDto from '../src/model/WeatherPredictDto';
import WeatherPredictRelayDo from '../src/model/WeatherPredictRelayDo';
import * as Api from '../src/utility/api/Api';
import { AirQuality } from '../src/model/AirQualityModel';
import AirQualityIndex from '../src/enum/AirQualityIndex';

dotenv.config({ path: path.resolve(`./${process.env.NODE_ENV}.env`) });

const controller: MonitoringDataController = new MonitoringDataController(
    new WeatherPredictServiceImpl(new WeatherPredictDao()),
    new AirQualityServiceImpl(new AirQualityDao()));
const airQualityDao: AirQualityDao = new AirQualityDao();
const weatherPredictDao: WeatherPredictDao = new WeatherPredictDao();
const airQualityService: MonitoringService = new AirQualityServiceImpl(new AirQualityDao());
const weatherPredictService: MonitoringService = new WeatherPredictServiceImpl(new WeatherPredictDao());

beforeAll(async () => {
    await connection();
});

afterAll(async () => {
    await disconnection();
});

describe("應用程式單元測試", () => {
    test("預期空氣品質資料是否有正確地儲存到資料庫", async () => {
        const saveRelayBo: AirQualityRelayBo = await airQualityService.saveMonitoringData();
        const fetchRelayBo: AirQualityRelayBo = await airQualityService.fetchMonitoringData();
        expect(saveRelayBo).toEqual(fetchRelayBo);
    });

    test("預期天氣監測資料是否有正確地儲存到資料庫", async () => {
        const saveRelayBo: WeatherPredictRelayBo = await weatherPredictService.saveMonitoringData();
        const fetchRelayBo: WeatherPredictRelayBo = await weatherPredictService.fetchMonitoringData();
        expect(saveRelayBo).toEqual(fetchRelayBo);
    });

    test("預期依據PM2.5濃度產生對應建議", async () => {
        const testCase: AirQuality = <AirQuality>{
            type: DataType.AIR_QUALITY,
            siteId: 57,
            county: '高雄市',
            siteName: '前鎮',
            monitorDate: Date(),
            itemName: '細懸浮微粒',
            itemEngName: 'PM2.5',
            concentration: 0,
            suggestion: '',
        };

        const spyGetAirQualityData = jest.spyOn(Api, 'getAirQualityData')
        const concentration = [1, 51, 101, 151, 201, 301];
        const airIndex = [AirQualityIndex.GOOD,
        AirQualityIndex.MODERATE,
        AirQualityIndex.SENSITIVE,
        AirQualityIndex.UNHEALTHY,
        AirQualityIndex.VERY_UNHEALTHY,
        AirQualityIndex.HAZARDOUS];

        for (let i = 0; i < concentration.length; i++) {
            testCase.concentration = concentration[i];
            spyGetAirQualityData.mockReturnValue(Promise.resolve(testCase));
            const saveRelayBo: AirQualityRelayBo = await airQualityService.saveMonitoringData();
            expect(saveRelayBo.suggestion).toBe(airIndex[i]);
        }
    });

    test("預期資料庫無空氣品質資料時拋錯", async () => {
        await airQualityService.deleteMonitoringData();
        await expect(airQualityService.fetchMonitoringData()).rejects
            .toEqual(errorScript(DataType.AIR_QUALITY));
    });

    test("預期資料庫無天氣監測資料時拋錯", async () => {
        await weatherPredictService.deleteMonitoringData();
        await expect(weatherPredictService.fetchMonitoringData()).rejects
            .toEqual(errorScript(DataType.WEATHER_PREDICT));
    });
});

describe("應用程式整合測試", () => {
    test("預期天氣監測資料是否有正確地儲存到資料庫", async () => {
        const weatherPredictRelayDo: WeatherPredictRelayDo = await controller.dispatch(['', '', 'fetchMonitoringData']);;
        const weatherPredictRelayBo: WeatherPredictRelayBo = await weatherPredictService.fetchMonitoringData();
        expect(weatherPredictRelayDo).toEqual(weatherPredictRelayBo);
    });

    test("預期播放音檔", async () => {
        expect(await controller.dispatch(['', '', 'playDailyReport']));
    });

    test("預期保留天數內的資料會全部刪除", async () => {
        await controller.dispatch(['', '', 'deleteMonitoringData']);
        const startDate: Date = dayjs().add(Number.parseInt(process.env.RESERVE_DAYS), 'd').toDate();
        const endDate: Date = dayjs().toDate();

        const airQualityDto: AirQualityDto = new AirQualityDto();
        airQualityDto.startDate = startDate;
        airQualityDto.endDate = endDate;

        const weatherPredictDto: WeatherPredictDto = new WeatherPredictDto();
        weatherPredictDto.startDate = startDate;
        weatherPredictDto.endDate = endDate;

        expect(await airQualityDao.countDataAmount(airQualityDto)).toBe(0);
        expect(await weatherPredictDao.countDataAmount(weatherPredictDto)).toBe(0);
    });

    test("預期刪檔後播放音檔時拋錯", async () => {
        expect(await controller.dispatch(['', '', 'playDailyReport']));
    });
});