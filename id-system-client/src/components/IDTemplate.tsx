import React from 'react';

const BASE = import.meta.env.BASE_URL;

interface StudentData {
  firstName: string;
  lastName: string;
  middleInitial: string;
  studentId: string;
  course: string;
  address: string;
  birthDate: string;
  emergencyContact: string;
  emergencyPhone: string;
  photoUrl: string | null;
}

interface IDTemplateProps {
  data: StudentData;
  idRef: React.RefObject<HTMLDivElement | null>;
}

const IDTemplate: React.FC<IDTemplateProps> = ({ data, idRef }) => {
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
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
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
            boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15)'
        }}>
             {/* TESDA NORTE WATERMARK - Enlarged */}
             <div style={{ ...absStyle, top: '10px', left: '-15px', opacity: 0.22, pointerEvents: 'none' }}>
                <img src={`${BASE}logos/tesda-norte-logo.png`} alt="" style={{ width: '135px', objectFit: 'contain' }} />
             </div>

             {/* SCHOOL LOGO & NAME (Inside Blue Area) - Enlarged */}
             <div style={{ ...flexColStyle, alignItems: 'center', marginTop: '12px', padding: '0 8px', position: 'relative', zIndex: 30 }}>
                <img src={`${BASE}logos/school-logo.png`} alt="GESTAAC" style={{ height: '42px', width: '42px', objectFit: 'contain', backgroundColor: '#FFFFFF', borderRadius: '50%', padding: '3px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                <div style={{ ...flexColStyle, alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '8px', fontWeight: 900, color: '#FFFFFF', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '0.1px' }}>Great Enthusiasts of Skills Training Academy</span>
                    <span style={{ fontSize: '7px', fontWeight: 'bold', color: '#BFDBFE', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1 }}>and Assessment Center Inc.</span>
                </div>
             </div>
        </div>

        {/* CIRCULAR PROFILE PHOTO - Overlapping the curve */}
        <div style={{ ...flexColStyle, alignItems: 'center', marginTop: '90px', position: 'relative', zIndex: 20 }}>
            {/* Outer navy/red accent ring (school colors) */}
            <div style={{
                padding: '2.5px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1E3A8A 0%, #DC2626 100%)',
                boxShadow: '0 6px 14px rgba(0,0,0,0.3)'
            }}>
                <div
                    style={{
                        width: '94px',
                        height: '94px',
                        border: '3px solid #FFFFFF',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        backgroundColor: '#F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {data.photoUrl ? (
                        <img
                            src={data.photoUrl}
                            alt="Student"
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'block',
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 'bold', letterSpacing: '0.05em' }}>PHOTO</span>
                    )}
                </div>
            </div>
        </div>

        {/* BODY CONTENT */}
        <div style={{ ...flexColStyle, alignItems: 'center', padding: '12px 10px 0', zIndex: 10 }}>
            <div style={{ fontSize: '13px', fontWeight: 900, color: '#1E3A8A', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1, letterSpacing: '0.02em' }}>
                {data.firstName || 'FIRSTNAME'} {data.middleInitial ? `${data.middleInitial}.` : ''}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#111827', textAlign: 'center', textTransform: 'uppercase', marginTop: '1px', letterSpacing: '0.02em' }}>
                {data.lastName || 'LASTNAME'}
            </div>
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #DC2626, transparent)', marginTop: '5px' }}></div>
        </div>

        {/* COURSE & ID NUMBER */}
        <div style={{ ...flexColStyle, padding: '6px 15px', flex: 1, justifyContent: 'center', zIndex: 10 }}>
            <div style={{ ...flexColStyle, alignItems: 'center', marginBottom: '9px' }}>
                <span style={{ fontSize: '6px', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Course / Program</span>
                <span style={{ fontSize: '8.5px', fontWeight: 900, color: '#1F2937', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1, marginTop: '2px' }}>{data.course || 'DATA ANALYTICS LEVEL III'}</span>
            </div>

            <div style={{ ...flexColStyle, alignItems: 'center', backgroundColor: 'rgba(254, 226, 226, 0.4)', padding: '5px 18px 6px', borderRadius: '4px', border: '1px solid rgba(220, 38, 38, 0.15)', minWidth: '110px' }}>
                <span style={{ fontSize: '6px', fontWeight: 900, color: '#1E3A8A', textTransform: 'uppercase', letterSpacing: '0.12em', lineHeight: 1 }}>Student ID Number</span>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#DC2626', fontFamily: 'monospace', lineHeight: 1.2, letterSpacing: '0.04em', marginTop: '2px' }}>{data.studentId || '2026-0000'}</span>
            </div>
        </div>

        {/* FOOTER SECTION */}
        <div style={{ marginTop: 'auto', position: 'relative', zIndex: 20 }}>
            <div style={{ width: '100%', height: '4px', background: 'linear-gradient(90deg, #1E3A8A 0%, #DC2626 100%)' }}></div>
            <div style={{ backgroundColor: '#F9FAFB', padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '6px', fontWeight: 900, color: '#1F2937', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Official Student Identification Card</span>
            </div>
        </div>

        {/* BODY WATERMARK (Student Group) */}
        <div style={{ ...absStyle, top: '110px', left: 0, right: 0, bottom: '27px', overflow: 'hidden', opacity: 0.08, pointerEvents: 'none', zIndex: 1 }}>
            <img src={`${BASE}logos/student-group-bg.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
      <p style={{ marginTop: '16px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9CA3AF' }}>Portrait Reference Design</p>
    </div>
  );
};

export default IDTemplate;
