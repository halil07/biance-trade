import {tickers} from "./trade"
const ws = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');

(async()=>{
    const exchangeInfoFetch = await fetch('https://api.binance.com/api/v3/exchangeInfo');
    const exchangeInfo = await exchangeInfoFetch.json()
    const tradingCoin = exchangeInfo.symbols.filter(x => x.status === 'TRADING').map(x => x.symbol);
    ws.addEventListener('message', (data) => {
        if (data.data) {
            const trade = JSON.parse(data.data); // parsing single-trade record
            tickers(trade.filter(x => tradingCoin.includes(x.s)));
        }
    });
    const recursiveFunc = async () => {
        const tickerPriceFetch = await fetch('https://api3.binance.com/api/v3/ticker/price')
        const tickerPrice = await tickerPriceFetch.json();
        const tickerCoins = tickerPrice.filter(x => tradingCoin.includes(x.symbol)).map(x => ({
            s: x.symbol,
            c: x.price
        }))
        tickers(tickerCoins);
        await new Promise(r => setTimeout(r, 500));
        recursiveFunc();
    }
    recursiveFunc();
    
    
})();