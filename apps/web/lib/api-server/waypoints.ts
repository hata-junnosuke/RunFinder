/**
 * 出発地点と指定距離からウェイポイント（中間経由地点）を生成する。
 * distance_km / (2π) を半径として、ランダムな角度で3点を配置。
 */
export function generateWaypoints(
  lat: number,
  lng: number,
  distanceKm: number,
): { lat: number; lng: number }[] {
  const radiusKm = distanceKm / (2 * Math.PI)

  // ランダムな開始角度
  const baseAngle = Math.random() * 360

  // 3つのウェイポイントを均等+ランダムに配置
  const angles = [
    baseAngle + 60 + Math.random() * 60,   // 60〜120度
    baseAngle + 150 + Math.random() * 60,  // 150〜210度
    baseAngle + 240 + Math.random() * 60,  // 240〜300度
  ]

  return angles.map((angleDeg) => {
    const angleRad = (angleDeg * Math.PI) / 180
    // 1度あたり約111km（緯度方向）
    const dLat = (radiusKm * Math.cos(angleRad)) / 111
    const dLng = (radiusKm * Math.sin(angleRad)) / (111 * Math.cos((lat * Math.PI) / 180))
    return {
      lat: lat + dLat,
      lng: lng + dLng,
    }
  })
}
