import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

type Order = string[]; 
function getDepthData(bids: Order[], asks: Order[]) {
    const cumulative = (orders: Order[]) => {
        let total = 0;
        return orders.map(([price, size]) => {
            total += parseFloat(size);
            return { price: parseFloat(price), size: total };
        });
    };

    return {
        bids: cumulative(bids).sort((a, b) => a.price - b.price),
        asks: cumulative(asks).sort((a, b) => a.price - b.price),
    };
}
function updateOrderBook(current: Order[], updates: Order[], isBid: boolean): Order[] {
    const book = new Map(current.map(([price, size]) => [price, size]));

    for (const [price, size] of updates) {
        if (parseFloat(size) === 0) {
            book.delete(price);
        } else {
            book.set(price, size);
        }
    }

    const sorted = Array.from(book.entries())
        .sort((a, b) =>
            isBid
                ? parseFloat(b[0]) - parseFloat(a[0])
                : parseFloat(a[0]) - parseFloat(b[0])
        )
        .slice(0, 15)
        .map(([price, size]) => [price, size]);

    return sorted;
}
function DepthChart({ bids, asks }: { bids: Order[], asks: Order[] }) {
    const { bids: bidData, asks: askData } = getDepthData(bids, asks);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart>
                <XAxis dataKey="price" type="number" domain={['dataMin', 'dataMax']} />
                <YAxis />
                <Tooltip />
                <Area
                    dataKey="size"
                    data={bidData}
                    stroke="#16a34a"
                    fill="#16a34a33"
                    name="Bids"
                />
                <Area
                    dataKey="size"
                    data={askData}
                    stroke="#dc2626"
                    fill="#dc262633"
                    name="Asks"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export {
  DepthChart,
  updateOrderBook,
}

