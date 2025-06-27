const data = {
  customerName: 'John Doe',
  cashierName: 'Maria Santos',
  serviceType: 'room',
  items: [
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
      id: '10',
      orderDate: '2025-06-26',
      itemName: 'Tenderloin Steak',
      reference: 'FD004',
      price: 80000,
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
      id: '10',
      orderDate: '2025-06-26',
      itemName: 'Tenderloin Steak',
      reference: 'FD004',
      price: 80000,
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
      id: '10',
      orderDate: '2025-06-26',
      itemName: 'Tenderloin Steak',
      reference: 'FD004',
      price: 80000,
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
      id: '10',
      orderDate: '2025-06-26',
      itemName: 'Tenderloin Steak',
      reference: 'FD004',
      price: 80000,
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
      id: '10',
      orderDate: '2025-06-26',
      itemName: 'Tenderloin Steak',
      reference: 'FD004',
      price: 80000,
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
      id: '10',
      orderDate: '2025-06-26',
      itemName: 'Tenderloin Steak',
      reference: 'FD004',
      price: 80000,
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
      id: '10',
      orderDate: '2025-06-26',
      itemName: 'Tenderloin Steak',
      reference: 'FD004',
      price: 8000000,
      quantity: 1
    }
  ]
};
    var doc = new jsPDF();
    var pageWidth = doc.internal.pageSize.getWidth();
    var margin = 20;
    var currentY = 25;

    // Helper function to add company header
    function addCompanyHeader() {
      // Company name
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PESONA ROOM AND RESTAURANT', pageWidth / 2, currentY, { align: 'left' });
      currentY += 7;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('JL SOEKARNO HATTA - LABUAN BAJO', pageWidth / 2, currentY, { align: 'left' });

      currentY += 7;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('LABUAN BAJO ROOM', pageWidth / 2, currentY, { align: 'left' });
    

      currentY += 7;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      // Company address and contact
      var companyInfo = [
        'JL H. ISHAKA (GANG MASJID) - LABUAN BAJO',
        'Phone : +62 821-4525-0266',
        'Email : hallpesona@gmail.com'
      ];
      
      for (var i = 0; i < companyInfo.length; i++) {
        doc.text(companyInfo[i], pageWidth / 2, currentY, { align: 'left' });
        currentY += 6;
      }
      
      currentY += 9; // Extra space after header
    }

    // Helper function to add invoice box
    function addInvoiceBox() {
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      var invoiceText = 'INVOICE';

      // Draw box around INVOICE text
      doc.text(invoiceText, pageWidth / 3 + 15, currentY , { align: 'left' });
      currentY += 10;
    }

   function addGuestDetails() {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      var tableWidth = pageWidth - (margin * 2);
      var col1Width = 25; // Width for labels
      var col2Width = tableWidth - col1Width; // Width for values
      var rowHeight = 5;
      
      var guestData = [
        { label: 'Guest Name', value: data.customerName || '(Input Manual)' },
        { label: 'Payment For', value: '(Room, Restaurant, Room & Restaurant)' },
        { label: 'Arrival', value: '(Input Kalender)' },
        { label: 'Departure', value: '(Input Kalender)' },
        { label: 'Cashier', value: data.cashierName || '(Input Manual)' }
      ];
      
      // Draw table rows
      for (var i = 0; i < guestData.length; i++) {
        var row = guestData[i];
        
        // Add label (bold)
        doc.setFont('helvetica', 'bold');
        doc.text(row.label, margin + 2, currentY + 1);
        
        // Add value (normal)
        doc.setFont('helvetica', 'normal');
        doc.text(row.value, margin + col1Width + 5, currentY + 1);
        
        currentY += rowHeight;
      }
      
      currentY += 10;
    }

    // Helper function to add table
    function addItemsTable() {
      var tableStartY = currentY;
      var colWidths = [15, 80, 20, 15, 20, 20];
      var colPositions = [margin];
      
      // Calculate column positions
      for (var i = 1; i < colWidths.length; i++) {
        colPositions[i] = colPositions[i-1] + colWidths[i-1];
      }
      
      var tableWidth = colWidths.reduce(function(sum, width) { return sum + width; }, 0);

      // Table header
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.rect(margin, currentY, tableWidth, 10);
      doc.text('Date', colPositions[0] + 2, currentY + 6);

      var headers = ['Date', 'Description', 'Reference', 'QTY', 'Amount (IDR)', 'Total (IDR)'];
      for (var i = 1; i < headers.length; i++) {
        doc.text(headers[i], colPositions[i] + 2, currentY + 6);
      }
      
      currentY += 10;

      // Table rows
      doc.setFont('helvetica', 'normal');
      var itemRowHeight = 8;
      
      // Special first row

      // Data rows
      for (var i = 0; i < data.items.length; i++) {
        var item = data.items[i];
        
        if (currentY > 250) {
          doc.addPage();
          currentY = 30;
        }

        
        doc.rect(margin, currentY, tableWidth, itemRowHeight);
        
        var orderDate = item.orderDate ? 
          new Date(item.orderDate).toLocaleDateString('id-ID') : '';
        
        // Add item data to table
        doc.text(orderDate, colPositions[0] + 1, currentY + 5, { 
          maxWidth: colWidths[0] - 2
        });
        doc.text(item.itemName, colPositions[1] + 1, currentY + 5, { 
          maxWidth: colWidths[1] - 2 
        });
        doc.text(item.reference || '', colPositions[2] + 1, currentY + 5, { 
          maxWidth: colWidths[2] - 2 
        });
        doc.text(item.quantity.toString(), colPositions[3] + 1, currentY + 5);
        doc.text(item.price.toFixed(0), colPositions[4] + 20, currentY + 5, { align: 'right' });
        doc.text((item.price * item.quantity).toFixed(0), colPositions[5] + 15, currentY + 5, { align: 'right' });
        
        currentY += itemRowHeight;
      }

      // Add empty rows to fill table
      var totalRows = Math.max(1, data.items.length + 1);
      doc.rect(margin, currentY, tableWidth, itemRowHeight);
      doc.text('Total Amount', colPositions[0] + 1, currentY + 5);
      doc.text(calculateTotal(data).toFixed(0), colPositions[5] + 15, currentY + 5, { align: 'right' });
      
      currentY += 20;
    }
   // Helper function to add signature and PAID stamp
    function addSignatureAndPaid() {
      var pageHeight = doc.internal.pageSize.getHeight();
      var signatureY = pageHeight - 40; // Position near bottom
      
      // Add signature on bottom right
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Thank you for stay with us! Comeback soon …', pageWidth - margin - 170, signatureY - 50);
      
      signatureY += 15;
      doc.setFont('helvetica', 'bold');
      doc.text('PESONA INDAH HOTEL AND ROOM', pageWidth - margin - 80, signatureY);
      
      // Add signature line
      signatureY += 5;
      doc.line(pageWidth - margin - 80, signatureY, pageWidth - margin - 10, signatureY);
      
      // Add PAID stamp (rectangle with text)
      var paidX = pageWidth - margin - 70;
      var paidY = signatureY - 40;
      var paidWidth = 40;
      var paidHeight = 15;
      
      // Draw PAID box
      doc.setLineWidth(2);
      doc.rect(paidX, paidY, paidWidth, paidHeight);
      
      // Add PAID text
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('PAID', paidX + paidWidth/2, paidY + paidHeight/2 + 2, { align: 'center' });
      
      // Reset line width
      doc.setLineWidth(0.2);
    }
    // Generate PDF sections
    addCompanyHeader();
    addInvoiceBox();
    addGuestDetails();
    addItemsTable();
    addSignatureAndPaid()
    // Save the PDF
    var timestamp = new Date().getTime();
    doc.save('invoice-' + timestamp + '.pdf');
    
    console.log('PDF generated successfully!');