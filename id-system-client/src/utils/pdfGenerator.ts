import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generateAndSavePDF = async (
  frontElement: HTMLElement,
  backElement: HTMLElement,
  studentName: string,
  studentId: string
): Promise<{ success: boolean; path?: string; error?: string }> => {
  try {
    const captureOptions = {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
      width: 204,
      height: 324,
      onclone: (clonedDoc: Document) => {
        const styleTags = clonedDoc.getElementsByTagName('style');
        for (let i = 0; i < styleTags.length; i++) {
          let css = styleTags[i].innerHTML;
          if (css.includes('oklch')) {
            styleTags[i].innerHTML = css.replace(/oklch\([^)]+\)/g, '#000000');
          }
        }
      }
    };

    const frontCanvas = await html2canvas(frontElement, captureOptions);
    const backCanvas = await html2canvas(backElement, captureOptions);

    const frontImg = frontCanvas.toDataURL('image/png');
    const backImg = backCanvas.toDataURL('image/png');

    // CR80 Portrait dimensions in mm
    const mmWidth = 53.98;
    const mmHeight = 85.6;

    const cardWidth = mmWidth * 2.83465;
    const cardHeight = mmHeight * 2.83465;
    const margin = 20;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    });

    const startX = 20;
    const startY = 20;

    pdf.addImage(frontImg, 'PNG', startX, startY, cardWidth, cardHeight);
    pdf.addImage(backImg, 'PNG', startX + cardWidth + margin, startY, cardWidth, cardHeight);

    const fileName = `${studentId}_${studentName.replace(/\s+/g, '_')}.pdf`;

    pdf.save(fileName);

    return { success: true, path: fileName };
  } catch (error: any) {
    console.error('PDF Generation Error:', error);
    return { success: false, error: error.message };
  }
};
