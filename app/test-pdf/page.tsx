import PDFTestComponent from '@/components/PDFTestComponent';

export default function PDFTestPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">PDF Generator Test</h1>
        <p className="text-muted-foreground mt-2">
          Test the PDF generation with dummy data
        </p>
      </div>
      
      <PDFTestComponent />
      
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-4">Dummy Data Includes:</h3>
        <ul className="space-y-1 text-sm">
          <li>• Room bookings (Deluxe rooms)</li>
          <li>• Food items (Chicken Gordon Bleu, Steak, etc.)</li>
          <li>• Beverages (Juices, Milkshakes)</li>
          <li>• Desserts</li>
          <li>• Additional manual items</li>
          <li>• Realistic pricing in Indonesian Rupiah</li>
          <li>• Reference codes for each item</li>
          <li>• Current date for all orders</li>
        </ul>
      </div>
    </div>
  );
}
