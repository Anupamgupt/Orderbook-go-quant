'use client';

import { useState } from "react";
import BybitOrderBook from "@/components/Bybit";
import OksData from "@/components/OksData";
import { Button } from "@/components/ui/button";
import DerbitOrderBook from "./DeribitOrderBook";

export default function Home() {
    const [venue, setVenue] = useState("okx");

    return (
        <div className="w-full px-6 pt-15">
            <div className="flex items-center justify-between"> 
                <div className="py-3">
                    <h1 className="text-sm md:text-xl  font-[500] mb-2">Venue</h1>
                    <div className="flex gap-2 flex-wrap">
                        <Button 
                            onClick={() => setVenue("okx")}
                            className={`text-[12px] px-8 rounded-full border-2 cursor-pointer ${venue === 'okx' ? 'bg-zinc-800 text-white' : 'bg-zinc-50 text-black hover:bg-zinc-200'}`}
                        >
                            OKX
                        </Button>
                        <Button 
                            onClick={() => setVenue("bybit")}
                            className={`text-[12px] px-8 rounded-full border-2 cursor-pointer ${venue === 'bybit' ? 'bg-zinc-800 text-white' : 'bg-zinc-50 text-black hover:bg-zinc-200'}`}
                        >
                            Bybit
                        </Button>
                        <Button 
                            onClick={() => setVenue("deribit")}
                            className={`text-[12px] px-8 rounded-full border-2 cursor-pointer ${venue === 'deribit' ? 'bg-zinc-800 text-white' : 'bg-zinc-50 text-black hover:bg-zinc-200'}`}
                        >
                            Deribit
                        </Button>
                    </div>
                </div>
                <div>
                    <h1 className="text-sm md:text-xl text-end font-[500] mb-2">Current Symbol</h1>
                    <h1 className="text-[10px] md:text-[16px] text-end">BTC-USDT</h1>
                </div>
            </div>

            <div>
                {venue === "okx" && <OksData />}
                {venue === "bybit" && <BybitOrderBook />}
                {venue === "deribit" && <DerbitOrderBook/>}
            </div>
        </div>
    );
}
