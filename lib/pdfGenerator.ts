import jsPDF from 'jspdf';

interface OrderItem {
  id: string;
  orderDate: string;
  itemName: string;
  reference: string;
  price: number;
  quantity: number;
}

interface WizardData {
  customerName: string;
  cashierName: string;
  serviceType: string;
  items: OrderItem[];
}

interface PDFGeneratorOptions {
  data: WizardData;
  calculateTotal: () => number;
}

// Generate dummy data for testing PDF
export const generateDummyData = (): WizardData => {
  const dummyItems: OrderItem[] = [
    {
      id: '1',
      orderDate: '2025-06-26',
      itemName: 'Pesona Room - Deluxe (No. Room F1&E)',
      reference: 'RM001',
      price: 700000,
      quantity: 1
    },
    {
      id: '2',
      orderDate: '2025-06-26',
      itemName: 'Pesona Room - Deluxe Twin Rp. 450.000,-',
      reference: 'RM002',
      price: 450000,
      quantity: 1
    },
    {
      id: '3',
      orderDate: '2025-06-26',
      itemName: 'Watermelon Juice',
      reference: 'DR001',
      price: 35000,
      quantity: 2
    },
    {
      id: '4',
      orderDate: '2025-06-26',
      itemName: 'Milkshake',
      reference: 'DR002',
      price: 40000,
      quantity: 1
    },
    {
      id: '5',
      orderDate: '2025-06-26',
      itemName: 'Hot Milkshake/Juice',
      reference: 'DR003',
      price: 45000,
      quantity: 1
    },
    {
      id: '6',
      orderDate: '2025-06-26',
      itemName: 'Dessert',
      reference: 'DS001',
      price: 60000,
      quantity: 1
    },
    {
      id: '7',
      orderDate: '2025-06-26',
      itemName: 'Chicken Gordon Bleu',
      reference: 'FD001',
      price: 70000,
      quantity: 1
    },
    {
      id: '8',
      orderDate: '2025-06-26',
      itemName: 'Stir Fried Chicken in Chilli Sauce',
      reference: 'FD002',
      price: 70000,
      quantity: 1
    },
    {
      id: '9',
      orderDate: '2025-06-26',
      itemName: 'BBQ Chicken Kebab',
      reference: 'FD003',
      price: 70000,
      quantity: 1
    },
    {
      id: '10',
      orderDate: '2025-06-26',
      itemName: 'Tenderloin Steak',
      reference: 'FD004',
      price: 80000,
      quantity: 1
    },
    {
      id: '11',
      orderDate: '2025-06-26',
      itemName: 'Beef Gordon Bleu',
      reference: 'FD005',
      price: 80000,
      quantity: 1
    },
    {
      id: '12',
      orderDate: '2025-06-26',
      itemName: 'Additional (Ketik Manual)',
      reference: 'ADD001',
      price: 25000,
      quantity: 2
    }
  ];

  return {
    customerName: 'John Doe',
    cashierName: 'Maria Santos',
    serviceType: 'room',
    items: dummyItems
  };
};

// Helper function to calculate total for dummy data
export const calculateDummyTotal = (data: WizardData): number => {
  const subtotal = data.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  return subtotal + tax;
};

// Generate PDF with dummy data for testing
export const generateDummyPDF = () => {
  const dummyData = generateDummyData();
  
  generatePDF({
    data: dummyData,
    calculateTotal: () => calculateDummyTotal(dummyData)
  });
};

export const generatePDF = ({ data, calculateTotal }: PDFGeneratorOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let currentY = 25;

  // Header - Company Info (exactly as shown in image)
  doc.setFontSize(14);
  doc.setFont('', 'bold');
  doc.text('PESONA ROOM AND RESTAURANT', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 8;
  doc.setFontSize(9);
  doc.setFont('', 'normal');
  doc.text('JL SOEKARNO HATTA - LABUAN BAJO', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 6;
  doc.text('LABUAN BAJO ROOM', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 6;
  doc.text('JL H. ISHAKA (GANG MASJID) - LABUAN BAJO', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 6;
  doc.text('Phone : +62 821-4525-0266', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 6;
  doc.text('Email : hallpesona@gmail.com', pageWidth / 2, currentY, { align: 'center' });

  currentY += 15;

  // INVOICE header - centered and boxed (exactly as in image)
  doc.setFontSize(12);
  doc.setFont('', 'bold');
  const invoiceText = 'INVOICE';
  const invoiceWidth = doc.getTextWidth(invoiceText) + 10;
  const invoiceX = (pageWidth - invoiceWidth) / 2;
  doc.rect(invoiceX, currentY - 5, invoiceWidth, 10);
  doc.text(invoiceText, pageWidth / 2, currentY + 1, { align: 'center' });

  currentY += 20;

  // Guest Details Section (exactly as in image)
  doc.setFontSize(9);
  doc.setFont('', 'normal');
  
  doc.text(`Guest Name      : ${data.customerName || '(Input Manual)'}`, margin, currentY);
  currentY += 7;
  doc.text(`Payment For     : (Room, Restaurant, Room & Restaurant)`, margin, currentY);
  currentY += 7;
  doc.text(`Arrival         : (Input Kalender)`, margin, currentY);
  currentY += 7;
  doc.text(`Departure       : (Input Kalender)`, margin, currentY);
  currentY += 7;
  doc.text(`Cashier         : ${data.cashierName}`, margin, currentY);

  currentY += 15;

  // Table setup
  const tableStartY = currentY;
  const colWidths = [25, 50, 30, 15, 25, 25]; // Column widths
  const colPositions = [margin];
  
  // Calculate column positions
  for (let i = 1; i < colWidths.length; i++) {
    colPositions[i] = colPositions[i-1] + colWidths[i-1];
  }
  
  const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);

  // Table Header
  doc.setFontSize(8);
  doc.setFont('', 'bold');
  
  // Draw header row border
  doc.rect(margin, currentY, tableWidth, 10);
  
  // Column headers (exactly as in image)
  doc.text('Date', colPositions[0] + 2, currentY + 6);
  doc.text('Description', colPositions[1] + 2, currentY + 6);
  doc.text('Reference', colPositions[2] + 2, currentY + 6);
  doc.text('QTY', colPositions[3] + 2, currentY + 6);
  doc.text('Amount (IDR)', colPositions[4] + 2, currentY + 6);
  doc.text('Total (IDR)', colPositions[5] + 2, currentY + 6);
  
  currentY += 10;

  // Items rows
  doc.setFont('', 'normal');
  const itemRowHeight = 8;
  
  // Special first row as shown in image
  doc.rect(margin, currentY, tableWidth, itemRowHeight);
  doc.text('(Apabila tidak reservoir error)', colPositions[0] + 1, currentY + 5, { maxWidth: colWidths[0] - 2 });
  
  currentY += itemRowHeight;

  // Actual items
  data.items.forEach((item, index) => {
    if (currentY > 250) { // New page if needed
      doc.addPage();
      currentY = 30;
    }
    
    // Draw row border
    doc.rect(margin, currentY, tableWidth, itemRowHeight);
    
    // Item data
    const orderDate = item.orderDate ? new Date(item.orderDate).toLocaleDateString('id-ID') : '';
    doc.text(orderDate, colPositions[0] + 1, currentY + 5, { maxWidth: colWidths[0] - 2 });
    doc.text(item.itemName, colPositions[1] + 1, currentY + 5, { maxWidth: colWidths[1] - 2 });
    doc.text(item.reference || '', colPositions[2] + 1, currentY + 5, { maxWidth: colWidths[2] - 2 });
    doc.text(item.quantity.toString(), colPositions[3] + 1, currentY + 5);
    doc.text(item.price.toFixed(0), colPositions[4] + 1, currentY + 5);
    doc.text((item.price * item.quantity).toFixed(0), colPositions[5] + 1, currentY + 5);
    
    currentY += itemRowHeight;
  });

  // Add empty rows to fill the table (as shown in image)
  const totalRows = Math.max(10, data.items.length + 1);
  const remainingRows = totalRows - data.items.length - 1; // -1 for the special first row
  
  for (let i = 0; i < remainingRows; i++) {
    doc.rect(margin, currentY, tableWidth, itemRowHeight);
    
    currentY += itemRowHeight;
  }

  currentY += 20;

  // Total Amount section (as shown in image)
  doc.setFont('', 'bold');
  doc.setFontSize(10);
  doc.text('Total Amount', margin, currentY);
  
  // Add total amount value
  doc.text(`Rp. ${calculateTotal().toFixed(0)}`, margin + 100, currentY);

  // Save the PDF
  doc.save(`invoice-${Date.now()}.pdf`);
};
