window.onload = () => {
    new Vue({
        el: '#app',
        data() {
            return {
                isShowAttr: true, // 是否显示属性图片
                isShowBg: true, // 是否显示背景图片
                isShowImg: true, // 是否显示img图片
                attr: '', // 属性规则
                progress: '', // setTimeout进程
                imgWidth: 0, // 图片宽
                imgHeight: 0, // 图片高
                imgs: { // 图片容器
                    attrImg: [], // 属性图
                    bgImg: [], // 背景图
                    img: [], // img标签图
                },
            }
        },
        methods: {
            /**
             * 向tab发送收集图片信息，接收tab返回的图片url列表
             * @param action {string} 值为'all'或'attr'，如果为all，则收集所有图片，为attr则只收集属性图
             * @param attr {string} 用;分隔开的属性规则
             */
            sendMessage(action, attr) {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, { action, attr }, (response) => {
                        if (action === 'all') {
                            const attrImg = response.attrImg
                            const bgImg = response.bgImg
                            const img = response.img
                                // 重置容器
                            this.resetImgContainer('attrImg')
                            this.resetImgContainer('bgImg')
                            this.resetImgContainer('img')
                                // 获取图片的宽高
                            this.mapImg(this.imgs.attrImg, attrImg)
                            this.mapImg(this.imgs.bgImg, bgImg)
                            this.mapImg(this.imgs.img, img)
                        } else {
                            this.resetImgContainer('attrImg')
                            this.mapImg(this.imgs.attrImg, response.attrImg)
                        }
                    });
                });
            },
            /**
             * 遍历图片，设置图片的宽高属性
             * @param container {array} 容器
             * @param imgs {array} 图片url列表
             */
            mapImg(container, imgs) {
                imgs.forEach((src) => {
                    this.imgNatureSize(container, src)
                })
            },
            /**
             * 重置容器
             */
            resetImgContainer(key) {
                this.imgs[key] = []
            },
            /**
             * 获取图片原始宽高，并将图片push进容器
             * @param container {array} 容器
             * @param src {string} 图片url
             */
            imgNatureSize(container, src) {
                const size = {
                    width: '',
                    height: '',
                }
                let image = new Image()
                image.src = src
                image.onload = function() {
                    container.push({
                        src,
                        width: image.width,
                        height: image.height,
                    })
                }
            },
            /**
             * 获取属性图片
             */
            getAttrImg() {
                clearTimeout(this.progress)
                this.progress = setTimeout(() => {
                    this.sendMessage('attr', this.attr)
                }, 500)
            },
            /**
             * 下载图片
             */
            downLoad(url) {
                chrome.downloads.download({ url }, () => {
                    console.log('下载成功')
                })
            }
        },
        ready() {
            this.sendMessage('all', this.attr)
        }
    })
}