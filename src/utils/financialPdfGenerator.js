import jsPDF from 'jspdf';
import { BOOK_CONTENT } from '../data/bookContent';

export const generateFinancialFreedomPDF = () => {
  const doc = new jsPDF();
  const bookData = BOOK_CONTENT['financial-freedom'];
  
  // PDF Configuration
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 7;
  const maxLineWidth = pageWidth - (margin * 2);
  
  // Title Page
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('FINANCIAL FREEDOM BLUEPRINT', pageWidth / 2, 40, { align: 'center' });
  
  doc.setFontSize(18);
  doc.text('Navigate Inflation & Build Wealth', pageWidth / 2, 55, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text('Master your money and build lasting wealth through strategic financial planning', pageWidth / 2, 80, { align: 'center' });
  
  // Add footer
  doc.setFontSize(10);
  doc.text('© 2025 FuturePath Guides. All rights reserved.', pageWidth / 2, pageHeight - 20, { align: 'center' });
  
  // Table of Contents
  doc.addPage();
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('Table of Contents', margin, 30);
  
  let yPosition = 50;
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  
  bookData.chapters.forEach((chapter, index) => {
    doc.text(`${index + 1}. ${chapter.title}`, margin, yPosition);
    doc.text(`${chapter.duration}`, pageWidth - margin - 30, yPosition);
    yPosition += 10;
  });
  
  // Add chapters
  bookData.chapters.forEach((chapter) => {
    doc.addPage();
    
    // Chapter title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(chapter.title, margin, 30);
    
    // Chapter duration
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Reading time: ${chapter.duration}`, margin, 45);
    
    // Chapter content
    doc.setFontSize(11);
    let yPos = 60;
    
    // Split content into paragraphs and format
    const paragraphs = chapter.content.split('\n\n');
    
    paragraphs.forEach(paragraph => {
      if (paragraph.trim()) {
        // Handle headers
        if (paragraph.startsWith('## ')) {
          doc.setFont(undefined, 'bold');
          doc.setFontSize(14);
          const headerText = paragraph.replace('## ', '');
          doc.text(headerText, margin, yPos);
          yPos += 15;
          doc.setFont(undefined, 'normal');
          doc.setFontSize(11);
        } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
          doc.setFont(undefined, 'bold');
          doc.setFontSize(12);
          const boldText = paragraph.replace(/\*\*/g, '');
          doc.text(boldText, margin, yPos);
          yPos += 12;
          doc.setFont(undefined, 'normal');
          doc.setFontSize(11);
        } else {
          // Regular paragraph
          const lines = doc.splitTextToSize(paragraph, maxLineWidth);
          lines.forEach(line => {
            if (yPos > pageHeight - 30) {
              doc.addPage();
              yPos = 30;
            }
            doc.text(line, margin, yPos);
            yPos += lineHeight;
          });
          yPos += 5; // Extra space between paragraphs
        }
        
        // Check if we need a new page
        if (yPos > pageHeight - 50) {
          doc.addPage();
          yPos = 30;
        }
      }
    });
    
    // Add interactive elements
    if (chapter.interactiveElements) {
      chapter.interactiveElements.forEach(element => {
        if (yPos > pageHeight - 80) {
          doc.addPage();
          yPos = 30;
        }
        
        // Add element title
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.text(element.title, margin, yPos);
        yPos += 15;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        
        // Add element content based on type
        if (element.type === 'checklist' && element.items) {
          element.items.forEach(item => {
            doc.text(`☐ ${item}`, margin + 10, yPos);
            yPos += 8;
          });
        } else if (element.type === 'action_items' && element.items) {
          element.items.forEach(item => {
            doc.text(`• ${item}`, margin + 10, yPos);
            yPos += 8;
          });
        } else if (element.type === 'worksheet' && element.fields) {
          element.fields.forEach(field => {
            doc.text(field, margin + 10, yPos);
            yPos += 15; // Space for writing
          });
        }
        
        yPos += 10; // Space after element
      });
    }
  });
  
  return doc;
};

export const downloadFinancialFreedomPDF = () => {
  const pdf = generateFinancialFreedomPDF();
  pdf.save('Financial-Freedom-Blueprint.pdf');
};