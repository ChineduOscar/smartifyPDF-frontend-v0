import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const downloadQuizResult = async ({
  documentName,
  score,
  total,
  percentage,
  userName = 'Participant',
}: {
  documentName: string;
  score: number;
  total: number;
  percentage: number;
  userName?: string;
}) => {
  // Create a certificate-sized document (11" x 8.5" landscape)
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([792, 612]); // Letter size landscape

  const { width, height } = page.getSize();

  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Color palette
  const colors = {
    primary: rgb(0.1, 0.2, 0.5), // Deep blue
    secondary: rgb(0.1, 0.6, 0.2), // primary
    accent: rgb(0.2, 0.4, 0.7), // Medium blue
    text: rgb(0.2, 0.2, 0.2), // Dark gray
    lightText: rgb(0.4, 0.4, 0.4), // Light gray
    success: rgb(0.1, 0.6, 0.2), // Green
    background: rgb(0.98, 0.98, 0.98), // Off white
  };

  // Helper function to draw text with better positioning
  const drawText = (
    text: string,
    x: number,
    y: number,
    size: number,
    color = colors.text,
    font = regularFont,
    alignment: 'left' | 'center' | 'right' = 'left'
  ) => {
    let textX = x;
    if (alignment === 'center') {
      const textWidth = font.widthOfTextAtSize(text, size);
      textX = x - textWidth / 2;
    } else if (alignment === 'right') {
      const textWidth = font.widthOfTextAtSize(text, size);
      textX = x - textWidth;
    }

    page.drawText(text, {
      x: textX,
      y,
      size,
      font,
      color,
    });
  };

  // Draw background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: colors.background,
  });

  // Draw decorative border
  const borderWidth = 8;
  const margin = 20;

  // Outer border (gold)
  page.drawRectangle({
    x: margin,
    y: margin,
    width: width - 2 * margin,
    height: height - 2 * margin,
    borderColor: colors.secondary,
    borderWidth: borderWidth,
    color: rgb(1, 1, 1), // White interior
  });

  // Inner border (blue)
  page.drawRectangle({
    x: margin + 15,
    y: margin + 15,
    width: width - 2 * (margin + 15),
    height: height - 2 * (margin + 15),
    borderColor: colors.primary,
    borderWidth: 2,
  });

  // Draw corner decorations
  const cornerSize = 40;
  const corners = [
    { x: margin + 25, y: height - margin - 25 }, // Top left
    { x: width - margin - 25, y: height - margin - 25 }, // Top right
    { x: margin + 25, y: margin + 25 }, // Bottom left
    { x: width - margin - 25, y: margin + 25 }, // Bottom right
  ];

  corners.forEach((corner) => {
    // Draw decorative corner elements
    page.drawRectangle({
      x: corner.x - cornerSize / 2,
      y: corner.y - 2,
      width: cornerSize,
      height: 4,
      color: colors.secondary,
    });
    page.drawRectangle({
      x: corner.x - 2,
      y: corner.y - cornerSize / 2,
      width: 4,
      height: cornerSize,
      color: colors.secondary,
    });
  });

  // Certificate content
  const centerX = width / 2;

  // Header
  drawText(
    'CERTIFICATE OF COMPLETION',
    centerX,
    height - 100,
    32,
    colors.primary,
    timesBoldFont,
    'center'
  );

  // Decorative line under header
  page.drawRectangle({
    x: centerX - 150,
    y: height - 115,
    width: 300,
    height: 2,
    color: colors.secondary,
  });

  // Subheading
  drawText(
    'This is to certify that',
    centerX,
    height - 160,
    16,
    colors.text,
    timesFont,
    'center'
  );

  // Participant name (styled prominently)
  drawText(
    userName,
    centerX,
    height - 210,
    36,
    colors.primary,
    timesBoldFont,
    'center'
  );

  // Underline for name
  const nameWidth = timesBoldFont.widthOfTextAtSize(userName, 36);
  page.drawRectangle({
    x: centerX - nameWidth / 2,
    y: height - 220,
    width: nameWidth,
    height: 1,
    color: colors.secondary,
  });

  // Achievement text
  drawText(
    'has successfully completed the quiz',
    centerX,
    height - 260,
    16,
    colors.text,
    timesFont,
    'center'
  );

  // Quiz name (in quotes, styled)
  const quizTitle = `"${documentName}"`;
  drawText(
    quizTitle,
    centerX,
    height - 300,
    20,
    colors.accent,
    timesBoldFont,
    'center'
  );

  // Performance message based on score
  let performanceLevel = '';
  let performanceColor = colors.text;

  if (percentage >= 90) {
    performanceLevel = 'with OUTSTANDING EXCELLENCE';
    performanceColor = colors.success;
  } else if (percentage >= 80) {
    performanceLevel = 'with HIGH DISTINCTION';
    performanceColor = colors.success;
  } else if (percentage >= 70) {
    performanceLevel = 'with MERIT';
    performanceColor = colors.accent;
  } else if (percentage >= 60) {
    performanceLevel = 'with SATISFACTORY COMPLETION';
    performanceColor = colors.text;
  } else {
    performanceLevel = 'showing DEDICATION and EFFORT';
    performanceColor = colors.text;
  }

  drawText(
    performanceLevel,
    centerX,
    height - 340,
    18,
    performanceColor,
    boldFont,
    'center'
  );

  const scoreBoxY = height - 420;
  const scoreBoxHeight = 90;
  const scoreBoxWidth = 360;

  page.drawRectangle({
    x: centerX - scoreBoxWidth / 2,
    y: scoreBoxY - scoreBoxHeight / 2,
    width: scoreBoxWidth,
    height: scoreBoxHeight,
    color: rgb(0.96, 0.98, 0.96), // lighter background
    borderColor: colors.primary,
    borderWidth: 2,
  });

  // Text: FINAL SCORE
  drawText(
    'FINAL SCORE',
    centerX,
    scoreBoxY + 28, // moved up
    18,
    colors.text,
    boldFont,
    'center'
  );

  // Text: Correct answers
  drawText(
    `${score} out of ${total} questions correct`,
    centerX,
    scoreBoxY + 5,
    20,
    colors.primary,
    boldFont,
    'center'
  );

  // Text: Percentage
  drawText(
    `${percentage}% Achievement`,
    centerX,
    scoreBoxY - 25,
    22,
    colors.success,
    timesBoldFont,
    'center'
  );

  // Date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  drawText(
    `Completed on: ${currentDate}`,
    centerX,
    height - 480,
    14,
    colors.lightText,
    regularFont,
    'center'
  );

  // Footer section
  const footerY = 80;

  // Authority signature line
  drawText(
    'SmartifyPDF',
    centerX,
    footerY,
    16,
    colors.primary,
    boldFont,
    'center'
  );

  // Signature line
  page.drawRectangle({
    x: centerX - 100,
    y: footerY - 15,
    width: 200,
    height: 1,
    color: colors.lightText,
  });

  drawText(
    'Digital Certificate Authority',
    centerX,
    footerY - 25,
    12,
    colors.lightText,
    regularFont,
    'center'
  );

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SmartifyPDF_Quiz_${userName.replace(
    /\s+/g,
    '_'
  )}_${documentName.replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
