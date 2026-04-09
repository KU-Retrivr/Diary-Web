const KMA_BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';
const KMA_CURRENT_WEATHER_PATH = '/getUltraSrtNcst';

function getBaseDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - 40);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');

  return {
    baseDate: `${year}${month}${day}`,
    baseTime: `${hours}00`,
  };
}

function latLonToGrid(lat, lon) {
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;

  const DEGRAD = Math.PI / 180.0;
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;

  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + (lat * DEGRAD) * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);

  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return { nx: x, ny: y };
}

function parseWeather(items) {
  const values = items.reduce((accumulator, item) => {
    accumulator[item.category] = item.obsrValue;
    return accumulator;
  }, {});

  const temperature = values.T1H ? `${values.T1H}°C` : '-';
  const pty = values.PTY || '0';

  let condition = '맑음';
  if (pty === '1') condition = '비';
  if (pty === '2') condition = '비/눈';
  if (pty === '3') condition = '눈';
  if (pty === '5') condition = '빗방울';
  if (pty === '6') condition = '빗방울/눈날림';
  if (pty === '7') condition = '눈날림';

  return { temperature, condition };
}

export async function fetchKmaCurrentWeather(lat, lon) {
  const serviceKey = import.meta.env.VITE_KMA_SERVICE_KEY;
  if (!serviceKey) {
    throw new Error('VITE_KMA_SERVICE_KEY 환경변수가 필요합니다.');
  }

  const { nx, ny } = latLonToGrid(lat, lon);
  const { baseDate, baseTime } = getBaseDateTime();

  const params = new URLSearchParams({
    serviceKey,
    pageNo: '1',
    numOfRows: '100',
    dataType: 'JSON',
    base_date: baseDate,
    base_time: baseTime,
    nx: String(nx),
    ny: String(ny),
  });

  const response = await fetch(
    `${KMA_BASE_URL}${KMA_CURRENT_WEATHER_PATH}?${params.toString()}`,
  );
  if (!response.ok) {
    throw new Error('기상청 API 요청에 실패했습니다.');
  }

  const data = await response.json();
  const items = data?.response?.body?.items?.item || [];
  if (!items.length) {
    throw new Error('기상청 날씨 데이터를 찾지 못했습니다.');
  }

  const parsed = parseWeather(items);
  const location = `위도 ${lat.toFixed(3)}, 경도 ${lon.toFixed(3)}`;

  return {
    location,
    ...parsed,
  };
}
