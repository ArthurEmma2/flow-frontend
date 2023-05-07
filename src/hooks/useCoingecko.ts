import { useMemo } from 'react';
import useSWR from 'swr';

export type TokenType = {
    type: string,
    account_address: string,
    module_name: string,
    struct_name: string,
  }
  export type NetworkType = 'testnet' | 'mainnet';

  
  export type ExtensionType = {
    data: [string, string][],
  }
  
  export type RawCoinInfo = {
    name: string,
    symbol: string,
    official_symbol: string,
    coingecko_id: string,
    decimals: number,
    logo_url: string,
    project_url: string,
    token_type: TokenType,
    extensions: ExtensionType,
  };

  export const cutDecimals = (v: string, maxDecimals: number | undefined) => {
    const decimalsLength = v.split('.')[1]?.length || 0;
    if (typeof maxDecimals === 'number' && decimalsLength > maxDecimals) {
      v = v
        .split('.')
        .map((vs, index) => {
          if (index > 0) {
            return vs.slice(0, maxDecimals);
          }
          return vs;
        })
        .join('.');
      if (/^[\d]+\.$/.test(v)) v = v.replace('.', '');
    }
    return v;
  };

const fetcher = (apiURL: string) => fetch(apiURL).then((res) => res.json());

// const useCoingeckoRate = (fromToken: RawCoinInfo, toToken: RawCoinInfo) => {
//   let isLoading = false;
//   let rate: number | undefined = undefined;
//   const key = useMemo(() => {
//     if (!(fromToken?.coingecko_id && toToken?.coingecko_id)) return null;
//     const ids = [fromToken, toToken].map((t) => t.coingecko_id).sort();
//     return `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
//       ids.join(',')
//     )}&vs_currencies=usd`;
//   }, [fromToken, toToken]);

//   const { data, error } = useSWR(key, fetcher, { refreshInterval: 30_000 });
//   if (!data) isLoading = true;
//   if (data) {
//     rate = data[toToken.coingecko_id].usd / data[fromToken.coingecko_id].usd;
//   }

//   return [rate, key, error, isLoading];
// };

export const useCoingeckoPrice = (token: RawCoinInfo) => {
  const key = useMemo(() => {
    if (!token?.coingecko_id) return null;
    return `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
      token.coingecko_id
    )}&vs_currencies=usd`;
  }, [token]);

  const { data, error } = useSWR(key, fetcher, { refreshInterval: 30_000 });
  let price: number | undefined = undefined;
  if (data) {
    price = data[token.coingecko_id].usd;
  }
  return [price, error];
};

export const useCoingeckoValue = (token: RawCoinInfo, amount: number) => {
  const [price, error] = useCoingeckoPrice(token);
  let value: string | undefined = undefined;
  if (typeof price === 'number') {
    value = cutDecimals('' + price * amount, 2);
  }
  return [value, error];
};

// export default useCoingeckoRate;