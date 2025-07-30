'use client';

import React, { useEffect, useState } from 'react';
import useOKXOrderBook from '@/lib/Okswebhook';
import Bybitwebhook from '@/lib/Bybitwebhook';

interface Metric {
  fillPercentage: number;
  avgFillPrice: number;
  marketImpact: number;
  slippage: number;
  timeToFill: string;
}

const SimulationForm: React.FC = () => {
  const [venue, setVenue] = useState<string>('OKX');
  const [symbol, setSymbol] = useState<string>('BTC-USDT');
  const [orderType, setOrderType] = useState<string>('Limit');
  const [side, setSide] = useState<string>('Buy');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [timing, setTiming] = useState<string>('Immediate');
  const [metrics, setMetrics] = useState<Metric | null>(null);
  const [recalculate, setRecalculate] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ price?: string; quantity?: string }>({});

  const {
    bids, asks,
    bids5s, asks5s,
    bids10s, asks10s,
    bids30s, asks30s
  } = venue === 'OKX' ? useOKXOrderBook() : Bybitwebhook();

  const validateForm = () => {
    const newErrors: { price?: string; quantity?: string } = {};
    const numericPrice = parseFloat(price);
    const numericQuantity = parseFloat(quantity);

    if (orderType === 'Limit' && (!price || isNaN(numericPrice) || numericPrice <= 0)) {
      newErrors.price = 'Price must be a positive number';
    }
    if (!quantity || isNaN(numericQuantity) || numericQuantity <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const computeMetrics = () => {
    const numericPrice = parseFloat(price);
    const numericQuantity = parseFloat(quantity);

    let book = side === 'Buy' ? asks : bids;
    if (timing === '5s Delay') {
      book = side === 'Buy' ? asks5s : bids5s;
    } else if (timing === '10s Delay') {
      book = side === 'Buy' ? asks10s : bids10s;
    } else if (timing === '30s Delay') {
      book = side === 'Buy' ? asks30s : bids30s;
    }

    let remainingQty = numericQuantity;
    let cost = 0;
    let filled = 0;

    for (const [bookPrice, bookQty] of book) {
      const bookP = parseFloat(bookPrice);
      const bookQ = parseFloat(bookQty);

      if ((side === 'Buy' && bookP <= numericPrice) || (side === 'Sell' && bookP >= numericPrice)) {
        const tradeQty = Math.min(bookQ, remainingQty);
        remainingQty -= tradeQty;
        cost += tradeQty * bookP;
        filled += tradeQty;
        if (remainingQty <= 0) break;
      }
    }

    const fillPercentage = numericQuantity > 0 ? (filled / numericQuantity) * 100 : 0;
    const avgFillPrice = filled > 0 ? cost / filled : 0;
    const marketImpact = Math.abs(avgFillPrice - numericPrice);
    const slippage = numericPrice > 0 ? (marketImpact / numericPrice) * 100 : 0;

    setMetrics({
      fillPercentage,
      avgFillPrice,
      marketImpact,
      slippage,
      timeToFill: timing,
    });
  };

  useEffect(() => {
    if (recalculate) {
      computeMetrics();
    }
  }, [bids, asks, bids5s, asks5s, bids10s, asks10s, bids30s, asks30s, recalculate]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;
    setRecalculate(true);
    computeMetrics();
  };

  useEffect(() => {
    if (errors.price && parseFloat(price) > 0) {
      setErrors((prev) => ({ ...prev, price: undefined }));
    }
    if (errors.quantity && parseFloat(quantity) > 0) {
      setErrors((prev) => ({ ...prev, quantity: undefined }));
    }
  }, [price, quantity]);

  return (
    <div className="p-6 mx-auto flex gap-x-3 justify-center flex-wrap pt-20">
      <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-md w-[30%] min-w-sm">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Venue</label>
            <select
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="p-2 border rounded bg-zinc-50 dark:bg-zinc-900"
            >
              <option>OKX</option>
              <option>Bybit</option>
              <option>Deribit</option>
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Symbol</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="p-2 border rounded bg-zinc-50 dark:bg-zinc-900"
            >
              <option>BTC-USD</option>
              <option>ETH-USD</option>
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Order Type</label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="p-2 border rounded bg-zinc-50 dark:bg-zinc-900"
            >
              <option>Market</option>
              <option>Limit</option>
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Side</label>
            <select
              value={side}
              onChange={(e) => setSide(e.target.value)}
              className="p-2 border rounded bg-zinc-50 dark:bg-zinc-900"
            >
              <option>Buy</option>
              <option>Sell</option>
            </select>
          </div>
        </div>

        {orderType === 'Limit' && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="p-2 border rounded"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="p-2 border rounded"
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Timing</label>
          <select
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            className="p-2 border rounded bg-zinc-50 dark:bg-zinc-900"
          >
            <option>Immediate</option>
            <option>5s Delay</option>
            <option>10s Delay</option>
            <option>30s Delay</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50"
          disabled={!quantity || (orderType === 'Limit' && !price)}
        >
          Simulate Order
        </button>
      </form>

      {metrics && (
        <div className="mt-6 bg-zinc-50 dark:bg-zinc-900 p-4 rounded space-y-2 w-[30%] h-[30%] min-w-sm">
          <h2 className="text-lg font-bold">Simulation Metrics</h2>
          <p>Estimated Fill %: {metrics.fillPercentage.toFixed(2)}%</p>
          <p>Avg Fill Price: ${metrics.avgFillPrice.toFixed(2)}</p>
          <p>Market Impact: ${metrics.marketImpact.toFixed(2)}</p>
          <p>Slippage: {metrics.slippage.toFixed(2)}%</p>
          <p>Time to Fill: {metrics.timeToFill}</p>
        </div>
      )}
    </div>
  );
};

export default SimulationForm;
