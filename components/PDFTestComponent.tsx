'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText } from 'lucide-react';
import { generateDummyPDF, generateDummyData, calculateDummyTotal } from '@/lib/pdfGenerator';

export default function PDFTestComponent() {
  const dummyData = generateDummyData();
  const total = calculateDummyTotal(dummyData);

  return (
    <Card className="max-w-md mx-auto m-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          PDF Generator Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p><strong>Test Data Preview:</strong></p>
          <p>Customer: {dummyData.customerName}</p>
          <p>Cashier: {dummyData.cashierName}</p>
          <p>Service: {dummyData.serviceType}</p>
          <p>Items: {dummyData.items.length}</p>
          <p>Total: Rp. {total.toFixed(0)}</p>
        </div>
        
        <Button 
          onClick={generateDummyPDF}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          Generate Test PDF
        </Button>
        
        <div className="text-sm text-muted-foreground">
          <p>This will generate a PDF with dummy data that matches the invoice format from your image.</p>
        </div>
      </CardContent>
    </Card>
  );
}
