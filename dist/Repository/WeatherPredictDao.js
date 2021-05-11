"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WeatherPridictModel_1 = __importDefault(require("../model/WeatherPridictModel"));
/**
 * WeatherPredictDao
 * @author Gordon Fang
 * @date 2021-05-10
 */
class WeatherPredictDao {
    /**
   * 監測數據儲存至資料庫
   * @param weatherPredictPo 天氣預測實體 Document
   * @returns
   */
    async saveMonitoringData(weatherPredictPo) {
        try {
            await weatherPredictPo.save();
            console.log("inserted one row.");
        }
        catch (err) {
            console.error(err);
        }
    }
    /**
   * 取得資料庫最新監測數據
   * @param
   * @returns WeatherPredict 天氣預測實體
   */
    async fetechLatestData() {
        let weatherPredictPo;
        weatherPredictPo = await WeatherPridictModel_1.default.findOne().sort({ '_id': 'desc' }).exec();
        return weatherPredictPo;
    }
}
exports.default = WeatherPredictDao;
//# sourceMappingURL=WeatherPredictDao.js.map