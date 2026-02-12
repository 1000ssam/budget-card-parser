import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '사업관리카드 파서 - 학교 예산 관리 도구';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafafa',
          backgroundImage: 'linear-gradient(to bottom right, #fafafa, #f5f5f5)',
          position: 'relative',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            opacity: 0.3,
          }}
        >
          <div style={{ flex: 1, borderRight: '1px solid #e5e5e5' }} />
          <div style={{ flex: 1, borderRight: '1px solid #e5e5e5' }} />
          <div style={{ flex: 1, borderRight: '1px solid #e5e5e5' }} />
          <div style={{ flex: 1 }} />
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            border: '2px solid #e5e5e5',
            borderRadius: '18px',
            padding: '8px 24px',
            fontSize: '14px',
            color: '#525252',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            marginBottom: '40px',
          }}
        >
          학교 예산 관리 도구
        </div>

        {/* Table visualization */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            marginBottom: '60px',
          }}
        >
          {/* Before table */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              opacity: 0.6,
            }}
          >
            <div
              style={{
                width: '200px',
                height: '40px',
                backgroundColor: '#D2886F',
                opacity: 0.3,
                borderRadius: '6px',
              }}
            />
            <div
              style={{
                width: '200px',
                height: '30px',
                backgroundColor: '#171717',
                opacity: 0.1,
                borderRadius: '4px',
              }}
            />
            <div
              style={{
                width: '200px',
                height: '30px',
                backgroundColor: '#171717',
                opacity: 0.1,
                borderRadius: '4px',
              }}
            />
          </div>

          {/* Arrow */}
          <div
            style={{
              fontSize: '48px',
              color: '#D2886F',
            }}
          >
            →
          </div>

          {/* After table */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '280px',
                height: '40px',
                backgroundColor: '#D2886F',
                opacity: 0.3,
                borderRadius: '6px',
              }}
            />
            <div
              style={{
                width: '280px',
                height: '30px',
                backgroundColor: '#171717',
                opacity: 0.1,
                borderRadius: '4px',
              }}
            />
            <div
              style={{
                width: '280px',
                height: '30px',
                backgroundColor: '#171717',
                opacity: 0.1,
                borderRadius: '4px',
              }}
            />
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 300,
            color: '#171717',
            letterSpacing: '-0.04em',
            marginBottom: '20px',
          }}
        >
          사업관리카드 파서
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '24px',
            fontWeight: 300,
            color: '#525252',
            letterSpacing: '-0.02em',
          }}
        >
          들여쓰기로 병합된 엑셀 파일을 정규화된 테이블로 변환
        </div>

        {/* Footer badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#D2886F',
            opacity: 0.2,
            borderRadius: '16px',
            padding: '8px 24px',
            fontSize: '13px',
            fontWeight: 400,
            color: '#D2886F',
          }}
        >
          1000쌤
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
