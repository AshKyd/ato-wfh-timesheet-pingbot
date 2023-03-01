const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const ping = require("ping");
const dns = require("node:dns");

let resolver = dns;
if (process.env.DNS_RESOLVER) {
  resolver = new dns.Resolver();
  console.log(new Date(), "using custom resolver", process.env.DNS_RESOLVER);
  resolver.setServers([process.env.DNS_RESOLVER]);
}

let hour = new Date().getHours();
let isActive = false;

const hostname = process.env.TRACK_HOSTNAME;
const persistFile = path.join(__dirname, `db/log-${hostname}.txt`);

try {
  fs.writeFileSync(persistFile, "", { flag: "wx" });
} catch (e) {
  console.error(new Date(), "not writing db", persistFile, e.message);
}

function writeEntry(entry) {
  const entryText = entry ? "home" : "not home";
  console.log(new Date(), "writing entry", entryText);
  fs.appendFileSync(
    persistFile,
    [new Date().toISOString(), entryText].join("\t") + "\n"
  );
}

console.log(new Date(), "starting cron for", hostname);

function go() {
  const newHour = new Date().getHours();
  if (hour !== newHour) {
    hour = newHour;
    isActive = false;
  }

  if (isActive) {
    console.log(new Date(), "machine was already online this hour, skipping");
    return;
  }
  dns.resolve4(hostname, (err, ip) => {
    if (err) {
      console.log(new Date(), "IP not found", err.message);
      return;
    }
    ping.sys.probe(ip, function (isAlive) {
      if (!isAlive) {
        console.log(new Date(), "machine " + ip + " is offline");
        return;
      }
      console.log(new Date(), "machine is online");
      isActive = true;

      writeEntry(isActive);
    });
  });
}
cron.schedule("* * * * *", go);
go();

const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.status(500);
  res.send();
});

app.use(express.static("db"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
