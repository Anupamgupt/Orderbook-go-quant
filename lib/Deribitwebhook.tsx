'use client';

import React, { useEffect, useRef, useState } from 'react';
import { updateOrderBook } from '@/components/ui/DepthchartUI';

type Order = string[];

export default function Deribitwebhook() {
  const socketRef = useRef<WebSocket | null>(null);
  const bidsRef = useRef<Order[]>([]);
  const asksRef = useRef<Order[]>([]);

  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);

  const [bids5s, setBids5s] = useState<Order[]>([]);
  const [asks5s, setAsks5s] = useState<Order[]>([]);
  const [bids10s, setBids10s] = useState<Order[]>([]);
  const [asks10s, setAsks10s] = useState<Order[]>([]);
  const [bids30s, setBids30s] = useState<Order[]>([]);
  const [asks30s, setAsks30s] = useState<Order[]>([]);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const socket = new WebSocket('wss://stream.bybit.com/v5/public/linear');
    socketRef.current = socket;

    const subscribeMessage = {
      op: 'subscribe',
      args: ['orderbook.50.BTCUSDT'],
    };

    socket.onopen = () => {
      setIsConnected(true);
      try {
        socket.send(JSON.stringify(subscribeMessage));
      } catch (error) {
        setHasError(true);
      }
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const updates = msg?.data;

        if (!updates || !updates.b || !updates.a) return;

        // 'b' = bids, 'a' = asks
        bidsRef.current = updateOrderBook(bidsRef.current, updates.b, true);
        asksRef.current = updateOrderBook(asksRef.current, updates.a, false);
      } catch (err) {
        setHasError(true);
      }
    };

    socket.onerror = () => {
      setHasError(true);
    };

    socket.onclose = () => {
      setIsConnected(false);
    };

    const syncInterval = setInterval(() => {
      if (bidsRef.current.length && asksRef.current.length) {
        setBids([...bidsRef.current]);
        setAsks([...asksRef.current]);
      }
    }, 1000);

    const delaySnapshot = (
      setter: React.Dispatch<React.SetStateAction<Order[]>>,
      ref: React.MutableRefObject<Order[]>,
      delay: number
    ) => {
      return setInterval(() => {
        if (ref.current.length) {
          setter([...ref.current]);
        }
      }, delay);
    };

    const interval5sBids = delaySnapshot(setBids5s, bidsRef, 5000);
    const interval5sAsks = delaySnapshot(setAsks5s, asksRef, 5000);
    const interval10sBids = delaySnapshot(setBids10s, bidsRef, 10000);
    const interval10sAsks = delaySnapshot(setAsks10s, asksRef, 10000);
    const interval30sBids = delaySnapshot(setBids30s, bidsRef, 30000);
    const interval30sAsks = delaySnapshot(setAsks30s, asksRef, 30000);

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }

      clearInterval(syncInterval);
      clearInterval(interval5sBids);
      clearInterval(interval5sAsks);
      clearInterval(interval10sBids);
      clearInterval(interval10sAsks);
      clearInterval(interval30sBids);
      clearInterval(interval30sAsks);
    };
  }, []);

  return {
    bids, asks,
    bids5s, asks5s,
    bids10s, asks10s,
    bids30s, asks30s,
    isConnected,
    hasError,
  };
}
