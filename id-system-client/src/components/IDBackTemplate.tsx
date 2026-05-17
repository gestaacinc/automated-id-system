import React from 'react';

const BASE = import.meta.env.BASE_URL;

interface IDBackTemplateProps {
  data: {
    address: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  idRef: React.RefObject<HTMLDivElement | null>;
}

const IDBackTemplate: React.FC<IDBackTemplateProps> = ({ data, idRef }) => {
  const flexColStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' };
  const absStyle: React.CSSProperties = { position: 'absolute' };

  return (
    <div style={{ ...flexColStyle, alignItems: 'center', padding: '16px' }}>
      <div 
        ref={idRef}
        spellCheck="false"
        style={{ 
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            width: '204px',
            height: '324px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            border: '1px solid #D1D5DB',
            borderRadius: '10px',
            fontFamily: 'sans-serif',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '12px'
        }}
      >
        {/* BACKGROUND BASE (RED GRADIENT) */}
        <div style={{ ...absStyle, top: 0, left: 0, right: 0, height: '145px', background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)' }}></div>

        {/* CURVED BLUE HEADER */}
        <div style={{
            ...absStyle,
            top: 0,
            left: 0,
            right: 0,
            height: '140px',
            background: 'linear-gradient(160deg, #1E3A8A 0%, #1E40AF 60%, #1D4ED8 100%)',
            borderBottomLeftRadius: '50% 30px',
            borderBottomRightRadius: '50% 30px',
            zIndex: 10,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '10px',
            boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15)'
        }}>
             {/* STUDENT GROUP WATERMARK IN HEADER */}
             <div style={{ ...absStyle, top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15, pointerEvents: 'none', zIndex: 5 }}>
                <img src={`${BASE}logos/student-group-bg.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>

             {/* PROUD TESDA SCHOLAR LOGO/TEXT AREA */}
             <div style={{ position: 'relative', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* TESDA LOGO WITH WHITE CIRCULAR BACKGROUND */}
             <div style={{ backgroundColor: '#FFFFFF', padding: '5px', borderRadius: '50%', marginBottom: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={`${BASE}logos/tesda-logo.png`} alt="TESDA" style={{ height: '30px', width: '30px', objectFit: 'contain' }} />
             </div>
             <span style={{ fontSize: '11px', fontWeight: 300, color: '#FFFFFF', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1, fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif' }}>PROUD</span>
             <span style={{ fontSize: '14px', fontWeight: 900, color: '#FFFFFF', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1, fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif' }}>TESDA</span>
             <span style={{ fontSize: '11px', fontWeight: 300, color: '#FFFFFF', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1, fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif' }}>SCHOLAR</span>
             </div>
        </div>

        {/* BODY CONTENT AREA */}
        <div style={{ position: 'relative', zIndex: 20, display: 'flex', flexDirection: 'column', height: '100%', marginTop: '135px', paddingBottom: '10px' }}>
            
            {/* CERTIFICATION TEXT */}
            <div style={{ marginBottom: '6px', padding: '0 5px' }}>
                <p style={{ fontSize: '6px', lineHeight: '1.3', textAlign: 'justify', color: '#374151', margin: '0 0 4px 0' }}>
                    This is to certify that the person whose name and picture appear on the front is a bona fide trainee of <strong>Great Enthusiasts of Skills Training Academy and Assessment Center Inc.</strong>
                </p>
                <p style={{ fontSize: '6px', lineHeight: '1.3', textAlign: 'justify', color: '#374151', margin: 0 }}>
                    This card is non-transferable and must be worn at all times while within the school premises.
                </p>
            </div>

            {/* EMERGENCY INFORMATION */}
            <div style={{ padding: '5px', backgroundColor: '#F9FAFB', borderRadius: '4px', border: '1px solid #E5E7EB', marginBottom: '6px' }}>
                <div style={{ ...flexColStyle, gap: '2px' }}>
                    <div style={flexColStyle}>
                        <span style={{ fontSize: '5px', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase' }}>Home Address:</span>
                        <span style={{ fontSize: '6px', fontWeight: 900, color: '#1F2937', lineHeight: 1.1 }}>{data.address || '---'}</span>
                    </div>
                    <div style={flexColStyle}>
                        <span style={{ fontSize: '5px', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase' }}>IN CASE OF EMERGENCY:</span>
                        <span style={{ fontSize: '6px', fontWeight: 900, color: '#111827', textTransform: 'uppercase' }}>{data.emergencyContact || '---'} | {data.emergencyPhone || '---'}</span>
                    </div>
                </div>
            </div>

            {/* ADMINISTRATOR SIGNATURE & LOGO */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '2px' }}>
                <div style={{ width: '100%', height: '30px', borderBottom: '1px solid #000000', marginBottom: '1px', position: 'relative' }}>
                     <img
                        src={`${BASE}logos/signature.png`}
                        alt="Signature"
                        style={{ 
                            position: 'absolute', 
                            bottom: '-12px', 
                            left: '50%', 
                            transform: 'translateX(-50%)', 
                            height: '55px', 
                            width: 'auto',
                            objectFit: 'contain',
                            zIndex: 25,
                            pointerEvents: 'none'
                        }} 
                     />
                     <span style={{ position: 'absolute', bottom: '1px', left: '50%', transform: 'translateX(-50%)', fontSize: '8.5px', fontWeight: 900, color: '#1E3A8A', whiteSpace: 'nowrap', zIndex: 10 }}>KATHERINE DEVERA BAUTISTA</span>
                </div>
                <span style={{ fontSize: '6px', fontWeight: 900, textTransform: 'uppercase', color: '#6B7280' }}>School Administrator</span>
                
                {/* TESDA KAYANG KAYA LOGO */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
                     <img src={`${BASE}logos/tesda-kayang-kaya.png`} alt="TESDA" style={{ height: '20px', objectFit: 'contain' }} />
                </div>
            </div>
        </div>

        {/* SIDE ACCENTS */}
        <div style={{ ...absStyle, left: 0, top: '145px', bottom: 0, width: '4px', background: 'linear-gradient(180deg, #1E3A8A 0%, #1D4ED8 100%)' }}></div>
        <div style={{ ...absStyle, right: 0, top: '145px', bottom: 0, width: '4px', background: 'linear-gradient(180deg, #DC2626 0%, #B91C1C 100%)' }}></div>
      </div>
      <p style={{ marginTop: '16px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9CA3AF' }}>Portrait Back Design</p>
    </div>
  );
};

export default IDBackTemplate;
