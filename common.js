// 显示错误信息
const showMsg = (msg) => {
    let myDate = new Date();
    let now = myDate.toLocaleString();
    console.log(now + "【" + msg + "】");
};
// 拼接相对路径及cdn
const concatUrl = (url, domain) => {
    let fullPath = url
    if (/^\/[^\/]+/.test(url)) { // 是否为相对路径
        fullPath = domain + url
    }
    if (/^\/\//.test(url)) { // 是否为cdn
        fullPath = 'http:' + url
    }
    return fullPath
}