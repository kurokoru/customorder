'use client';
import { Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useRouter } from 'next/navigation';

interface CustomOrderItem {
  id: string;
  itemName: string;
  price: number;
  quantity: number;
  createdAt: Date;
  customTransactionId: string;
}

interface CustomTransactionData {
  id: string;
  totalAmount: any; // Prisma Decimal type
  createdAt: Date;
  isComplete: boolean;
  items: CustomOrderItem[];
}

export default function CustomOrderDetailPage({ params }: { params: { id: string } }) {
  // State variables
  const [taxRate, setTaxRate] = useState<number>(0);
  const [customTransactionData, setCustomTransactionData] = useState<CustomTransactionData | null>(null);
  const [printing, setPrinting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Reference for printing
  const route = useRouter();
  const componentRef = useRef<HTMLDivElement>(null);

  // Calculate subtotal, tax, and total
  let subtotal = 0;
  if (customTransactionData) {
    customTransactionData.items.forEach((item) => {
      subtotal += item.price * item.quantity;
    });
  }
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  // Redirect to error page
  const handleRedirect = () => {
    route.push(`/_error`);
  };

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Custom Order Receipt - ${params.id}`,
    onBeforeGetContent: () => {
      setPrinting(true);
    },
    onAfterPrint: () => {
      setPrinting(false);
    },
  });

  // Fetch shop data on component mount
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await axios.get('/api/shopdata');
        const shopdata = response.data.data;

        if (response.status === 200) {
          setTaxRate(shopdata.tax || 0);
        } else {
          console.log('Failed to fetch shop data:', shopdata.error);
        }
      } catch (error) {
        console.error('Failed to fetch shop data:', error);
      }
    };

    fetchShopData();
  }, []);

  // Fetch custom transaction data for the given ID on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchCustomTransactionData = async () => {
      if (isMounted) {
        try {
          if (!params.id) {
            return;
          }

          const response = await axios.get(`/api/custom-transactions/${params.id}`);
          if (response.status === 200 && isMounted) {
            const data = response.data;
            setCustomTransactionData(data);
          } else if (response.status === 404 && isMounted) {
            setCustomTransactionData(null);
            handleRedirect();
          } else {
            console.error('Failed to fetch custom transaction data');
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 404 && isMounted) {
              setCustomTransactionData(null);
              handleRedirect();
            } else {
              console.error(
                'An error occurred while fetching custom transaction data:',
                error
              );
            }
          } else {
            console.error('An unexpected error occurred:', error);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };

    fetchCustomTransactionData();
    return () => {
      isMounted = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!customTransactionData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Custom order not found</div>
      </div>
    );
  }

  // Render the component
  return (
    <div className="w-full h-full">
      <style jsx>{`
        @media print {
          @page {
            size: 80mm 100mm; /* Adjust to your thermal paper size */
          }
          /* Other print styles */
          .print-card {
            width: 80mm;
            max-width: 80mm;
            padding: 4mm;
            border: none;
            font-size: 12px;
            font-family: 'Courier New', Courier, monospace;
          }
          .print-card-header {
            background-color: #f0f0f0;
          }
          .print-card-content {
            padding: 0;
          }
        }
      `}</style>
      <Card
        className="w-full flex flex-col h-full print-card overflow-hidden print:w-full print:max-w-[80mm] print:p-4 print:border print:text-[12px] print:font-mono"
        ref={componentRef}
      >
        <CardHeader className="flex flex-row items-start bg-muted/50 print-card-header">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              {params.id}
            </CardTitle>
            <CardDescription>
              Date: {customTransactionData.createdAt 
                ? new Date(customTransactionData.createdAt).toLocaleDateString() 
                : 'Unknown'}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1 print:hidden">
            <Button
              size="icon"
              variant="outline"
              className="h-8 gap-1"
              onClick={handlePrint}
              disabled={total === 0 || printing}
            >
              <Printer />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm print-card-content">
          <div className="grid gap-3">
            <div className="font-semibold">Custom Order Details</div>
            <ul className="grid gap-3">
              {customTransactionData.items.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {item.itemName} x <span>{item.quantity}</span>
                  </span>
                  <span>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Total</span>
                <span>${total.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 mt-auto"></CardFooter>
      </Card>
    </div>
  );
}
