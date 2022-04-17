import dayjs, { Dayjs } from 'dayjs';

/**
 * 將來源物件同屬性值複製到目標物件，不同屬性則略過不複製
 * @param target 目標物件
 * @param source 來源物件
 */
export const copyObject = (target: object, source: object): void => {
    Object.keys(source).forEach(key => {
        if (key in target) {
            target[key] = source[key];
        }
    });
}

/**
     * 格式化日期時間為YYYY-MM-DDTHH:mm:ss日期格式
     * @param hour 小時
     * @returns 格式化日期時間
     */
export const formatDateTime = (hour: string): string => {
    let dateTime: Dayjs = dayjs().set('hour', Number.parseInt(hour)).set('minute', 0).set('second', 0);
    // 欲撈取資料起始時間點在排程觸發時間點前，將起始、結束時間各加一天
    // 因OPEN API只保留「未來」天氣預測資料
    if (dateTime.isBefore(dayjs())) {
        dateTime = dateTime.add(1, 'day');
    }
    return dateTime.format('YYYY-MM-DDTHH:mm:ss');
}