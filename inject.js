(() => {
    const domain = location.protocol + '//' + location.host
    const initAttr = ['data-src'] // 默认配置属性
    let configAttr = ['data-src'] // 配置的属性

    const getConfigAttrUrl = function() { //  获取所有配置属性的值
        const attrUrl = []
        if (configAttr.length > 0) {
            configAttr.forEach((attr) => {
                attrUrl.push(...getAllAttr(attr))
            })
        }
        return attrUrl
    }

    const getAllAttr = function(attr) { // 获取对应属性的值
        const attrs = []
        const allDoms = document.querySelectorAll('[' + attr + ']')
        allDoms.forEach((dom) => {
            const attrValue = dom.getAttribute(attr)
            attrs.push(concatUrl(attrValue, domain))
        })
        return attrs
    }

    const getBackgroundImage = function() { // 获取背景图片
        const allDoms = document.querySelectorAll('*')
        const allBgImageUrl = []
        allDoms.forEach((element) => {
            let url = window.getComputedStyle(element)['background-image'].match(/url\("(.+)"\)$/)
            if (url && url[1]) {
                allBgImageUrl.push(concatUrl(url[1], domain))
            }
        })
        return allBgImageUrl
    }

    const getImgUrl = function() { // 获取所有图片的src值
            const allImg = document.querySelectorAll('img')
            const allImgUrl = []
            allImg.forEach((img) => {
                allImgUrl.push(concatUrl(img.src, domain))
            })
            return allImgUrl
        }
        // 接收popup的指令，如果action为all，则获取所有图片url，如果为attr，则获取属性图片
    chrome.runtime.onMessage.addListener(({ action, attr }, sender, sendResponse) => {
        if (attr) {
            configAttr = []
            configAttr.push(...initAttr)
            configAttr.push(...attr.split(','))
        } else {
            configAttr = []
            configAttr.push(...initAttr)
        }
        if (action === 'all') {
            sendResponse({
                attrImg: getConfigAttrUrl(),
                bgImg: getBackgroundImage(),
                img: getImgUrl()
            })
        }
        if (action === 'attr') {
            sendResponse({
                attrImg: getConfigAttrUrl(),
            })
        }
    });
})();