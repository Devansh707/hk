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
        let allChalengesArrPromise = page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled", {delay:100});
        console.log("problem reached");
        return allChalengesArrPromise;
    }).then(function (questionsArr){
        console.log("number of questions", questionsArr.length);
        let qWillbesolvedPromise = questionSolver(page, questionsArr[0], answers[0]);
        return qWillbesolvedPromise;

    }).then(function (){
        console.log("question is solved");
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

    function questionSolver(page, questionnumber, answer){
        return new Promise(function (resolve, reject) {
            let qWillbeclickedPromise = questionnumber.click();
            // code question
            // in hk editor-> ctrl + a, ctrl + x
            qWillbeclickedPromise.then(function (){
                let waitForEdotortobeFocusedPromise = waitAndClick(".monaco-editor.no-user-select.vs", page);
                return waitForEdotortobeFocusedPromise;
            }).then(function () {
                let ctrlPressedPromise = page.keyboard.down("Control");
                return ctrlPressedPromise;
            }).then(function () {
                let ctrlApressedPromise = page.keyboard.press("A", {delay:1500});
                return ctrlApressedPromise;
            }).then(function () {
                console.log("Ctrl + A, Ctrl + X Pressed");
                return page.keyboard.press("X", {delay : 500});
            }).then(function (){
                return page.keyboard.up("Control");
            }).then(function (){
                // fails because of autocomplete feature of monaco editor
                return page.keyboard.type(answer, {delay : 50});
            }).then(function(){
                resolve();
            }).catch(function (err) {
                console.log(err);
                reject(err);
            })
        })
    }


    