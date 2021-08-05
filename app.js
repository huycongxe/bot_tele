const { Telegraf } = require("telegraf");
const net = require("net");
const { getSymbol, supportedSymbolsReply } = require("./symbol_helper");
const OrderHelper = require("./order_helper");

const Commands = {
  info: "info",
  test: "test",
  help: "help",
  buy: "buy",
  sell: "sell",
};

var sockets = [];

const bot = new Telegraf("1886264090:AAGiP-Ebh2HOlBDqMr1SJnGOVSMO5WweeBw");

const server = net.createServer(function (socket) {
  socket.write("Echo hello from server!");
  console.log("client joined");
  sockets.push(socket);

  socket.on("end", function () {
    console.log(socket.name + " left the broadcast.\n");
    sockets.splice(sockets.indexOf(socket), 1);
  });
  socket.pipe(socket);
});

server.listen(7099, "localhost");
bot.launch();
console.log("server launched");

// command
bot.command(Commands.buy, (ctx) => {
  console.log("buy order receive", ctx.update.message.text);
  const info = ctx.update.message.text
    .replace(`/${Commands.buy}`, "")
    .trim()
    .toLowerCase();
  const order = OrderHelper.processMessage(info);
  console.log("processed order", order);
  if (order) {
    const msg = `${Commands.buy}#${ctx.chat.id}#${order.symbol}#${order.sl}#${order.size}`;
    broadcast(msg);
  } else {
    replyUnknown(ctx);
  }
});

bot.command(Commands.sell, (ctx) => {
  console.log("sell order receive", ctx.update.message.text);
  const info = ctx.update.message.text
    .replace(`/${Commands.sell}`, "")
    .trim()
    .toLowerCase();
  const order = OrderHelper.processMessage(info);
  console.log("processed order", order);
  if (order) {
    const msg = `${Commands.sell}#${ctx.chat.id}#${order.symbol}#${order.sl}#${order.size}`;
    broadcast(msg);
  } else {
    replyUnknown(ctx);
  }
});

bot.command(Commands.info, (ctx) => {
  console.log(`msg from id: ${ctx.chat.id}, name: ${ctx.chat.first_name}`);
  const symbol = ctx.update.message.text
    .replace(`/${Commands.info}`, "")
    .trim()
    .toLowerCase();
  console.log("requesting info with context", symbol);
  const convertedSymbol = getSymbol(symbol);
  if (convertedSymbol) {
    const msg = `${Commands.info}#${ctx.chat.id}#${convertedSymbol}`;
    broadcast(msg);
  } else {
    replyUnknown(ctx);
  }
});

bot.command(Commands.help, (ctx) => {
  ctx.reply(
    "Để biết thông tin về 1 cặp tiền/hàng hoá trong ngày hôm nay, hãy nhập lệnh: \n" +
      "`/info <mã>`" +
      "\n\nhiện tại, các mã đang được hỗ trợ là: \n" +
      supportedSymbolsReply(),
    { parse_mode: "Markdown" }
  );
});

const replyUnknown = (ctx) => {
  const msg = ctx.update.message.text;
  ctx.reply(
    "Dữ liệu về  " +
      `${"`"}${msg}${"`"}` +
      "  tạm thời chưa có trong hệ thống..." +
      "\n\n👉 /help để biết thêm thông tin.",
    { parse_mode: "Markdown" }
  );
};

const broadcast = (msg) => {
  if (sockets.length === 0) {
    return;
  }

  // If there are clients remaining then broadcast message
  console.log("broadcasting message", msg);
  sockets.forEach(function (socket, index, array) {
    socket.write(msg);
  });
};

// Enable graceful stop
process.once("SIGINT", () => {
  console.log("sigint");
  bot.stop("SIGINT");
  server.removeAllListeners();
  server.close();
});
process.once("SIGTERM", () => {
  console.log("sigterm");
  bot.stop("SIGTERM");
  server.removeAllListeners();
  server.close();
});
