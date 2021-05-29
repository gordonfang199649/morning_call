import Entity from "../model/Entity";

/**
 * MonitoringService 共用服務
 * @author Gordon Fang
 * @date 2021-05-10
 */
export default interface MonitoringService {
  /**
   * 取得政府機構Open API監測數據、儲存到資料庫
   * @param
   * @returns
   */
  saveMonitoringData(): Promise<any>;

  /**
    * 從資料庫撈取政府機構Open API監測數據
    * @param
    * @returns
    */
  fetchMonitoringData(): Promise<any>;

  /**
   * 依資料產生的時間區間刪監測數據
   * @param startDate 起始日期
   * @param endDate 結束日期
   * @returns
   */
  deleteMonitoringData(): Promise<void>;
  
}