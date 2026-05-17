import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import type { StudentData } from '../App';

const BASE = import.meta.env.BASE_URL;

interface IDBackTemplateProps {
  data: StudentData;
  idRef: React.RefObject<HTMLDivElement | null>;
}

const formatDate = (iso: string): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return iso;
  }
};

const IDBackTemplate: React.FC<IDBackTemplateProps> = ({ data, idRef }) => {
  const flexColStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' };
  const absStyle: React.CSSProperties = { position: 'absolute' };

  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const fullName = `${data.firstName} ${data.middleInitial ? data.middleInitial + '. ' : ''}${data.lastName}`.trim();
    const payload =
      `GESTAAC STUDENT ID\n` +
      `ID: ${data.studentId}\n` +
      `Name: ${fullName || '—'}\n` +
      `Course: ${data.course || '—'}\n` +
      `Issued: ${data.issueDate}\n` +
      `Valid: ${data.validityDate}`;
    QRCode.toDataURL(payload, {
      width: 200,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#1E3A8A', light: '#FFFFFF' },
    })
      .then(setQrUrl)
      .catch(() => setQrUrl(''));
  }, [data.studentId, data.firstName, data.lastName, data.middleInitial, data.course, data.issueDate, data.validityDate]);

  const labelStyle: React.CSSProperties = {
    fontSize: '5px',
    fontWeight: 'bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };
  const valueStyle: React.CSSProperties = {
    fontSize: '6.5px',
    fontWeight: 900,
    color: '#1F2937',
    lineHeight: 1.1,
  };

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
          padding: '12px',
        }}
      >
        {/* BACKGROUND BASE (RED GRADIENT) */}
        <div style={{ ...absStyle, top: 0, left: 0, right: 0, height: '145px', background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)' }}></div>

        {/* CURVED BLUE HEADER */}
        <div
          style={{
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
            boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15)',
          }}
        >
          {/* STUDENT GROUP WATERMARK IN HEADER */}
          <div style={{ ...absStyle, top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15, pointerEvents: 'none', zIndex: 5 }}>
            <img src={`${BASE}logos/student-group-bg.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* PROUD TESDA SCHOLAR */}
          <div style={{ position: 'relative', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '5px', borderRadius: '50%', marginBottom: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={`${BASE}logos/tesda-logo.png`} alt="TESDA" style={{ height: '30px', width: '30px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 300, color: '#FFFFFF', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1, fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif' }}>PROUD</span>
            <span style={{ fontSize: '14px', fontWeight: 900, color: '#FFFFFF', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1, fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif' }}>TESDA</span>
            <span style={{ fontSize: '11px', fontWeight: 300, color: '#FFFFFF', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1, fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif' }}>SCHOLAR</span>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div style={{ position: 'relative', zIndex: 20, display: 'flex', flexDirection: 'column', height: '100%', marginTop: '135px', paddingBottom: '4px' }}>

          {/* DIAGONAL SECURITY WATERMARK (HTML-based for html2canvas compatibility) */}
          <div style={{ ...absStyle, top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0, opacity: 0.07 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  whiteSpace: 'nowrap',
                  transform: 'rotate(-28deg)',
                  transformOrigin: 'left center',
                  fontSize: '9px',
                  fontWeight: 900,
                  color: '#1E3A8A',
                  letterSpacing: '0.5px',
                  top: `${i * 22 - 30}px`,
                  left: '-40px',
                }}
              >
                GESTAAC&nbsp;•&nbsp;VERIFIED&nbsp;&nbsp;&nbsp;GESTAAC&nbsp;•&nbsp;VERIFIED&nbsp;&nbsp;&nbsp;GESTAAC&nbsp;•&nbsp;VERIFIED&nbsp;&nbsp;&nbsp;GESTAAC&nbsp;•&nbsp;VERIFIED
              </div>
            ))}
          </div>

          {/* CERTIFICATION TEXT (compact) */}
          <div style={{ marginBottom: '4px', padding: '0 2px' }}>
            <p style={{ fontSize: '5.5px', lineHeight: '1.3', textAlign: 'justify', color: '#374151', margin: 0 }}>
              This is to certify that the person whose name and picture appear on the front is a bona fide trainee of <strong>Great Enthusiasts of Skills Training Academy and Assessment Center Inc.</strong> This card is non-transferable and must be worn at all times within school premises.
            </p>
          </div>

          {/* PERSONAL INFO CARD */}
          <div style={{ padding: '4px 6px', backgroundColor: 'rgba(249, 250, 251, 0.92)', borderRadius: '4px', border: '1px solid #E5E7EB', marginBottom: '4px' }}>
            <div style={{ ...flexColStyle, gap: '3px' }}>
              <div style={flexColStyle}>
                <span style={labelStyle}>Home Address</span>
                <span style={valueStyle}>{data.address || '—'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '6px' }}>
                <div style={flexColStyle}>
                  <span style={labelStyle}>Date of Birth</span>
                  <span style={valueStyle}>{formatDate(data.birthDate)}</span>
                </div>
                <div style={flexColStyle}>
                  <span style={labelStyle}>Blood Type</span>
                  <span style={{ ...valueStyle, color: '#DC2626' }}>{data.bloodType || '—'}</span>
                </div>
              </div>
              <div style={flexColStyle}>
                <span style={labelStyle}>In Case of Emergency</span>
                <span style={{ ...valueStyle, textTransform: 'uppercase' }}>
                  {data.emergencyContact || '—'} {data.emergencyPhone ? `• ${data.emergencyPhone}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* ISSUE & VALIDITY DATES */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', marginBottom: '4px' }}>
            <div style={flexColStyle}>
              <span style={{ ...labelStyle, fontSize: '4.5px' }}>Issued</span>
              <span style={{ fontSize: '6px', fontWeight: 900, color: '#1E3A8A' }}>{formatDate(data.issueDate)}</span>
            </div>
            <div style={{ ...flexColStyle, alignItems: 'flex-end' }}>
              <span style={{ ...labelStyle, fontSize: '4.5px' }}>Valid Until</span>
              <span style={{ fontSize: '6px', fontWeight: 900, color: '#DC2626' }}>{formatDate(data.validityDate)}</span>
            </div>
          </div>

          {/* QR CODE + SIGNATURE */}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
            {/* QR Code */}
            <div style={{ ...flexColStyle, alignItems: 'center', flexShrink: 0 }}>
              {qrUrl ? (
                <img src={qrUrl} alt="QR" style={{ width: '40px', height: '40px', border: '1px solid #E5E7EB', borderRadius: '2px', backgroundColor: '#FFFFFF' }} />
              ) : (
                <div style={{ width: '40px', height: '40px', border: '1px dashed #D1D5DB', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                  <span style={{ fontSize: '5px', color: '#9CA3AF' }}>QR</span>
                </div>
              )}
              <span style={{ fontSize: '4.5px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '1px' }}>Scan to Verify</span>
            </div>

            {/* Signature */}
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{ position: 'relative', height: '36px', borderBottom: '1px solid #000000' }}>
                <img
                  src={`${BASE}logos/signature.png`}
                  alt="Signature"
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    height: '42px',
                    width: 'auto',
                    objectFit: 'contain',
                    zIndex: 25,
                    pointerEvents: 'none',
                  }}
                />
                <span style={{ position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)', fontSize: '7.5px', fontWeight: 900, color: '#1E3A8A', whiteSpace: 'nowrap', zIndex: 10 }}>KATHERINE D. BAUTISTA</span>
              </div>
              <span style={{ display: 'block', textAlign: 'center', fontSize: '5px', fontWeight: 900, textTransform: 'uppercase', color: '#6B7280', marginTop: '1px', letterSpacing: '0.05em' }}>School Administrator</span>
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
