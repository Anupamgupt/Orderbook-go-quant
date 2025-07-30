'use client';
import {  PopcornIcon } from "lucide-react"
import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { DepthChart } from "@/components/ui/DepthchartUI";
import Okswebhook from '@/lib/Okswebhook';
import Spinner from "./ui/Spinner";

export default function OrderBook() {
  const {
    bids,
    asks,
    isConnected,
    hasError
  } = Okswebhook();

  if (hasError) return  <div className="mt-10  flex justify-center ">
       <Alert  className="w-[100%] md:w-[50%] ">
        <PopcornIcon />
        <AlertTitle>
          Could not connect to OKX
        </AlertTitle>
      </Alert>
  </div>;

  if (!isConnected || bids.length === 0 || asks.length === 0)
    return <div className="text-center mt-10 text-gray-500">
        <Spinner/>
    </div>;

  return (
    <div className="md:p-6">
      <h1 className="text-2xl font-bold text-center mb-6">BTC-USDT Order Book (OKX)</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Depth Chart (Left 1/3) */}
        <div className="w-full md:w-1/3">
          <div className="bg-zinc-50  dark:bg-zinc-900 rounded-sm pt-10 pb-5 pr-5">
            <DepthChart bids={bids} asks={asks} />
            <h2 className="text-center font-semibold mt-2">Depth Chart</h2>
          </div>
        </div>

        {/* Order Book Tables (Right 2/3) */}
        <div className="flex flex-col md:flex-row gap-8 w-full md:w-2/3 justify-center">
          {/* Bids */}
          <div className="w-full md:w-1/2 bg-zinc-50 dark:bg-zinc-900 px-10 py-5 rounded-sm">
            <h2 className="text-green-600 text-lg font-semibold mb-2">Bids</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-green-600 text-sm">
                {bids.map(([price, size], i) => (
                  <TableRow key={i} className="hover:bg-green-100">
                    <TableCell>{price}</TableCell>
                    <TableCell className="text-right">{size}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Asks */}
          <div className="w-full md:w-1/2 bg-zinc-50 dark:bg-zinc-900 px-10 py-5 rounded-sm">
            <h2 className="text-red-600 text-lg font-semibold mb-2">Asks</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-red-600 text-sm">
                {asks.map(([price, size], i) => (
                  <TableRow key={i} className="hover:bg-red-100">
                    <TableCell>{price}</TableCell>
                    <TableCell className="text-right">{size}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
