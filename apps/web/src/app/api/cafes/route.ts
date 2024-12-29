import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { CafeData } from "@/interfaces/cafe";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(
  /\\n/g,
  "\n"
);

export async function GET() {
  try {
    // JWT 인증 설정
    const jwt = new JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    // 스프레드시트 문서 로드
    const doc = new GoogleSpreadsheet(SHEET_ID, jwt);
    await doc.loadInfo();

    // '국내카페' 시트 선택
    const sheet = doc.sheetsByTitle["국내카페"];
    if (!sheet) {
      throw new Error("'국내카페' 시트를 찾을 수 없습니다.");
    }

    // 헤더 위치를 4번째 행으로 설정하고 데이터 로드 (5번째 행부터)
    await sheet.loadHeaderRow(4);
    const rows = await sheet.getRows();

    // 데이터 파싱
    const cafes: CafeData[] = rows.map((row) => ({
      name: row.get("이름"),
      englishName: row.get("영어이름"),
      shortAddress: row.get("주소_short"),
      longAddress: row.get("주소_long"),
      category: row.get("분류"),
      naverMapUrl: row.get("네이버지도링크"),
      googleMapUrl: row.get("구글지도링크"),
      minPrice: row.get("아메리카노 or 최소입장료"),
      minStayTime: row.get("최소입장시간"),
      hasVisited: row.get("가봤는가?"),
      isLargeFranchise: row.get("대형프차인가?"),
      socketScore: row.get("콘센트 점수"),
      spaceScore: row.get("넓은 자리 점수"),
      noiseScore: row.get("소음 정도 점수"),
      mealScore: row.get("식사 점수"),
      beautyScore: row.get("예쁨 점수"),
      wifiScore: row.get("와이파이 점수"),
      hasToilet: row.get("화장실 여부"),
      toiletScore: row.get("화장실 청결도 점수"),
      chairScore: row.get("편한 의자 점수"),
      lightScore: row.get("조도점수"),
      hasNonCoffee: row.get("논커피메뉴 있는가?"),
      parking: row.get("주차"),
      note: row.get("비고"),
      closedDays: row.get("휴무요일"),
      openTime: row.get("오픈시간_전체"),
      closeTime: row.get("마감시간_전체"),
      mondayOpen: row.get("오픈시간_월"),
      mondayClose: row.get("마감시간_월"),
      tuesdayOpen: row.get("오픈시간_화"),
      tuesdayClose: row.get("마감시간_화"),
      wednesdayOpen: row.get("오픈시간_수"),
      wednesdayClose: row.get("마감시간_수"),
      thursdayOpen: row.get("오픈시간_목"),
      thursdayClose: row.get("마감시간_목"),
      fridayOpen: row.get("오픈시간_금"),
      fridayClose: row.get("마감시간_금"),
      saturdayOpen: row.get("오픈시간_토"),
      saturdayClose: row.get("마감시간_토"),
      sundayOpen: row.get("오픈시간_일"),
      sundayClose: row.get("마감시간_일"),
    }));

    console.log(rows.slice(0, 10).map((x) => x.toObject()));

    // 빈 데이터 필터링
    const filteredCafes = cafes.filter((cafe) => cafe.name);

    return Response.json({ cafes: filteredCafes });
  } catch (error) {
    console.error("Error fetching cafe data:", error);
    return Response.json(
      { error: "카페 데이터를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
