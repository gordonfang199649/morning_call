/**
 * MonitoringService 共用服務
 * @author Gordon Fang
 * @date 2021-05-10
 */
export interface MonitoringService {
    /**
     * 取得政府機構Open API監測數據、儲存到資料庫
     * @param
     * @returns
     */
    saveMonitoringData(): any;

    /**
      * 從資料庫撈取政府機構Open API監測數據
      * @param
      * @returns
      */
    fetchMonitoringData(): Promise<any>;
}