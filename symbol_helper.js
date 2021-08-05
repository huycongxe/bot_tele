const symbols = {
  XAUUSD: ["xauusd", "xau", "vàng", "gold", "xauu", "xu", "xusd"],
  USDCAD: ["usdcad", "ucad", "usdc", "uc", "u cặt", "usdcd"],
  GBPUSD: ["gbpusd", "gu", "gusd"],
  GBPJPY: ["gbpjpy", "gj", "gjpy", "gbpj"],
  EURUSD: ["eurusd", "eu", "eusd", "euru"],
  USDJPY: ["usdjpy", "uj", "usdj"],
  CHFJPY: ["chfjpy", "chfj", "cj"],
  BTCUSD: ["btcusd", "btc", "bu"],
};

const getSymbol = (symbol) => {
  for (const [key, value] of Object.entries(symbols)) {
    if (value.includes(symbol)) {
      return key;
    }
  }
};

const supportedSymbolsReply = () => {
  var text = "";
  for (const [key, value] of Object.entries(symbols)) {
    text += `👉 ${"`"}${value[0]}${"`"}\n`;
  }
  return text;
};

module.exports = {
  getSymbol,
  supportedSymbolsReply,
};
