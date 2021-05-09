"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AirQualityServiceImpl_1 = __importDefault(require("./Service/AirQualityServiceImpl"));
const AirQualityDao_1 = __importDefault(require("./Repository/AirQualityDao"));
const airQualityService = new AirQualityServiceImpl_1.default(new AirQualityDao_1.default());
// console.log(airQualityService.fetchMonitoringData(new ObjectId("609563beb5d55f70356e06ea")));
// airQualityService.saveEPAMonitoringData();
console.log(airQualityService.fetchMonitoringData());
// mongod --dbpath /Users/gordonfang/Documents/mongodb
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
// dayjs.extend(utc);
// dayjs.extend(timezone);
// '2021/5/9 下午 02:00:00'
// console.log(dayjs('2021-05-09 08:12:53.012Z').format('YYYY-MM-DD HH:mm:ss'));
// console.log(dayjs('2021/5/9 下午 02:00:00').tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'));
//# sourceMappingURL=test.js.map