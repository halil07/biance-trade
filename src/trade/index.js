import {assets as baseAssets, trade} from "../base"

/**
 * 
 * @param {{s: string, c: string}} t 
 */
const ticker = (t) => {
    const symbol = t.s;
    let base = (baseAssets.find(x => symbol.endsWith(x)))
    let asset = symbol.split(base)[0];
    if(asset===""){
        return;
    }
    if(!trade[base]) trade[base]={};
    trade[base][asset] = t.c;
}

export const tickers = (ts) => {
    ts.forEach(ticker);
}