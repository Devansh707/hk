const loginlink = "https://www.hackerrank.com/auth/login";
const emailpassobj = require("./secrests");
const {answers} = require("./codes");
const puppeteer = require("puppeteer");

let browserStackPromise = puppeteer.launch({
    headless: false,
    // slowMo : 1000,
    defaultViewport: null,
    args: ["--start-maximized", "--disable-notifications"],
});
let page, browser;
browserStackPromise
    .then(function (browserObj) {
        console.log("Browser opened");
        browser = browserObj;
        let nTab = browserObj.newPage();
        return nTab;
    }).then(function (googlepage) {
        // page = browserObj.pages[0];
        page = googlepage;
        console.log("new tab opened");
        let gPage = googlepage.goto(loginlink);
        // browserObj.close();
        return gPage;
    }).then(function(){
        let emailwriitenpromise = page.type("input[id='input-1']", emailpassobj.email, {delay : 50});
        return emailwriitenpromise;
    }).then(function(){
        let passwordwrittenpromise = page.type("input[type='password']", emailpassobj.password, {delay : 50});
        return passwordwrittenpromise;
    }).then(function(){
        let loginclickedpromise = page.click("button[data-analytics='LoginPassword']", {delay : 50});
        return loginclickedpromise;
    }).then(function (){
        let clickedonAlgoPromise = waitAndClick("a[data-attr1='algorithms']", page);
        return clickedonAlgoPromise;
    }).then(function (){
        let warmupPromise = waitAndClick("input[value='warmup']", page);
        console.log("Till warm-up opened");
        return warmupPromise;
    }).then(function (){
        let waitfor3secondspromise = page.waitFor(3000);
        return waitfor3secondspromise;
    }).then(function (){
        let challengeclickpromise = page.click(".challenge-submit-btn", {delay:100});
        return challengeclickpromise;
    })



    function waitAndClick(selector, cPage) {
        return new Promise(function (resolve, reject) {
            let waitForModalPromise = cPage.waitForSelector(selector, { visible: true });
            waitForModalPromise
                .then(function () {
                    let clickModal =
                        cPage.click(selector, { delay: 100 });
                    return clickModal;
                }).then(function () {
                    resolve();
                }).catch(function (err) {
                    reject(err)
                })
        }
        )
    }


    