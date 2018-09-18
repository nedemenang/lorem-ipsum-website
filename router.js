var queryString = require("querystring")
var renderer = require('./renderer.js')
var generator = require("./generator.js")

var commonHeaders = {'Content-Type': 'text/html'}


function home(request, response) {
    if(request.url === "/"){
        if(request.method.toLowerCase() === "get"){
            response.writeHead(200, commonHeaders);
            renderer.view("header", {}, response)
            renderer.view("search", {}, response)
            renderer.view("footer", {}, response)
            response.end()

        } else {
            request.on("data", function(postBody){
                var query = queryString.parse(postBody.toString())
                response.writeHead(303, {"Location": "/" + query.what  + "/" + query.username});
                response.end()
            })
           
        }
    }
}

function user(request, response){
    if (request.url !== "/") {
        var wording = "";
        var url = request.url.replace("/","");
        if (url.length > 0) {
            response.writeHead(200, commonHeaders);
            renderer.view("header", {}, response)
            urlArray = url.split('/');
            if (urlArray[0] === "sentences"){
                wording = generator.getSentences(urlArray[1])
            } else if (urlArray[0] === "paragraphs") {
                wording = generator.getParagraphs(urlArray[1])
            } else {
                wording = generator.getWords(urlArray[1])
            }
            var values = {
                wording: wording
            }
            renderer.view("header", {}, response)
            renderer.view("profile", values, response)
            renderer.view("footer", {}, response)
            response.end()
        }
    }
}



module.exports.home = home;
module.exports.user = user;