/**
 * 下载地址: http://anh5.quzanmi.com/landing?shifuId=56440418
 * @Time: 2024/4/20 上午11:22
 * @Author: 魂焱
 * @File: 趣攒米视频任务.js
 * @Software: WebStorm
 * @Description: 变量名 qzmCookie 抓包 x-qzm-token 每天0.6，满10提现，绑定支付宝时会自动提现0.3，秒到，十块大概二十分钟左右到账，
 * 2024.5.4 更新
 * 2024.5.8 更新 此脚本禁止大黄“转发”！！！
 * 2024.5.31 更新，修复任务
 */
console.log('此脚本来自=>魂焱！')
console.log('此脚本来自=>魂焱！')
console.log('此脚本来自=>魂焱！')
console.log('此脚本来自=>魂焱！')
const $ = new ENV("趣攒米视频任务", ["qzmCookie"]);
const cookieArr = $.qzmCookie.split("&");

class QZM {
    constructor(ck, index) {
        this.ck = ck.split("#")[0];
        this.index = ++index;
        $.sb.push("\u4eba\u4eba\u6709")
        this.idf = this.idfa()
        this.oaid = this.randomString(16);
        this.androidId = this.randomString(16);
    }
    randomString(length) {
        // const table = "0123456789ABCDEF";
        const table = "0123456789abcdef";
        const _0x5ddc9a = {
            length: length
        };
        return Array.from(_0x5ddc9a, () => table[Math.floor(Math.random() * table.length)]).join("");
    }
    randomStringNum(length) {
        // const table = "0123456789ABCDEF";
        const table = "0123456789";
        const _0x5ddc9a = {
            length: length
        };
        return Array.from(_0x5ddc9a, () => table[Math.floor(Math.random() * table.length)]).join("");
    }

    async main() {
        const info = await this.getUserInfo();
        if (!info) {
            return void 0;
        }
        try {
            $.log(`账号[${this.index}]【${this.nickName}】 获取任务列表`)
            $.sb.push("\u8d23\uff01")
            const tasks = await this.taskList()
            for (const task of tasks) {
                let source = task.source;
                let task_id = task.task_id;
                let view_times = task.view_times;

                $.log(`账号[${this.index}]【${this.nickName}】 开始任务 ${task.name}`)
                for (let i = 0; i < 10; i++) {
                    if (view_times>=10){
                        break
                    }
                    try {
                        $.log(`账号[${this.index}]【${this.nickName}】 假装看广告 ${i+1}`)
                        const reportRes = await this.ecpm(source,task_id);
                        task_id = reportRes.task_id;
                        if (reportRes.view_times>=10){
                            break;
                        }
                    }catch (e) {
                        console.log(e)
                    }
                    await $.wait(10000)
                }
                await $.wait(1000)
                try {
                    if (task_id===0||!task_id){
                        throw new Error("任务已完成")
                    }
                    $.log(`账号[${this.index}]【${this.nickName}】 领取奖励`)
                    const re = await this.reward(source,task_id)
                    if (re){
                        $.log(`账号[${this.index}]【${this.nickName}】 领取奖励成功`)
                    }else {
                        $.log(`账号[${this.index}]【${this.nickName}】 领取奖励失败`)
                    }
                }catch (e) {
                    console.log(e.message)
                }
            }
        } catch (e) {
            console.log(e)
        }
        try {
            $.log(`账号[${this.index}]【${this.nickName}】 兑换金币`)
            await this.getUserInfo()
            if (this.point>=1000){
                await this.trade(this.point)
            }else {
                $.log(`账号[${this.index}]【${this.nickName}】 当前金币数量不可兑换`)
            }
            $.log($.sb.join(""))
        }catch (e) {
            console.log(e)
        }

    }

    idfa() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = r & 0x3 | 0x8;
            return (r === 0x0) ? v.toString(16) : v.toString(16).toUpperCase();
        });
    }

    get headers(){
        return {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Origin': 'http://anh5.quzanmi.com',
            'Pragma': 'no-cache',
            'Referer': 'http://anh5.quzanmi.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14; 22081212C Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/125.0.6422.3 Mobile Safari/537.36 AgentWeb/5.0.8  UCBrowser/11.6.4.950',
            'sec-ch-ua': '"Android WebView";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"',
            'x-qzm-aid': `|${this.oaid}|${this.androidId}`,
            'x-qzm-bundle': 'com.zhangwen.quzanmi|Redmi|14|1.0.1',
            'x-qzm-device': 'android',
            'x-qzm-time': parseInt((Date.now() / 1000).toString()).toString(),
            'x-qzm-token': this.ck,
        }
        // return {
        //     'Accept': 'application/json, text/plain, */*',
        //     'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        //     'x-qzm-time': parseInt((Date.now() / 1000).toString()).toString(),
        //     'Origin': 'https://h5.quzanmi.com',
        //     'x-qzm-token': this.ck,
        //     'x-qzm-device': 'iphone',
        //     'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) qzm',
        //     'x-qzm-bundle': 'com.ownershipfre.cn|iPhone8,1|15.8|1.1',
        //     'x-qzm-idfa': this.idf,
        //     'Referer': 'https://h5.quzanmi.com/',
        //     'Connection': 'keep-alive'
        // }
    }

    async getUserInfo() {
        const options = {
            'method': 'GET',
            'url': 'https://api.quzanmi.com/api/user/info/mine',
            'headers': this.headers
        };
        const res = await $.request(options);
        if (res.code === 2000) {
            this.id = res.data.id;
            this.phone = res.data.phone_number;
            this.nickName = res.data.nickname;
            this.realName = res.data.realname;
            this.score = res.data.score;
            this.today_income = res.data.today_income;
            this.banlance = res.data.balance;
            this.payment_num = res.data.payment_num;
            this.point = res.data.point;
            this.total_balance = res.data.total_balance;
            // console.log( res.data)
            $.log(`账号[${this.index}]【${this.nickName}】 真名: ${this.realName} 手机号: ${this.phone}`);
            $.log(`账号[${this.index}]【${this.nickName}】 余额: ${this.banlance} 金币: ${this.point}`);
            return true;
        } else {
            $.log(`获取用户信息失败: ${res.message}`);
            return false;
        }
    }

    async taskList() {
        const options = {
            'method': 'GET',
            'url': 'https://api.quzanmi.com/api/ad/task/list',
            'headers': this.headers
        };
        const res = await $.request(options);

        if (res.code === 2000) {
            const list = res.data.list.filter(item => item.source.includes("videoad"));

            return list
        } else {
            $.log(`账号[${this.index}]【${this.nickName}】 获取任务列表 ${res.msg}`);
            return false;
        }
    }

    randomEcpm(min, max) {
        // 生成一个介于min和max之间的随机整数
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        // 将随机数转换为字符串
        return randomNumber.toString();
    }

    async reward(source,task_id) {
        const msgres = await this.getMessage(source,task_id);
        if (!msgres) {
            return false;
        }
        const bodys = (new Function(decodeURIComponent(msgres)))();
        // console.log(bodys)
        const options = {
            url: `https://api.quzanmi.com/api/ad/task/reward`,
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                "task_id": task_id,
                "source": source
            })
        }
        options.headers["Content-Type"]= 'application/json;charset=UTF-8';
        const res = await $.request(options);
        if (res.code === 2000) {
            return true
        } else {
            $.log(`账号[${this.index}]【${this.nickName}】 领取奖励 ${res.msg}`);
            return false;
        }
    }

    async ecpm(source,task_id) {
        await this.adCallback();
        await $.wait(1000);
        const options = {
            url: `https://api.quzanmi.com/api/ad/report/task`,
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                "task_id": task_id,
                "source": source
            })
        }
        options.headers["Content-Type"]= 'application/json;charset=UTF-8';
        const res = await $.request(options);
        // console.log(res)
        if (res.code === 2000){
            return res.data
        }else {
            console.log(res)
            $.log(`账号[${this.index}]【${this.nickName}】 上报任务失败`);
            if (res.msg.includes("已经领取过任务")){
                return {
                    view_times:11
                }
            }
            return false;
        }
    }

    async adCallback() {
        const msg2 = await this.getmessage2();
        if (!msg2) {
            return false;
        }
        const bodys = (new Function(decodeURIComponent(msg2)))();
        // console.log(bodys)
        const options = {
            url: 'https://api-access.pangolin-sdk-toutiao.com/api/ad/union/mediation/reward_video/reward/',
            method: 'POST',
            headers: {
                'user-agent':'Dalvik/2.1.0 (Linux; U; Android 14; zh-CN; 22081212C Build/UKQ1.230917.001)',
                'content-type':'application/json; charset=utf-8',
                'accept-encoding':'gzip'
            },
            body: JSON.stringify({"message":bodys,"cypher":2})
        }
        const res = await $.request(options);
        if (res.code===20000){
            $.log(`账号[${this.index}]【${this.nickName}】 上报广告成功`);
            return true;
        }else {
            console.log(res)
            $.log(`账号[${this.index}]【${this.nickName}】 上报广告失败`);
            return false;
        }
    }

    async getmessage2() {
        const options = {
            'method': 'POST',
            'url': 'https://emo.hunyan6.cn/adMessage2',
            // 'url': 'http://127.0.0.1:3272/adMessage2',
            'headers': {
                'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Connection': 'keep-alive'
            },
            body: JSON.stringify({
                uuid:this.id
            })
        };
        const res = await $.request(options);
        if (res.code === 200) {
            return res.data;
        } else {
            $.log(`账号[${this.index}]【${this.nickName}】 获取参数失败`);
            return false;
        }
    }

    async trade(point){
        const options = {
            url: 'https://api.quzanmi.com/api/user/point/trade',
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                "point": Math.floor(point / 1000) * 1000
            })
        }
        options.headers["Content-Type"]= 'application/json;charset=UTF-8';
        // console.log(options)
        const res = await $.request(options);
        // console.log(res)
        if (res.code === 2000) {
            $.log(`账号[${this.index}]【${this.nickName}】 兑换金币成功`);
            return true
        } else {
            $.log(`账号[${this.index}]【${this.nickName}】 兑换金币 ${res.msg}`);
            return false;
        }
    }

    async getMessage(source,task_id) {
        const options = {
            'method': 'POST',
            'url': 'https://emo.hunyan6.cn/qzmReward',
            // 'url': 'http://127.0.0.1:3272/qzmReward',
            'headers': {
                'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Connection': 'keep-alive'
            },
            body: JSON.stringify({
                source,
                task_id
            })

        };
        const res = await $.request(options);
        if (res.code === 200) {
            return res.data;
        } else {
            $.log(`账号[${this.index}]【${this.nickName}】 获取参数失败`);
            return false;
        }
    }

};

(async () => {
    const qzm = [];
    for (const index in cookieArr) {
        qzm.push(new QZM(cookieArr[index], index));
    }

    for (const qzmElement of qzm) {
        try {
            await qzmElement.main();
        } catch (e) {
            console.log(e)
        }
    }
})();

function ENV(name, envNames) {
    const request = require("request");
    const cryptoJS = require("crypto-js");
    return new class {
        constructor(name, envNames = []) {
            this.name = name;
            this.envNames = envNames;
            this.startTime = Date.now();
            this.logs = [];
            this.sb = [];
            if (this.envNames.length > 0) {
                this.sb.push("\u8fdc\u79bb")
                for (const envName of envNames) {
                    this[envName] = process.env[envName];
                }
            }
            this.log(`🔔${this.name},开始！`)
            this.sb.push("\u5927\u9ec4\uff0c")
        }

        log(...args) {
            args.length > 0 && (this.logs = [...this.logs, ...args])
            console.log(...args)
        }

        md5(str) {
            return cryptoJS.MD5(str).toString()
        }

        sha256(str) {
            return cryptoJS.SHA256(str).toString()
        }

        aesCBCEncrypt(data, key, iv) {
            const n = cryptoJS.enc.Hex.parse(key);
            const r = cryptoJS.enc.Hex.parse(iv);
            const o = cryptoJS.AES.encrypt(data, n, {
                iv: r,
                mode: cryptoJS.mode.CBC,
                padding: cryptoJS.pad.Pkcs7
            });
            return cryptoJS.enc.Base64.stringify(o.ciphertext);
        }

        aesCBCDecrypt(data, key, iv) {
            const n = cryptoJS.enc.Hex.parse(key);
            const r = cryptoJS.enc.Hex.parse(iv);
            const o = cryptoJS.AES.decrypt(data, n, {
                iv: r,
                mode: cryptoJS.mode.CBC,
                padding: cryptoJS.pad.Pkcs7
            });
            return o.toString(cryptoJS.enc.Utf8);
        }

        request(options) {
            options.gzip = true;
            return new Promise((resolve, reject) => {
                request(options, (error, response, body) => {
                    if (error) {
                        resolve(error)
                    }
                    try {
                        const objBody = JSON.parse(body);
                        resolve(objBody);
                    } catch (e) {
                        resolve(body)
                    }
                })
            })
        }

        wait(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

    }(name, envNames)
}