const fs = require("fs");
const http = require("http");
const url = require("url");

const data = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
let home = fs.readFileSync(`${__dirname}/main.html`, "utf-8");
let individualPage = fs.readFileSync(
  `${__dirname}/individualPage.html`,
  "utf-8"
);
let contactUs = fs.readFileSync(`${__dirname}/contact.html`, "utf-8");
let aboutUs = fs.readFileSync(`${__dirname}/about.html`, "utf-8");
let errorPage = fs.readFileSync(`${__dirname}/errorPage.html`, "utf-8");
const cards = fs.readFileSync(`${__dirname}/template.html`, "utf-8");
const header = fs.readFileSync(`${__dirname}/header.html`, "utf-8");
const dataObject = JSON.parse(data);

const replaceTemplate = (temp, ele) => {
  let data;
  if (ele) {
    data = temp.replace(/{%NAME%}/, ele.name);
    data = data.replace(/{%AGE%}/, ele.age);
    data = data.replace(/{%ID%}/, ele.id);
    data = data.replace(/{%JOB%}/, ele.job);
    data = data.replace(/{%DATA%}/, ele.data);
    data = data.replace(/%TITLE%/, ele.name);
    return data;
  }
};

home = home.replace("{%HEADER%}", header);
individualPage = individualPage.replace("{%HEADER%}", header);
aboutUs = aboutUs.replace("{%HEADER%}", header);
contactUs = contactUs.replace("{%HEADER%}", header);
errorPage = errorPage.replace("{%HEADER%}", header);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  const currentUrl = pathname;

  if (currentUrl === "/") {
    const cardsHTML = dataObject
      .map((ele) => replaceTemplate(cards, ele))
      .join("");
    const homeFinal = home.replace("{%CARDS%}", cardsHTML);
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    res.end(homeFinal);
  } else if (currentUrl === "/about") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(aboutUs);
  } else if (currentUrl === "/contact") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(contactUs);
  } else if (currentUrl === "/person") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const individualPageFinal = replaceTemplate(
      individualPage,
      dataObject.find((ele) => ele.id === query.id)
    );
    res.end(individualPageFinal);
  } else if (currentUrl === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404);
    res.end(errorPage);
  }
});

server.listen(9000, "127.0.0.1", () => {
  console.log("listening...");
});
