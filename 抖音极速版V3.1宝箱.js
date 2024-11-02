/**
 * 
 * 项目类型：APP
 * 项目名称：抖音极速版
 * 项目更新：2023-08-30
 * 项目抓包：抓*-normal-c-lq.amemv.com下的宝箱url#cookie#x-argus#x-ladon#user-agent填入变量
 * 开启抓包，点击宝箱获得金币，点击弹出的看广告，看完一段广告，搜索/luckycat/aweme/v1/task/done/excitation_ad
 * 项目抓包：复制/luckycat/aweme/v1/task/done/excitation_ad?后面的值，后面的值#cookie#x-argus#x-ladon#user-agent
 * 项目变量：lekebo_dyjsb_Cookie
 * 项目定时：每30分钟运行一次
 * 定时规则: * 25 0-23 * * *
 * 
 * 版本功能: 签到、宝箱、广告、步数、直播、搜索、小岛、种殖、农场、刷视频、兑换、乐园抽奖，后期会完善待增加的功能
 * 
 * 更新内容: 更新看广告参数，增加时间控制设定等，宝箱时间设置为每25分钟运行一次。
 * 
 * github仓库：https://github.com/qq274023/lekebo
 * 
 * 交流Q群：104062430 作者:乐客播 欢迎前来提交bug
 */

const $ = new Env("抖音极速版-宝箱");
//-------------------- 一般不动变量区域 -------------------------------------
const notify = $.isNode() ? require("./sendNotify") : "";
const CryptoJS = require("crypto-js");
const Notify = 0;		      //通知设置      0关闭  1开启
let debug = 0;                //Debug调试     0关闭  1开启
let envSplitor = ["@", "\n"]; //多账号分隔符
let ck = msg = '';            //let ck,msg
let versionupdate = "0";      //版本对比升级   0关闭  1开启
let boxstoptims = "18";       //宝箱广告金币低于指定数量停止执行 18则是18金币
let stoptims = "20";          //看广告超指定时间停止   填写注意：1代表1分钟，3代表3分钟
//===============脚本版本=================//
let scriptVersion = "v3.1";
let update_tines = "2023-08-30";
let update_data = "2023-12-12";   //测试时间
let scriptVersionLatest = "v3.1"; //版本对比
let userCookie = ($.isNode() ? process.env.lekebo_dyjsb_Cookie : $.getdata('lekebo_dyjsb_Cookie')) || '';
let userList = [];
let userIdx = 0;
let date = require('silly-datetime');
let signTime = date.format(new Date(),'YYYY-MM-DD');
let timeHours = parseInt($.time('HH'));
let times = Math.round(new Date().getTime() / 1000).toString();  //10位时间戳
let timestamp = Math.round(new Date().getTime()).toString();     //13位时间戳
let outtimes = Math.round(new Date().getTime() + (stoptims * 60000)).toString();
let host = 'api5-normal-c-lq.amemv.com';
let hostname = 'http://' + host;
//---------------------- 自定义变量区域 -----------------------------------
async function start() {
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.getMemberInfo(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 查询账号收益变动 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.getMemberScore(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行开宝箱赚金币 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.treasure(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
}

class UserInfo {
    constructor(str) {
        this.index = ++userIdx;
        this.ck = str.split('#');
        this.xvcbdturingsdkversion = '3.6.2.cn';
        this.passportsdkversion = '203135';
        this.iid = this.ck[0].match(/iid=([\w-]+)/)[1];
        this.device_id = this.ck[0].match(/device_id=([\w-]+)/)[1];
        this.aid = this.ck[0].match(/aid=([\w-]+)/)[1];
        this.luckydog_base = this.ck[0].match(/luckydog_base=([\w-]+)/)[1];
        this.luckydog_data = this.ck[0].match(/luckydog_data=([\w-]+)/)[1];
        this.luckydog_token = this.ck[0].match(/luckydog_token=([\w-]+)/)[1];
        this.version_code = this.ck[0].match(/version_code=([\w-]+)/)[1];
        this.version_name = '26.7.0';
        this.device_type = this.ck[0].match(/device_type=([\w-]+)/)[1];
        this.device_brand = this.ck[0].match(/device_brand=([\w-]+)/)[1];
        this.host_abi = this.ck[0].match(/host_abi=([\w-]+)/)[1];
        this.os_api = '33';
        this.os_version = this.ck[0].match(/os_version=([\w-]+)/)[1];
        this.rom = this.ck[0].match(/rom=(\w+)/)[1];
        this.rom_version = this.ck[0].match(/rom_version=([\w-]+)/)[1];
        this.manifest_version_code = this.ck[0].match(/manifest_version_code=([\w-]+)/)[1];
        this.resolution = '1080*2166';
        this.dpi = this.ck[0].match(/dpi=(\w+)/)[1];
        this.update_version_code = this.ck[0].match(/update_version_code=([\w-]+)/)[1];
        this.luckydog_api_version = '8.12.0-rc.4-dy';
        this.luckycat_version_code = '890100';
        this.lucky_device_score = '8.3056';
    }
// ============================================执行项目============================================ \\
    async getMemberInfo(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/v1/user/profile/self/?${this.ck[0]}`,
                headers: {
                    'Content-Type': 'application/json',
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = isJSON(data);
                        if (result == true) {
                            let result = JSON.parse(data);
                            if (result.status_code == 0) {
                                DoubleLog(`\n ✅ 【${this.index}】用户信息: ${result.user.bind_phone}，${result.user.nickname}`)
                            } else {
                                DoubleLog(`\n ❌ 【${this.index}】用户信息: ${result.err_tips}`)
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】用户信息: 无法找到该CK的用户信息`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async getMemberScore(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/aweme/v1/task/page?${this.ck[0]}`,
                headers: {
                    'Content-Type': 'application/json',
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】金币收益: 今日收入 ${result.data.income_data.amount1} 金币,余额${result.data.income_data.amount2 / 100}元`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】金币收益: ${result.err_tips}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async treasure(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/aweme/v1/task/page?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'x-vc-bdturing-sdk-version': this.xvcbdturingsdkversion,
                    'passport-sdk-version': this.passportsdkversion,
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let cur_time = result.data.treasure_box.treasure_stats.cur_time;
                            let next_time = result.data.treasure_box.treasure_stats.next_time;
                            if (next_time <= cur_time) {
                                DoubleLog(`\n ✅ 【${this.index}】打开宝箱: 正在执行获取宝箱任务请等待...`);
								await $.wait(1000);
                                await this.open_treasure(2 * 1000);
                            } else {
                                DoubleLog(`\n ❌ 【${this.index}】打开宝箱: 下次开宝箱：${$.time('yyyy-MM-dd HH:mm:ss', next_time * 1000)}`);
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱广告: ${result.err_tips}`);
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async open_treasure(timeout = 2000) {
        return new Promise((resolve) => {
            let timeouts = Math.round(new Date().getTime()).toString();
            let url = {
                url: `${hostname}/luckycat/aweme/v1/task/done/treasure_task?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'x-vc-bdturing-sdk-version': this.xvcbdturingsdkversion,
                    'passport-sdk-version': this.passportsdkversion,
                    'X-Khronos': times,
                    'X-SS-REQ-TICKET': timestamp,
				    'Cookie': this.ck[1],
                    'X-Argus': this.ck[2],
                    'X-Ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
                body: `{}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    let result = isJSON(data);
                    if (result == true) {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let treasureamount = result.data.excitation_ad_info.score_amount;
                            let treasureadid = result.data.excitation_ad_info.ad_id;
                            let treasurereqid = result.data.excitation_ad_info.req_id;
                            this.treasurereqid = result.data.excitation_ad_info.req_id;
                            DoubleLog(`\n ✅ 【${this.index}】打开宝箱: 获得 ${result.data.amount} 金币,广告预计${treasureamount}金币`);
                            await $.wait(1000);
                            if (treasureamount > boxstoptims) {
                                await this.treasure_video(treasureamount,treasureadid,treasurereqid,outtimes,2 * 1000);
                            } else {
                                DoubleLog(`\n ❌ 【${this.index}】打开宝箱: 防止黑号，此账号停止看广告`);
                            }
                        } else {
                            if (timeouts > outtimes) {
                                DoubleLog(`\n ❌ 【${this.index}】温馨提示: 在指定 ${stoptims} 分钟内没执行完成停止`);
                            } else {
                                await this.open_treasure(2 * 1000);
                            }
                        }
                    } else {
                        if (timeouts > outtimes) {
                            DoubleLog(`\n ❌ 【${this.index}】温馨提示: 在指定 ${stoptims} 分钟内没执行完成停止`);
                        } else {
                            await this.open_treasure(2 * 1000);
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async treasure_video(treasureamount,treasureadid,treasurereqid,opentimes,timeout = 2000) {
        return new Promise((resolve) => {
            let timeouts = Math.round(new Date().getTime()).toString();
            let url = {
                url: `${hostname}/luckycat/aweme/v1/task/done/excitation_ad_treasure_box?luckydog_base=${this.luckydog_base}&luckydog_data=${this.luckydog_data}&luckydog_token=${this.luckydog_token}&luckydog_sdk_version=${this.luckydog_api_version}&luckydog_api_version=${this.luckydog_api_version}&static_settings_version=51&dynamic_settings_version=51&polling_settings_version=0&iid=${this.iid}&device_id=${this.device_id}&ac=wifi&channel=independent_gray_${this.update_version_code}&aid=${this.aid}&app_name=douyin_lite&version_code=${this.version_code}&version_name=${this.version_name}&device_platform=android&os=android&ssmix=a&device_type=${this.device_type}&device_brand=${this.device_brand}&language=zh&os_api=${this.os_api}&os_version=${this.os_version}&manifest_version_code=${this.manifest_version_code}&resolution=${this.resolution}&dpi=${this.dpi}&update_version_code=${this.update_version_code}&_rticket=${timestamp}&gold_container=0&last_deeplink_update_version_code=0&cpu_support64=true&host_abi=${this.host_abi}&is_guest_mode=0&app_type=normal&minor_status=0&appTheme=light&need_personal_recommend=1&is_android_pad=0&is_android_fold=0&ts=${times}&rom=${this.rom}&has_alipay=1&p_switch=1&launch_method=enter_launch&rom_version=${this.rom_version}&luckycat_version_name=${this.luckydog_api_version}&luckycat_version_code=${this.luckycat_version_code}&lucky_is_32=0&lucky_device_score=${this.lucky_device_score}&lucky_device_type=${this.device_type}&status_bar_height=37&md=0`,
                //url: `${hostname}/luckycat/aweme/v1/task/done/excitation_ad_treasure_box?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'x-vc-bdturing-sdk-version': this.xvcbdturingsdkversion,
                    'passport-sdk-version': this.passportsdkversion,
                    'X-Khronos': times,
                    'X-SS-REQ-TICKET': timestamp,
				    'Cookie': this.ck[1],
                    'X-Argus': this.ck[2],
                    'X-Ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
                body: `{"amount":"1200","inspire_modal_add_modal_manage":false,"ad_rit":"${treasureadid}","ad_inspire":"{\"score_amount\":\"1200\",\"amount\":\"1200\",\"req_id\":\"${treasurereqid}\"}","task_key":"excitation_ad_treasure_box","stage_score_amount":[],"ad_alias_position":"box","need_reward":true,"finish_action":0,"params_for_special":"luckydog_sdk","static_settings_version":51,"dynamic_settings_version":51,"poll_settings_version":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    let result = isJSON(data);
                    if (result == true) {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】宝箱广告: 获得奖励 ${result.data.amount} 金币，执行广告追加`);
                            await $.wait(1000);
                            await this.treasure_round_one(result.data.aggr_info.aggr_income_id,outtimes,2 * 1000);
                        } else {
                            if (timeouts > opentimes) {
                                DoubleLog(`\n ❌ 【${this.index}】温馨提示: 在指定 ${stoptims} 分钟内没执行完成停止`);
                            } else {
                                await this.treasure_video(treasureamount,treasureadid,treasurereqid,opentimes,2 * 1000);
                            }
                        }
                    } else {
                        if (timeouts > opentimes) {
                            DoubleLog(`\n ❌ 【${this.index}】温馨提示: 在指定 ${stoptims} 分钟内没执行完成停止`);
                        } else {
                            await this.treasure_video(treasureamount,treasureadid,treasurereqid,opentimes,2 * 1000);
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async treasure_round_one(aggrincomeid,opentimes,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/aweme/v1/task/excitation_ad/one_more/detail?task_key=excitation_ad_treasure_box&rit=28038&creator_id=12317000&one_more_round=0&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'x-vc-bdturing-sdk-version': this.xvcbdturingsdkversion,
                    'passport-sdk-version': this.passportsdkversion,
                    'X-Khronos': times,
                    'X-SS-REQ-TICKET': timestamp,
				    'Cookie': this.ck[1],
                    'X-Argus': this.ck[2],
                    'X-Ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】一追预计: 广告预计追加奖励 ${result.data.amount} 金币`);
                            await this.treasure_video_one(aggrincomeid,opentimes,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】一追加计: ${result.err_tips}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async treasure_video_one(aggrincomeid,opentimes,timeout = 2000) {
        return new Promise((resolve) => {
            let timeouts = Math.round(new Date().getTime()).toString();
            let url = {
                url: `${hostname}/luckycat/aweme/v1/task/done/excitation_ad/one_more?iid=${this.iid}&device_id=${this.device_id}&ac=wifi&channel=independent_gray_26709926&aid=${this.aid}&app_name=douyin_lite&version_code=${this.version_code}&version_name=${this.version_name}&device_platform=android&os=android&ssmix=a&device_type=${this.device_type}&device_brand=${this.device_brand}&language=zh&os_api=${this.os_api}&os_version=${this.os_version}&manifest_version_code=${this.manifest_version_code}&resolution=${this.resolution}&dpi=${this.dpi}&update_version_code=${this.update_version_code}&_rticket=${timestamp}&gold_container=0&last_deeplink_update_version_code=0&cpu_support64=true&host_abi=arm64-v8a&is_guest_mode=0&app_type=normal&minor_status=0&appTheme=light&need_personal_recommend=1&is_android_pad=0&is_android_fold=0&ts=${times}&md=0`,
                //url: `${hostname}/luckycat/aweme/v1/task/done/excitation_ad/one_more?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'x-vc-bdturing-sdk-version': this.xvcbdturingsdkversion,
                    'passport-sdk-version': this.passportsdkversion,
                    'X-Khronos': times,
                    'X-SS-REQ-TICKET': timestamp,
				    'Cookie': this.ck[1],
                    'X-Argus': this.ck[2],
                    'X-Ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
                body: `{"task_key":"excitation_ad_treasure_box","rit":"28038","creator_id":"12317000","one_more_round":0,"aggr_income_id":"${aggrincomeid}"}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    let result = isJSON(data);
                    if (result == true) {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】一追奖励: 获得奖励 ${result.data.amount} 金币，执行二次追加`);
                            await $.wait(1000);
                            await this.treasure_round_one(result.data.aggr_info.aggr_income_id,2 * 1000);
                        } else {
                            if (timeouts > opentimes) {
                                DoubleLog(`\n ❌ 【${this.index}】温馨提示: 在指定 ${stoptims} 分钟内没执行完成停止`);
                            } else {
                                await this.treasure_video_one(aggrincomeid,opentimes,2 * 1000);
                            }
                        }
                    } else {
                        if (timeouts > opentimes) {
                            DoubleLog(`\n ❌ 【${this.index}】温馨提示: 在指定 ${stoptims} 分钟内没执行完成停止`);
                        } else {
                            await this.treasure_video_one(aggrincomeid,opentimes,2 * 1000);
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async treasure_round_two(aggrincomeid,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/aweme/v1/task/excitation_ad/one_more/detail?task_key=excitation_ad_treasure_box&rit=28038&creator_id=12317000&one_more_round=1&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'x-vc-bdturing-sdk-version': this.xvcbdturingsdkversion,
                    'passport-sdk-version': this.passportsdkversion,
                    'X-Khronos': times,
                    'X-SS-REQ-TICKET': timestamp,
				    'Cookie': this.ck[1],
                    'X-Argus': this.ck[2],
                    'X-Ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】二追预计: 广告预计追加奖励 ${result.data.amount} 金币`);
                            await this.treasure_video_two(aggrincomeid,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】二追加计: ${result.err_tips}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async treasure_video_two(aggrincomeid,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/aweme/v1/task/done/excitation_ad/one_more?iid=${this.iid}&device_id=${this.device_id}&ac=wifi&channel=independent_gray_26709926&aid=${this.aid}&app_name=douyin_lite&version_code=${this.version_code}&version_name=${this.version_name}&device_platform=android&os=android&ssmix=a&device_type=${this.device_type}&device_brand=${this.device_brand}&language=zh&os_api=${this.os_api}&os_version=${this.os_version}&manifest_version_code=${this.manifest_version_code}&resolution=${this.resolution}&dpi=${this.dpi}&update_version_code=${this.update_version_code}&_rticket=${timestamp}&gold_container=0&last_deeplink_update_version_code=0&cpu_support64=true&host_abi=arm64-v8a&is_guest_mode=0&app_type=normal&minor_status=0&appTheme=light&need_personal_recommend=1&is_android_pad=0&is_android_fold=0&ts=${times}&md=0`,
                //url: `${hostname}/luckycat/aweme/v1/task/done/excitation_ad/one_more?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'x-vc-bdturing-sdk-version': this.xvcbdturingsdkversion,
                    'passport-sdk-version': this.passportsdkversion,
                    'X-Khronos': times,
                    'X-SS-REQ-TICKET': timestamp,
				    'Cookie': this.ck[1],
                    'X-Argus': this.ck[2],
                    'X-Ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
                body: `{"task_key":"excitation_ad_treasure_box","rit":"28038","creator_id":"12317000","one_more_round":1,"aggr_income_id":"${aggrincomeid}"}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    let result = isJSON(data);
                    if (result == true) {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】二追奖励: 获得奖励 ${result.data.amount} 金币，执行三次追加`);
                            await $.wait(1000);
                            await this.treasure_round_three(result.data.aggr_info.aggr_income_id,2 * 1000);
                        } else {
                            await this.treasure_video_two(aggrincomeid,2 * 1000);
                        }
                    } else {
                        await this.treasure_video_two(aggrincomeid,2 * 1000);
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async treasure_round_three(aggrincomeid,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/aweme/v1/task/excitation_ad/one_more/detail?task_key=excitation_ad_treasure_box&rit=28038&creator_id=12317000&one_more_round=2&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'x-vc-bdturing-sdk-version': this.xvcbdturingsdkversion,
                    'passport-sdk-version': this.passportsdkversion,
                    'X-Khronos': times,
                    'X-SS-REQ-TICKET': timestamp,
				    'Cookie': this.ck[1],
                    'X-Argus': this.ck[2],
                    'X-Ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】三追预计: 广告预计追加奖励 ${result.data.amount} 金币`);
                            await this.treasure_video_three(aggrincomeid,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】三追加计: ${result.err_tips}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async treasure_video_three(aggrincomeid,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/aweme/v1/task/done/excitation_ad/one_more?iid=${this.iid}&device_id=${this.device_id}&ac=wifi&channel=independent_gray_26709926&aid=${this.aid}&app_name=douyin_lite&version_code=${this.version_code}&version_name=${this.version_name}&device_platform=android&os=android&ssmix=a&device_type=${this.device_type}&device_brand=${this.device_brand}&language=zh&os_api=${this.os_api}&os_version=${this.os_version}&manifest_version_code=${this.manifest_version_code}&resolution=${this.resolution}&dpi=${this.dpi}&update_version_code=${this.update_version_code}&_rticket=${timestamp}&gold_container=0&last_deeplink_update_version_code=0&cpu_support64=true&host_abi=arm64-v8a&is_guest_mode=0&app_type=normal&minor_status=0&appTheme=light&need_personal_recommend=1&is_android_pad=0&is_android_fold=0&ts=${times}&md=0`,
                //url: `${hostname}/luckycat/aweme/v1/task/done/excitation_ad/one_more?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'x-vc-bdturing-sdk-version': this.xvcbdturingsdkversion,
                    'passport-sdk-version': this.passportsdkversion,
                    'X-Khronos': times,
                    'X-SS-REQ-TICKET': timestamp,
				    'Cookie': this.ck[1],
                    'X-Argus': this.ck[2],
                    'X-Ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
                body: `{"task_key":"excitation_ad_treasure_box","rit":"28038","creator_id":"12317000","one_more_round":2,"aggr_income_id":"${aggrincomeid}"}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    let result = isJSON(data);
                    if (result == true) {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】三追奖励: 获得奖励 ${result.data.amount} 金币`);
                            await this.treasure_detail(2 * 1000);
                        } else {
                            await this.treasure_video_three(aggrincomeid,2 * 1000);
                        }
                    } else {
                        await this.treasure_video_three(aggrincomeid,2 * 1000);
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async treasure_detail(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/ug/lite/excitation_ad/comment/detail?aggr_income_id=${this.treasurereqid}&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'x-vc-bdturing-sdk-version': this.xvcbdturingsdkversion,
                    'passport-sdk-version': this.passportsdkversion,
                    'X-Khronos': times,
                    'X-SS-REQ-TICKET': timestamp,
				    'Cookie': this.ck[1],
                    'X-Argus': this.ck[2],
                    'X-Ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】累计奖励: 本次累计收入 ${result.data.reward} 金币`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】累计奖励: ${result.err_tips}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
}
// ============================================结束项目============================================ \\
!(async () => {
    if (!(await checkEnv())) return;
    if (userList.length > 0) {
        console.log(`\n🎉会员注册：http://www.lekebo.top`);
        console.log(`\n🎉交流 Q群：104062430、317929242`);
        console.log(`\n================ 共找到 ${userList.length} 个账号 ================ \n\n 脚本执行✌北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000).toLocaleString()} `);
        if (versionupdate == 1) {
            await getVersion();
            console.log(`\n================ 版本对比检查更新 ===============`)
            if (scriptVersionLatest != scriptVersion) {
                console.log(`\n 当前版本：${scriptVersion}，更新时间：${update_tines}`)
                console.log(`\n 最新版本：${scriptVersionLatest}`)
                console.log(`\n 更新信息：${update_data}`)
            } else {
                console.log(`\n 版本信息：${scriptVersion} ，已是最新版本无需更新开始执行脚本`)
            }
        } else {
            console.log(`\n================ 版本对比检查更新 ===============`)
            console.log(`\n 当前版本:${scriptVersion}，更新时间:${update_tines}，已设不更新版本`);
        }
        console.log(`\n================ 开始执行会员脚本 ===============`)
        await start();
    }
    console.log(`\n================ 本次运行脚本结束 ===============`);
    //await SendMsg(msg);
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());
// ============================================变量检查============================================ \\
async function checkEnv() {
    if (userCookie) {
        let e = envSplitor[0];
        for (let o of envSplitor)
            if (userCookie.indexOf(o) > -1) {
                e = o;
                break;
            }
        for (let n of userCookie.split(e)) n && userList.push(new UserInfo(n));
        userCount = userList.length;
    } else {
        console.log(`\n\n 温馨提示：您没有建立系统变量或者没填写参数\n\n`);
        return;
    }
    return true;
}
// ============================================获取远程版本============================================ \\
function getVersion(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://ghproxy.com/https://raw.githubusercontent.com/qq274023/lekebo/master/lekebo_dyjsb.js`,
        }
        $.get(url, async (err, resp, data) => {
            try {
                scriptVersionLatest = data.match(/scriptVersion = "([\d\.]+)"/)[1]
                update_data = data.match(/update_data = "(.*?)"/)[1]
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}
// ============================================项目所需参数============================================ \\
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            let obj = JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }
        } catch(e) {
            return false;
        }
    }
}
/**
 * 随机 数字 + 大写字母 生成
 */
function randomString(e) {
    e = e || 32;
    var t = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}
/**
 * 随机 数字 + 小写字母 生成
 */
function randomsstring(e, t = "abcdefhijkmnprstwxyz123456789") {
        e = e || 32;
        let a = t.length,
            n = "";
        for (let i = 0; i < e; i++)
            n += t.charAt(Math.floor(Math.random() * a));
        return n
    }
function randomNum(min, max) {
	if (arguments.length === 0) return Math.random()
	if (!max) max = 10 ** (Math.log(min) * Math.LOG10E + 1 | 0) - 1
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function getTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear(),
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
        D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()),
        h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()),
        m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()),
        s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
}
// ============================================结束项目所需参数============================================ \\
function DoubleLog(data) { if ($.isNode()) { if (data) { console.log(`${data}`); msg += `${data}` } } else { console.log(`${data}`); msg += `${data}` } }
async function SendMsg(message) { if (!message) return; if (Notify > 0) { if ($.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify($.name, message) } else { $.msg($.name, '', message) } } else { console.log(message) } }
function MD5Encrypt(a) { function b(a, b) { return a << b | a >>> 32 - b } function c(a, b) { var c, d, e, f, g; return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f } function d(a, b, c) { return a & b | ~a & c } function e(a, b, c) { return a & c | b & ~c } function f(a, b, c) { return a ^ b ^ c } function g(a, b, c) { return b ^ (a | ~c) } function h(a, e, f, g, h, i, j) { return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e) } function i(a, d, f, g, h, i, j) { return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d) } function j(a, d, e, g, h, i, j) { return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d) } function k(a, d, e, f, h, i, j) { return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d) } function l(a) { for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++; return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g } function m(a) { var b, c, d = "", e = ""; for (c = 0; 3 >= c; c++)b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2); return d } function n(a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", c = 0; c < a.length; c++) { var d = a.charCodeAt(c); 128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128)) } return b } var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21; for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16)p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s); var O = m(t) + m(u) + m(v) + m(w); return O.toLowerCase() }
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
