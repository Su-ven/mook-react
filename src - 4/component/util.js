let util = {};

class DateTime{

    constructor(dt){
        this.dt = new Date(dt);
    }

    hhmm(){
        return this.to00(this.dt.getHours()) + ":" + this.to00(this.dt.getMinutes());
    }

    mmddhhmm(){
        return this.to00((this.dt.getMonth() + 1)) + "-" + this.to00(this.dt.getDate()) + " " + this.to00(this.dt.getHours()) + ":" + this.to00(this.dt.getMinutes());
    }

    yymmdd(){
        return this.dt.getFullYear() + "-" + this.to00((this.dt.getMonth() + 1)) + "-" + this.to00(this.dt.getDate());
    }

    to00(i){
        if(i >= 0 && i <= 9) {
            return "0" + i;
        }
        return i;
    }

}

util.DateTime = DateTime;

util.replaceSiteUrl = function(text) {
    let showText = "";

    if(!!text) {
        let textArray = text.split("_");
        // 满足五等份时才进行替换
        if(textArray.length == 5) {
            let removeFirst = true;

            textArray = textArray.map((it, idx) => {
                let textLowercase = it.toLowerCase();
                let sectionText = null;

                // 第一段只在第二段为 ios android时进行翻译 
                if(idx == 0 &&  ["ios", "android"].indexOf(textArray[1].toLowerCase()) > -1) {
                    // 依次判断第一段内容的key是否是 textLowercase 的开头
                    Object.keys(window.siteUrlConfig[idx]).forEach((item, index) => {
                        if(textLowercase.startsWith(item)) {
                            removeFirst = false;
                            sectionText = window.siteUrlConfig[idx][item];
                        }
                    })
                } else {
                    sectionText = window.siteUrlConfig[idx][textLowercase];
                }
                
                return !!sectionText ? sectionText : it;
            });

            // 有条件的去掉第一段
            if(removeFirst) {
                textArray = textArray.filter((it, idx) => idx > 0);
            }

            showText = textArray.join("_");
        } else {
            showText = text;
        }
    }
    return showText;   
}

export default util;