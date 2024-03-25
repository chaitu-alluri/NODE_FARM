const fs = require("fs");
const http = require("http");
const url = require('url');

const replaceTemplate = require("./modules.js/replaceTemplate");


////////////////////////////////////////////////
//files
//blocking synchronous way
// const textIn = fs.readFileSync('./1-node-farm/starter/txt/input.txt','utf-8');
// console.log(textIn);

// const textOut =  `this is what we know abt the Avacado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./1-node-farm/starter/txt/output.txt',textOut);
// console.log('file written');

// Non-blocking syncronous way

// fs.readFile('./1-node-farm/starter/txt/start.txt','utf-8',(err, data1) =>{
//     if (err) return console.log("Error :(")
//     fs.readFile(`./1-node-farm/starter/txt/${data1}.txt`,'utf-8',(err, data2) => {
//         console.log(data2)
//         fs.readFile('./1-node-farm/starter/txt/append.txt','utf-8',(err, data3) =>{
//             console.log(data3)
//             fs.writeFile('./starter/txt/final.txt', `${data2}\n${data3}`,'utf-8', err =>{
//                 console.log("our file has been edited :)")
//             })
//         })
//     })
// })
// console.log("chaitanya")
///////////////////////////////////////////////////////
//server

const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {
    
    const{query, pathname} = url.parse(req.url, true);

    //OverView page
    
    if (pathname === '/' || pathname === '/overview'){
        

        res.writeHead(200, {'Content-type':'text/html'});
        const cardsHtml = dataObj.map(el =>replaceTemplate(tempCard, el)).join(' ');
        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
        res.end(output);

    }
     else if (pathname === '/product'){
        res.writeHead(200, {'Content-type':'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    //API
    }else if (pathname === '/api'){
        res.writeHead(200, {"Content-type":"application/json"});
        res.end(data);
    //NOT FOUND
    }else{
            res.writeHead(404, {
                'Content-type': 'text/html',
                'my-own-header':'hello-world'
            });
            res.end("<h1>Page is not found</h1>");
        }
});

server.listen(8000, '127.0.0.1', () =>{
    console.log("listening to request on port 8000");
});

