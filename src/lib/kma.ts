import axios from "axios";

export interface weather {
  temprature: number;
  wind: string;
  speed: number;
  weather: number;
}

export enum weatherCode {
  clear = 0,
  rain = 1,
  rain_snow = 2,
  snow = 3,
  shower = 4,
  drizzle = 5,
  drizzle_snow = 6,
  snow_flurry = 7,
}

export enum xyConvertCode {
  grid = "toXY",
  else = "",
}

export default class KmaClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * 현재 날씨 정보를  제공합니다.
   *
   * @returns {Promise<weather>} 날씨 정보를 반환합니다.
   */
  async getWeatherInfo(latitude: number, longitude: number): Promise<weather> {
    const date = new Date();
    const response = await axios.get(
      "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst",
      {
        params: {
          serviceKey: this.apiKey,
          base_date: `${date.getFullYear()}${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`,
          base_time: `${(date.getHours() - 1).toString().padStart(2, "0")}00`,
          dataType: "JSON",
          pageNo: 1,
          numOfRows: 1000,
          nx: latitude,
          ny: longitude,
        },
      }
    );

    console.log(response.data);

    let weather: weather = {
      temprature: 0,
      wind: "",
      speed: 0,
      weather: 0,
    };

    response.data.response.body.items.item.map(
      (a: { category: string; obsrValue: string }) => {
        if (a.category === "T1H") {
          weather.temprature = parseInt(a.obsrValue);
        } else if (a.category === "VEC") {
          weather.wind = this.parseDirection(parseInt(a.obsrValue));
        } else if (a.category === "WSD") {
          weather.speed = parseInt(a.obsrValue);
        } else if (a.category === "PTY") {
          weather.weather = parseInt(a.obsrValue);
        }
      }
    );

    return weather;
  }

  /**
   * 풍향 파서 함수
   *
   * @param direction 풍향을 16방위 deg 형태로 입력받습니다.
   * @returns {string} 북풍, 북서풍 등 문자열로 파싱해 리턴합니다.
   */
  parseDirection(direction: number): string {
    if (direction >= 337.5 || direction < 22.5) {
      return "북풍";
    } else if (direction >= 22.5 && direction < 67.5) {
      return "북동풍";
    } else if (direction >= 67.5 && direction < 112.5) {
      return "동풍";
    } else if (direction >= 112.5 && direction < 157.5) {
      return "남동풍";
    } else if (direction >= 157.5 && direction < 202.5) {
      return "남풍";
    } else if (direction >= 202.5 && direction < 247.5) {
      return "남서풍";
    } else if (direction >= 247.5 && direction < 292.5) {
      return "서풍";
    } else if (direction >= 292.5 && direction < 337.5) {
      return "북서풍";
    }

    return "올바른 범위 내에서 입력해 주세요.";
  }

  /**
   * 좌표를 기상청 격자 좌표로 변환하는 함수입니다.
   * @param {string} code 변환 유형 ('toXY' 또는 다른 유형)
   * @param {number} v1 위도 또는 격자 x 좌표
   * @param {number} v2 경도 또는 격자 y 좌표
   * @returns {object} 변환된 격자 좌표 또는 위경도 좌표
   */
  dfs_xy_conv(
    code: xyConvertCode,
    v1: number,
    v2: number
  ): { x: number; y: number } {
    const DEGRAD = Math.PI / 180.0;
    const RADDEG = 180.0 / Math.PI;

    const re = 6371.00877 / 5.0; // 지구 반경(km) / 격자 간격
    const slat1 = 30.0 * DEGRAD; // 표준 위도 1
    const slat2 = 60.0 * DEGRAD; // 표준 위도 2
    const olon = 126.0 * DEGRAD; // 기준점 경도
    const olat = 38.0 * DEGRAD; // 기준점 위도

    let sn =
      Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
      Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = (re * sf) / Math.pow(ro, sn);
    let rs = { x: 0, y: 0 };
    if (code === "toXY") {
      rs.x = v1;
      rs.y = v2;
      let ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
      ra = (re * sf) / Math.pow(ra, sn);
      let theta = v2 * DEGRAD - olon;
      if (theta > Math.PI) theta -= 2.0 * Math.PI;
      if (theta < -Math.PI) theta += 2.0 * Math.PI;
      theta *= sn;
      rs.x = Math.floor(ra * Math.sin(theta) + 42.5 + 0.5); // XO 수정
      rs.y = Math.floor(ro - ra * Math.cos(theta) + 135.0 + 0.5); // YO 수정
    } else {
      rs.x = v1;
      rs.y = v2;
      let xn = v1 - 42.5; // XO 수정
      let yn = ro - v2 + 135.0; // YO 수정
      let ra = Math.sqrt(xn * xn + yn * yn);
      if (sn < 0.0) ra = -ra;
      let alat = Math.pow((re * sf) / ra, 1.0 / sn);
      alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

      let theta;
      if (Math.abs(xn) <= 0.0) {
        theta = 0.0;
      } else {
        if (Math.abs(yn) <= 0.0) {
          theta = Math.PI * 0.5;
          if (xn < 0.0) theta = -theta;
        } else {
          theta = Math.atan2(xn, yn);
        }
      }
      let alon = theta / sn + olon;
      rs.x = alat * RADDEG;
      rs.y = alon * RADDEG;
    }
    return rs;
  }

  /**
   * Weathercode 파서 함수
   *
   * @param weatherCode 날씨 코드를 입력받습니다.
   * @returns {string} 파싱한 날씨를 문자열로 변환합니다.
   */
  parseWeatherCode(weatherCode: number): string {
    switch (weatherCode) {
      case 0:
        return "맑음";
      case 1:
        return "비";
      case 2:
        return "비/눈";
      case 3:
        return "눈";
      case 4:
        return "소나기";
      case 5:
        return "이슬비";
      case 6:
        return "이슬비/눈";
      case 7:
        return "눈날림";
      default:
        return "알 수 없음";
    }
  }
}
