import React from 'react';

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
        {/* BACKGROUND BASE (RED) */}
        <div style={{ ...absStyle, top: 0, left: 0, right: 0, height: '145px', backgroundColor: '#DC2626' }}></div>

        {/* CURVED BLUE HEADER - Replicating image.png */}
        <div style={{ 
            ...absStyle, 
            top: 0, 
            left: 0, 
            right: 0, 
            height: '140px', 
            backgroundColor: '#1E3A8A', 
            borderBottomLeftRadius: '50% 30px',
            borderBottomRightRadius: '50% 30px',
            zIndex: 10,
            overflow: 'hidden'
        }}>
             {/* TESDA NORTE WATERMARK - Enlarged */}
             <div style={{ ...absStyle, top: '10px', left: '-15px', opacity: 0.22, pointerEvents: 'none' }}>
                <img src="/logos/tesda-norte-logo.png" alt="" style={{ width: '135px', objectFit: 'contain' }} />
             </div>

             {/* SCHOOL LOGO & NAME (Inside Blue Area) - Enlarged */}
             <div style={{ ...flexColStyle, alignItems: 'center', marginTop: '12px', padding: '0 8px', position: 'relative', zIndex: 30 }}>
                <img src="/logos/school-logo.png" alt="GESTAAC" style={{ height: '42px', width: '42px', objectFit: 'contain', backgroundColor: '#FFFFFF', borderRadius: '50%', padding: '3px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                <div style={{ ...flexColStyle, alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '8px', fontWeight: 900, color: '#FFFFFF', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '0.1px' }}>Great Enthusiasts of Skills Training Academy</span>
                    <span style={{ fontSize: '7px', fontWeight: 'bold', color: '#BFDBFE', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1 }}>and Assessment Center Inc.</span>
                </div>
             </div>
        </div>

        {/* CIRCULAR PROFILE PHOTO - Overlapping the curve */}
        <div style={{ ...flexColStyle, alignItems: 'center', marginTop: '90px', position: 'relative', zIndex: 20 }}>
            <div 
                style={{ 
                    width: '90px', 
                    height: '90px', 
                    border: '4px solid #FFFFFF', 
                    borderRadius: '50%',
                    overflow: 'hidden', 
                    backgroundColor: '#F3F4F6',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {data.photoUrl ? (
                    <img src={data.photoUrl} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 'bold' }}>PHOTO</span>
                )}
            </div>
        </div>

        {/* BODY CONTENT */}
        <div style={{ ...flexColStyle, alignItems: 'center', padding: '10px 10px 0', zIndex: 10 }}>
            <div style={{ fontSize: '13px', fontWeight: 900, color: '#1E3A8A', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1 }}>
                {data.firstName || 'FIRSTNAME'} {data.middleInitial ? `${data.middleInitial}.` : ''}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#111827', textAlign: 'center', textTransform: 'uppercase', marginTop: '1px' }}>
                {data.lastName || 'LASTNAME'}
            </div>
            <div style={{ width: '35px', height: '1.5px', backgroundColor: '#DC2626', marginTop: '4px' }}></div>
        </div>

        {/* COURSE & ID NUMBER */}
        <div style={{ ...flexColStyle, padding: '5px 15px', flex: 1, justifyContent: 'center', zIndex: 10 }}>
            <div style={{ ...flexColStyle, alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '6px', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course / Program</span>
                <span style={{ fontSize: '8px', fontWeight: 900, color: '#1F2937', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1 }}>{data.course || 'DATA ANALYTICS LEVEL III'}</span>
            </div>
            
            <div style={{ ...flexColStyle, alignItems: 'center' }}>
                <span style={{ fontSize: '6px', fontWeight: 900, color: '#1E3A8A', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1 }}>Student ID Number</span>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#DC2626', fontFamily: 'monospace', lineHeight: 1 }}>{data.studentId || '2026-0000'}</span>
            </div>
        </div>

        {/* FOOTER SECTION */}
        <div style={{ marginTop: 'auto', position: 'relative', zIndex: 20 }}>
            <div style={{ width: '100%', height: '3px', backgroundColor: '#1E3A8A' }}></div>
            <div style={{ backgroundColor: '#F9FAFB', padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '6px', fontWeight: 900, color: '#1F2937', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Official Student Identification Card</span>
            </div>
        </div>

        {/* BODY WATERMARK (Student Group) */}
        <div style={{ ...absStyle, top: '110px', left: 0, right: 0, bottom: '27px', overflow: 'hidden', opacity: 0.08, pointerEvents: 'none', zIndex: 1 }}>
            <img src="/logos/student-group-bg.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
      <p style={{ marginTop: '16px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9CA3AF' }}>Portrait Reference Design</p>
    </div>
  );
};

export default IDTemplate;
