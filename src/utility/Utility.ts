export default class Utility {
    /**
     * 將來源物件同屬性值複製到目標物件，不同屬性則略過不複製
     * @param target 目標物件
     * @param source 來源物件
     */
    public static copyObject(target: object, source: object) {
        Object.keys(source).forEach(key => {
            if(key in target){
                target[key] = source[key]
            }
        });
    }
}
