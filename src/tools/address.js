function translate(address){
    let x =''
    switch (address){
        case 'Hunan':x = '湖南';break;
        case 'Hubei':x = '湖北';break;
        case 'Guangxi':x = '广西';break;
        case 'Guangdong':x = '广东';break;
        case 'Fujian':x = '福建';break;
        case 'Jiangxi':x = '江西';break;
        case 'Zhejiang':x = '浙江';break;
        case 'Jiangsu':x = '江苏';break;

        case 'Anhui':x = '安徽';break;
        case 'Chongqing':x = '重庆';break;
        case 'Sichuan':x = '四川';break;
        case 'Yunnan':x = '云南';break;
        case 'Guizhou':x = '贵州';break;
        case 'Henan':x = '河南';break;
        case 'Hebei':x = '河北';break;
        case 'Shandong':x = '山东';break;

        case 'Shanxi':x = '陕西';break;

        case 'Gansu':x = '甘肃';break;
        case 'Qinghai':x = '青海';break;
        case 'Xinjiang':x = '新疆';break;

        case 'Xizang':x = '西藏';break;
        case 'Neimenggu':x = '内蒙古';break;
        case 'Liaoning':x = '辽宁';break;
        case 'Jilin':x = '吉林';break;
        case 'Heilongjiang':x = '黑龙江';break;
        case 'Ningxia':x = '宁夏';break;


        case 'Tianjin':x = '天津';break;
        case 'Beijing':x = '北京';break;
        case 'Shanghai':x = '上海';break;

        case 'Hainan':x = '海南';break;
        case 'Taiwan':x = '台湾';break;

        default :x = address;break;


    }
    return x;
}
export  {translate};
