var Crawler = require("crawler");
const fs = require('fs');
const Agent = require('socks5-https-client/lib/Agent');

const getFileCrawler = new Crawler({
    rateLimit: 60000,
    retryTimeout: 60000,
    agentClass: Agent, //adding socks5 https agent
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            console.log('#Got The Result.', $('title').text());
            let fileName = res.options.uri.toString();
            fileName = fileName.substring(fileName.lastIndexOf('/') + 1, fileName.length + 1);
            console.log('#File name is.', fileName);

            fs.createWriteStream(fileName).write(res.body);
        }
        done();
    }
});

fs.readFile('publications.json', function (err, res) {
    const data = JSON.parse(res);
    console.log('Data count: ', data.length);

    for (let i = 0; i < data.length; i++) {
        const { title, url } = data[i];
        console.log(i + 1, '-Set Crawler Crawling.-', title, url);

        getFileCrawler.queue(url);
    }
});

