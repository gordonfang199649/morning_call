"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AirQualityModel_1 = __importDefault(require("../model/AirQualityModel"));
/**
 * AirQualityDao 空氣品質實體持久層
 * @author Gordon Fang
 * @date 2021-05-10
 */
class AirQualityDao {
    /**
     * 監測數據儲存至資料庫
     * @param airQualityPo 空氣品質實體 Document
     * @returns
     */
    async saveMonitoringData(airQualityPo) {
        try {
            await airQualityPo.save();
        }
        catch (err) {
            console.error(err);
        }
    }
    /**
     * 取得資料庫最新監測數據
     * @param
     * @returns AirQuality 空氣品質實體
     */
    async fetechLatestData() {
        let airQualityPo;
        airQualityPo = await AirQualityModel_1.default.findOne().sort({ '_id': 'desc' }).exec();
        return airQualityPo;
    }
    /**
     * 刪除區間內的資料
     * @param startDate 資料區間起始日期
     * @param endDate 資料區間結束日期
     */
    async deleteDataByDuration(startDate, endDate) {
        const rowNumber = await AirQualityModel_1.default.countDocuments({
            createDate: {
                $gte: startDate,
                $lte: endDate
            }
        }).exec();
        await AirQualityModel_1.default.deleteMany({
            createDate: {
                $gte: startDate,
                $lte: endDate
            }
        }).exec();
        console.log(`deleted ${rowNumber} rows`);
    }
}
exports.default = AirQualityDao;
//# sourceMappingURL=AirQualityDao.js.map