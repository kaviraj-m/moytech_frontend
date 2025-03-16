import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { translateToTamil } from './translateToTamil';
import axios from 'axios';

// Add a debug section to display raw response data at the bottom of the PDF
// This will help identify any encoding issues with Tamil characters

interface MoyEntry {
  id: number;
  event_id: number;
  contributor_name: string;
  amount: number;
  notes: string;
  place: string;
  created_at: string;
  updated_at: string;
}

export async function translateAndExportMoyEntries(eventId: number): Promise<void> {
  try {
    // Fetch MOY entries
    const response = await axios.get(`/api/moyentries/event/${eventId}`);
    const moyEntries: MoyEntry[] = response.data;
    
    if (!moyEntries || moyEntries.length === 0) {
      throw new Error('No MOY entries found for this event');
    }
    
    // Translate each entry
    const translatedEntries = await Promise.all(
      moyEntries.map(async (entry) => {
        console.log('Translating entry:', entry.contributor_name);
        
        const translatedName = await translateToTamil(entry.contributor_name);
        const translatedNotes = await translateToTamil(entry.notes);
        const translatedPlace = await translateToTamil(entry.place);
        
        return {
          ...entry,
          contributor_name_tamil: translatedName,
          notes_tamil: translatedNotes,
          place_tamil: translatedPlace
        };
      })
    );
    
    // Calculate total amount
    const totalAmount = translatedEntries.reduce((sum, entry) => {
      // Convert entry.amount to a number if it's not already
      const amount = typeof entry.amount === 'string' 
        ? parseFloat(entry.amount) 
        : (typeof entry.amount === 'number' ? entry.amount : 0);
      
      // Check if amount is a valid number
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    // Create a temporary HTML element with the translated content
    const tempDiv = document.createElement('div');
    tempDiv.style.fontFamily = "'Noto Sans Tamil', Arial, sans-serif";
    tempDiv.style.padding = '20px';
    tempDiv.style.width = '800px';
    
    // Add Google Fonts link for Noto Sans Tamil
    const fontLink1 = document.createElement('link');
    fontLink1.rel = 'preconnect';
    fontLink1.href = 'https://fonts.googleapis.com';
    
    const fontLink2 = document.createElement('link');
    fontLink2.rel = 'preconnect';
    fontLink2.href = 'https://fonts.gstatic.com';
    fontLink2.crossOrigin = 'anonymous';
    
    const fontLink3 = document.createElement('link');
    fontLink3.rel = 'stylesheet';
    fontLink3.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@100..900&display=swap';
    
    // Append font links to document head
    document.head.appendChild(fontLink1);
    document.head.appendChild(fontLink2);
    document.head.appendChild(fontLink3);
    
    // Wait for font to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    tempDiv.innerHTML = `
      <h1 style="color: #003366; font-family: 'Noto Sans Tamil', Arial, sans-serif;">MOY Entries - Tamil Translation</h1>
      <p>Event ID: ${eventId}</p>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #003366; color: white;">
            <th style="padding: 8px; border: 1px solid #ddd;">ID</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Name</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Tamil Name</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Amount</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Notes</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Tamil Notes</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Place</th>
          </tr>
        </thead>
        <tbody>
          ${translatedEntries.map((entry, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#f2f2f2' : 'white'};">
              <td style="padding: 8px; border: 1px solid #ddd;">${entry.id}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${entry.contributor_name}</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-family: 'Noto Sans Tamil', Arial, sans-serif;">${entry.contributor_name_tamil}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">₹${entry.amount}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${entry.notes}</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-family: 'Noto Sans Tamil', Arial, sans-serif;">${entry.notes_tamil}</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-family: 'Noto Sans Tamil', Arial, sans-serif;">${entry.place_tamil}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p style="margin-top: 20px; font-weight: bold;">Total Amount: ₹${totalAmount.toFixed(2)}</p>
      
      <!-- Debug section for testing -->
      <div style="margin-top: 40px; border-top: 1px dashed #ccc; padding-top: 20px;">
        <h3 style="color: #666;">Debug Information (For Testing Only)</h3>
        <div style="font-family: monospace; font-size: 10px; white-space: pre-wrap; overflow-wrap: break-word; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
          <p><strong>Raw Translation Data:</strong></p>
          ${translatedEntries.map((entry, index) => `
            <p>Entry ${index + 1}:</p>
            <p>Original Name: ${entry.contributor_name}</p>
            <p>Tamil Name: ${entry.contributor_name_tamil}</p>
            <p>Original Notes: ${entry.notes}</p>
            <p>Tamil Notes: ${entry.notes_tamil}</p>
            <p>Original Place: ${entry.place}</p>
            <p>Tamil Place: ${entry.place_tamil}</p>
            <hr style="border: none; border-top: 1px dotted #ccc; margin: 10px 0;">
          `).join('')}
        </div>
      </div>
    `;
    
    // Append to document temporarily
    document.body.appendChild(tempDiv);
    
    // Convert to canvas and then PDF
    try {
      const canvas = await html2canvas(tempDiv, {
        scale: 1,
        useCORS: true,
        logging: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MOY_Entries_Tamil_Event_${eventId}.pdf`);
      
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF from HTML:', error);
      throw error;
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
      document.head.removeChild(fontLink1);
      document.head.removeChild(fontLink2);
      document.head.removeChild(fontLink3);
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error generating translated PDF:', error);
    throw error;
  }
}