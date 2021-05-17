enum AirQualityIndex {
    GOOD = '空氣品質為良好，污染程度低或無污染。',
    MODERATE = '空氣品質普通；但對非常少數之極敏感族群產生輕微影響。',
    SENSITIVE = '空氣污染物可能會對敏感族群的健康造成影響，但是對一般大眾的影響不明顯。',
    UNHEALTHY = '對所有人的健康開始產生影響，對於敏感族群可能產生較嚴重的健康影響。',
    VERY_UNHEALTHY = '健康警報：所有人都可能產生較嚴重的健康影響。',
    HAZARDOUS = '健康威脅達到緊急，所有人都可能受到影響。'
}

export default AirQualityIndex;