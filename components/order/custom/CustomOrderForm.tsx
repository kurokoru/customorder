'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import CustomOrderHead from './components/CustomOrderHead';
import CustomOrderBody from './components/CustomOrderBody';
import CustomOrderDetail from './components/CustomOrderDetail';
import FullscreenButton from '@/components/fullscreen/fullscreen';
import { Button } from '@/components/ui/button';
import { ReceiptText, Sheet, Plus, Trash2, Archive, Wand2 } from 'lucide-react';
import { CustomOrderAddDialog } from './components/CustomOrderAddDialog';
import axios from 'axios';
import eventBus from '@/lib/even';
import { ReloadIcon } from '@radix-ui/react-icons';
import { AlertDialogDeletetransaction } from '../components/dialogDelete';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

// Custom Order Item interface
export interface CustomOrderItem {
  id: string;
  itemName: string;
  price: number;
  quantity: number;
  transactionId: string;
}

export default function CustomOrderForm() {
  const [dialogAddOpen, setDialogAddOpen] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [customOrderData, setCustomOrderData] = useState<CustomOrderItem[]>([]);
  const [showTable, setShowTable] = useState(true);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedTransactionId = localStorage.getItem('customTransactionId');
    if (typeof window !== 'undefined' && storedTransactionId) {
      setTransactionId(storedTransactionId);
    }
  }, []);

  useEffect(() => {
    // Fetch custom order data when component mounts or transactionId changes
    const fetchCustomOrderData = async () => {
      try {
        if (!transactionId) {
          setCustomOrderData([]);
          return;
        }

        // Check if the user is online
        const isOnline = navigator.onLine;

        if (!isOnline) {
          toast.error(
            'You are offline. Please check your internet connection.'
          );
          return;
        }

        const response = await axios.get(`/api/custom-orders/${transactionId}`);
        if (response.status === 200) {
          const data = response.data;
          setCustomOrderData(Array.isArray(data) ? data : [data]);
        } else {
          console.error('Failed to fetch custom order data');
        }
      } catch (error: any) {
        if (error.response && error.response.status === 405) {
          // Data not found, remove transactionId from localStorage
          localStorage.removeItem('customTransactionId');
          setTransactionId(null);
          toast.warn('Custom order not found in the database.');
        } else if (error.response && error.response.status === 404) {
          // Data not found, no need to show error
          setCustomOrderData([]);
        } else {
          toast.error(
            'An error occurred while fetching custom order data:' + error
          );
        }
      }
    };

    fetchCustomOrderData();

    const handleEventBusEvent = () => {
      fetchCustomOrderData();
    };

    const handleEventBusEventClear = () => {
      setCustomOrderData([]);
    };

    // Subscribe to eventBus event to fetch custom order data
    eventBus.on('fetchCustomOrderData', handleEventBusEvent);

    // Subscribe to eventBus event to clear custom order data
    eventBus.on('clearCustomOrderData', handleEventBusEventClear);

    // Clean up event listener
    return () => {
      eventBus.removeListener('fetchCustomOrderData', handleEventBusEvent);
      eventBus.removeListener('clearCustomOrderData', handleEventBusEventClear);
    };
  }, [transactionId]);

  const createCustomTransaction = async () => {
    // Create new custom transaction if transactionId is not set
    if (!transactionId) {
      setLoading(true);
      try {
        // Check if the user is online
        const isOnline = navigator.onLine;

        if (!isOnline) {
          toast.error(
            'You are offline. Please check your internet connection.'
          );
          return;
        }

        const response = await axios.post('/api/custom-transactions');
        if (response.status === 201) {
          const { id } = response.data;
          localStorage.setItem('customTransactionId', id);
          setTransactionId(id);
          setLoading(false);
        } else {
          toast.error('Failed to create custom transaction');
          setLoading(false);
          return;
        }
      } catch (error) {
        toast.error('An error occurred:' + error);
        setLoading(false);
        return;
      }
    }

    setDialogAddOpen(true);
  };

  const handleDialogAddOpen = () => {
    createCustomTransaction();
  };

  const handleDialogDeleteOpen = () => {
    setDialogDeleteOpen(true);
  };

  const handleDialogAddClose = () => {
    setDialogAddOpen(false);
  };

  const handleDialogDeleteClose = async () => {
    setDialogDeleteOpen(false);
  };

  return (
    <div ref={tableRef} className="w-full h-full">
      <Card className="h-full w-full flex flex-col">
        <div className="relative">
          <CardHeader>
            <CardTitle>Custom Orders</CardTitle>
            <CardDescription>{transactionId}</CardDescription>
            <FullscreenButton targetRef={tableRef} />
            <div className="flex items-center justify-start">
              <div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowTable(!showTable)}
                >
                  {showTable ? <ReceiptText /> : <Sheet />}
                </Button>
              </div>
              <div className="pl-1">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={loading}
                  onClick={handleDialogAddOpen}
                >
                  {loading ? <ReloadIcon className="animate-spin" /> : <Plus />}
                </Button>
              </div>
              <div className="pl-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDialogDeleteOpen}
                  disabled={!transactionId}
                >
                  <Trash2 />
                </Button>
              </div>
              <div className="pl-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push('/custom-orders/records')}
                  title="View Custom Records"
                >
                  <Archive />
                </Button>
              </div>
              <div className="pl-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push('/orders/custom/wizard')}
                  title="Order Wizard"
                >
                  <Wand2 />
                </Button>
              </div>
            </div>
          </CardHeader>
        </div>

        <CardContent className="overflow-auto z-0">
          {showTable ? (
            <Table>
              <CustomOrderHead />
              <CustomOrderBody data={customOrderData} />
            </Table>
          ) : (
            <CustomOrderDetail
              data={customOrderData}
              transactionId={transactionId}
              setTransactionId={setTransactionId}
            />
          )}
          <CustomOrderAddDialog
            open={dialogAddOpen}
            onClose={handleDialogAddClose}
            transactionId={transactionId}
          />
          <AlertDialogDeletetransaction
            open={dialogDeleteOpen}
            onClose={handleDialogDeleteClose}
            transactionId={transactionId}
            setTransactionId={setTransactionId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
