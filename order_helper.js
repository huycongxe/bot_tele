const { getSymbol } = require("./symbol_helper");

const processMessage = (msg) => {
  const infos = msg.split("-");
  if (infos.length > 1) {
    const symbol = infos[0];
    const sl = infos[1];
    var size = infos[2];
    if (!size) size = 1;
    const convertedSymbol = getSymbol(symbol);
    return {
      symbol: convertedSymbol,
      size: size,
      sl: sl,
    };
  }
};

module.exports = {
  processMessage,
};
