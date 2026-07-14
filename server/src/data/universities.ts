import { University } from '../types';

// 中国本科高校数据（含校区坐标）- 核心高校
export const universities: University[] = [
  // ===== 北京 =====
  {
    id: 1001, name: '清华大学', shortName: '清华', eduDomain: 'mails.tsinghua.edu.cn',
    province: '北京', city: '北京', level: '985',
    campuses: [{ name: '主校区', lat: 40.0084, lng: 116.3164 }],
    meetSpots: [
      { name: '清华学堂咖啡', type: '咖啡', lat: 40.0030, lng: 116.3200 },
      { name: '图书馆老馆', type: '自习', lat: 40.0050, lng: 116.3180 },
      { name: '紫荆操场', type: '户外', lat: 40.0100, lng: 116.3220 },
    ]
  },
  {
    id: 1002, name: '北京大学', shortName: '北大', eduDomain: 'pku.edu.cn',
    province: '北京', city: '北京', level: '985',
    campuses: [{ name: '燕园校区', lat: 39.9920, lng: 116.3060 }],
    meetSpots: [
      { name: '未名湖畔', type: '户外', lat: 39.9940, lng: 116.3050 },
      { name: '农园食堂', type: '食堂', lat: 39.9910, lng: 116.3080 },
      { name: '光华楼咖啡厅', type: '咖啡', lat: 39.9900, lng: 116.3070 },
    ]
  },
  {
    id: 1003, name: '中国人民大学', shortName: '人大', eduDomain: 'ruc.edu.cn',
    province: '北京', city: '北京', level: '985',
    campuses: [{ name: '中关村校区', lat: 39.9710, lng: 116.3120 }],
    meetSpots: [
      { name: '明德楼咖啡', type: '咖啡', lat: 39.9720, lng: 116.3100 },
      { name: '图书馆', type: '自习', lat: 39.9700, lng: 116.3130 },
    ]
  },
  {
    id: 1004, name: '北京航空航天大学', shortName: '北航', eduDomain: 'buaa.edu.cn',
    province: '北京', city: '北京', level: '985',
    campuses: [{ name: '学院路校区', lat: 39.9810, lng: 116.3470 }],
  },
  {
    id: 1005, name: '北京理工大学', shortName: '北理', eduDomain: 'bit.edu.cn',
    province: '北京', city: '北京', level: '985',
    campuses: [{ name: '中关村校区', lat: 39.9590, lng: 116.3140 }],
  },
  {
    id: 1006, name: '北京师范大学', shortName: '北师大', eduDomain: 'bnu.edu.cn',
    province: '北京', city: '北京', level: '985',
    campuses: [{ name: '海淀校区', lat: 39.9610, lng: 116.3660 }],
  },
  {
    id: 1007, name: '中国农业大学', shortName: '农大', eduDomain: 'cau.edu.cn',
    province: '北京', city: '北京', level: '985',
    campuses: [{ name: '东校区', lat: 40.0020, lng: 116.3550 }],
  },
  {
    id: 1008, name: '中央民族大学', shortName: '民大', eduDomain: 'muc.edu.cn',
    province: '北京', city: '北京', level: '985',
    campuses: [{ name: '海淀校区', lat: 39.9500, lng: 116.3120 }],
  },
  {
    id: 1009, name: '北京邮电大学', shortName: '北邮', eduDomain: 'bupt.edu.cn',
    province: '北京', city: '北京', level: '211',
    campuses: [{ name: '西土城校区', lat: 39.9640, lng: 116.3520 }],
  },
  {
    id: 1010, name: '北京交通大学', shortName: '北交', eduDomain: 'bjtu.edu.cn',
    province: '北京', city: '北京', level: '211',
    campuses: [{ name: '主校区', lat: 39.9510, lng: 116.3370 }],
  },
  {
    id: 1011, name: '北京科技大学', shortName: '北科', eduDomain: 'ustb.edu.cn',
    province: '北京', city: '北京', level: '211',
    campuses: [{ name: '学院路校区', lat: 39.9900, lng: 116.3540 }],
  },
  {
    id: 1012, name: '北京工业大学', shortName: '北工大', eduDomain: 'bjut.edu.cn',
    province: '北京', city: '北京', level: '211',
    campuses: [{ name: '主校区', lat: 39.8720, lng: 116.4830 }],
  },
  {
    id: 1013, name: '对外经济贸易大学', shortName: '贸大', eduDomain: 'uibe.edu.cn',
    province: '北京', city: '北京', level: '211',
    campuses: [{ name: '朝阳校区', lat: 39.9810, lng: 116.4240 }],
  },
  {
    id: 1014, name: '中国政法大学', shortName: '法大', eduDomain: 'cupl.edu.cn',
    province: '北京', city: '北京', level: '211',
    campuses: [{ name: '昌平校区', lat: 40.2250, lng: 116.2410 }],
  },
  {
    id: 1015, name: '北京外国语大学', shortName: '北外', eduDomain: 'bfsu.edu.cn',
    province: '北京', city: '北京', level: '211',
    campuses: [{ name: '海淀校区', lat: 39.9540, lng: 116.3080 }],
  },
  {
    id: 1016, name: '首都师范大学', shortName: '首师大', eduDomain: 'cnu.edu.cn',
    province: '北京', city: '北京', level: '双一流',
    campuses: [{ name: '校本部', lat: 39.9340, lng: 116.3040 }],
  },
  {
    id: 1017, name: '北京工商大学', shortName: '北工商', eduDomain: 'btbu.edu.cn',
    province: '北京', city: '北京', level: '普通本科',
    campuses: [{ name: '良乡校区', lat: 39.7330, lng: 116.1730 }],
  },
  {
    id: 1018, name: '北京联合大学', shortName: '北联大', eduDomain: 'buu.edu.cn',
    province: '北京', city: '北京', level: '普通本科',
    campuses: [{ name: '北四环校区', lat: 39.9880, lng: 116.4210 }],
  },
  {
    id: 1019, name: '北方工业大学', shortName: '北方工大', eduDomain: 'ncut.edu.cn',
    province: '北京', city: '北京', level: '普通本科',
    campuses: [{ name: '石景山校区', lat: 39.9300, lng: 116.2000 }],
  },

  // ===== 上海 =====
  {
    id: 2001, name: '复旦大学', shortName: '复旦', eduDomain: 'fudan.edu.cn',
    province: '上海', city: '上海', level: '985',
    campuses: [
      { name: '邯郸校区', lat: 31.2980, lng: 121.4990 },
      { name: '江湾校区', lat: 31.3380, lng: 121.5060 },
    ],
    meetSpots: [
      { name: '光华楼咖啡', type: '咖啡', lat: 31.2970, lng: 121.5000 },
      { name: '文科图书馆', type: '自习', lat: 31.2960, lng: 121.4980 },
    ]
  },
  {
    id: 2002, name: '上海交通大学', shortName: '上交', eduDomain: 'sjtu.edu.cn',
    province: '上海', city: '上海', level: '985',
    campuses: [
      { name: '闵行校区', lat: 31.0250, lng: 121.4370 },
      { name: '徐汇校区', lat: 31.2000, lng: 121.4330 },
    ],
  },
  {
    id: 2003, name: '同济大学', shortName: '同济', eduDomain: 'tongji.edu.cn',
    province: '上海', city: '上海', level: '985',
    campuses: [
      { name: '四平路校区', lat: 31.2840, lng: 121.4970 },
      { name: '嘉定校区', lat: 31.3000, lng: 121.2210 },
    ],
  },
  {
    id: 2004, name: '华东师范大学', shortName: '华师大', eduDomain: 'ecnu.edu.cn',
    province: '上海', city: '上海', level: '985',
    campuses: [
      { name: '闵行校区', lat: 31.0330, lng: 121.4500 },
      { name: '普陀校区', lat: 31.2310, lng: 121.4070 },
    ],
  },
  {
    id: 2005, name: '华东理工大学', shortName: '华理', eduDomain: 'ecust.edu.cn',
    province: '上海', city: '上海', level: '211',
    campuses: [{ name: '徐汇校区', lat: 31.1440, lng: 121.4260 }],
  },
  {
    id: 2006, name: '东华大学', shortName: '东华', eduDomain: 'dhu.edu.cn',
    province: '上海', city: '上海', level: '211',
    campuses: [{ name: '松江校区', lat: 31.0530, lng: 121.2120 }],
  },
  {
    id: 2007, name: '上海外国语大学', shortName: '上外', eduDomain: 'shisu.edu.cn',
    province: '上海', city: '上海', level: '211',
    campuses: [{ name: '松江校区', lat: 31.0590, lng: 121.2210 }],
  },
  {
    id: 2008, name: '上海财经大学', shortName: '上财', eduDomain: 'sufe.edu.cn',
    province: '上海', city: '上海', level: '211',
    campuses: [{ name: '杨浦校区', lat: 31.3000, lng: 121.4950 }],
  },
  {
    id: 2009, name: '上海大学', shortName: '上大', eduDomain: 'shu.edu.cn',
    province: '上海', city: '上海', level: '211',
    campuses: [{ name: '宝山校区', lat: 31.3180, lng: 121.3960 }],
  },
  {
    id: 2010, name: '华东政法大学', shortName: '华政', eduDomain: 'ecupl.edu.cn',
    province: '上海', city: '上海', level: '普通本科',
    campuses: [{ name: '松江校区', lat: 31.0520, lng: 121.2080 }],
  },
  {
    id: 2011, name: '上海师范大学', shortName: '上师大', eduDomain: 'shnu.edu.cn',
    province: '上海', city: '上海', level: '普通本科',
    campuses: [{ name: '徐汇校区', lat: 31.1620, lng: 121.4140 }],
  },
  {
    id: 2012, name: '上海理工大学', shortName: '上理', eduDomain: 'usst.edu.cn',
    province: '上海', city: '上海', level: '普通本科',
    campuses: [{ name: '军工路校区', lat: 31.2900, lng: 121.5530 }],
  },
  {
    id: 2013, name: '上海海事大学', shortName: '海事大', eduDomain: 'shmtu.edu.cn',
    province: '上海', city: '上海', level: '普通本科',
    campuses: [{ name: '临港校区', lat: 30.8800, lng: 121.9040 }],
  },
  {
    id: 2014, name: '上海对外经贸大学', shortName: '上贸大', eduDomain: 'suibe.edu.cn',
    province: '上海', city: '上海', level: '普通本科',
    campuses: [{ name: '松江校区', lat: 31.0550, lng: 121.2160 }],
  },

  // ===== 武汉 =====
  {
    id: 3001, name: '武汉大学', shortName: '武大', eduDomain: 'whu.edu.cn',
    province: '湖北', city: '武汉', level: '985',
    campuses: [
      { name: '文理学部', lat: 30.5390, lng: 114.3600 },
      { name: '信息学部', lat: 30.5320, lng: 114.3640 },
    ],
    meetSpots: [
      { name: '万林艺术博物馆咖啡', type: '咖啡', lat: 30.5380, lng: 114.3610 },
      { name: '总图书馆', type: '自习', lat: 30.5400, lng: 114.3590 },
      { name: '樱花大道', type: '户外', lat: 30.5380, lng: 114.3630 },
    ]
  },
  {
    id: 3002, name: '华中科技大学', shortName: '华科', eduDomain: 'hust.edu.cn',
    province: '湖北', city: '武汉', level: '985',
    campuses: [{ name: '主校区', lat: 30.5100, lng: 114.4150 }],
  },
  {
    id: 3003, name: '武汉理工大学', shortName: '武理', eduDomain: 'whut.edu.cn',
    province: '湖北', city: '武汉', level: '211',
    campuses: [
      { name: '马房山校区', lat: 30.5180, lng: 114.3530 },
      { name: '余家头校区', lat: 30.6080, lng: 114.3620 },
    ],
  },
  {
    id: 3004, name: '华中师范大学', shortName: '华师', eduDomain: 'ccnu.edu.cn',
    province: '湖北', city: '武汉', level: '211',
    campuses: [{ name: '桂子山校区', lat: 30.5210, lng: 114.3640 }],
  },
  {
    id: 3005, name: '中南财经政法大学', shortName: '中南大', eduDomain: 'zuel.edu.cn',
    province: '湖北', city: '武汉', level: '211',
    campuses: [{ name: '南湖校区', lat: 30.4800, lng: 114.3890 }],
  },
  {
    id: 3006, name: '中国地质大学(武汉)', shortName: '地大', eduDomain: 'cug.edu.cn',
    province: '湖北', city: '武汉', level: '211',
    campuses: [{ name: '鲁磨路校区', lat: 30.5240, lng: 114.3990 }],
  },
  {
    id: 3007, name: '华中农业大学', shortName: '华农', eduDomain: 'hzau.edu.cn',
    province: '湖北', city: '武汉', level: '211',
    campuses: [{ name: '狮子山校区', lat: 30.4710, lng: 114.3580 }],
  },
  {
    id: 3008, name: '江汉大学', shortName: '江大', eduDomain: 'jhun.edu.cn',
    province: '湖北', city: '武汉', level: '普通本科',
    campuses: [{ name: '沌口校区', lat: 30.5050, lng: 114.1640 }],
    meetSpots: [
      { name: '图书馆咖啡', type: '咖啡', lat: 30.5060, lng: 114.1650 },
      { name: '未名山', type: '户外', lat: 30.5040, lng: 114.1630 },
    ]
  },
  {
    id: 3009, name: '武汉科技大学', shortName: '武科大', eduDomain: 'wust.edu.cn',
    province: '湖北', city: '武汉', level: '普通本科',
    campuses: [
      { name: '青山校区', lat: 30.6280, lng: 114.4220 },
      { name: '黄家湖校区', lat: 30.4430, lng: 114.2590 },
    ],
  },
  {
    id: 3010, name: '湖北大学', shortName: '湖大', eduDomain: 'hubu.edu.cn',
    province: '湖北', city: '武汉', level: '普通本科',
    campuses: [{ name: '武昌校区', lat: 30.5790, lng: 114.3340 }],
  },
  {
    id: 3011, name: '武汉工程大学', shortName: '武工大', eduDomain: 'wit.edu.cn',
    province: '湖北', city: '武汉', level: '普通本科',
    campuses: [{ name: '流芳校区', lat: 30.4590, lng: 114.4410 }],
  },
  {
    id: 3012, name: '湖北工业大学', shortName: '湖工大', eduDomain: 'hbut.edu.cn',
    province: '湖北', city: '武汉', level: '普通本科',
    campuses: [{ name: '南湖校区', lat: 30.4860, lng: 114.3040 }],
  },
  {
    id: 3013, name: '武汉纺织大学', shortName: '纺大', eduDomain: 'wtu.edu.cn',
    province: '湖北', city: '武汉', level: '普通本科',
    campuses: [{ name: '阳光校区', lat: 30.4470, lng: 114.3100 }],
  },
  {
    id: 3014, name: '武汉轻工大学', shortName: '轻工大', eduDomain: 'whpu.edu.cn',
    province: '湖北', city: '武汉', level: '普通本科',
    campuses: [{ name: '金银湖校区', lat: 30.6430, lng: 114.2140 }],
  },
  {
    id: 3015, name: '中南民族大学', shortName: '中南民大', eduDomain: 'scuec.edu.cn',
    province: '湖北', city: '武汉', level: '普通本科',
    campuses: [{ name: '民族大道校区', lat: 30.4910, lng: 114.3860 }],
  },
  {
    id: 3016, name: '湖北经济学院', shortName: '湖经', eduDomain: 'hbue.edu.cn',
    province: '湖北', city: '武汉', level: '普通本科',
    campuses: [{ name: '藏龙岛校区', lat: 30.4180, lng: 114.4380 }],
  },
  {
    id: 3017, name: '湖北第二师范学院', shortName: '湖北二师', eduDomain: 'hue.edu.cn',
    province: '湖北', city: '武汉', level: '普通本科',
    campuses: [{ name: '光谷校区', lat: 30.4980, lng: 114.4190 }],
  },
  {
    id: 3018, name: '武汉体育学院', shortName: '武体', eduDomain: 'whsu.edu.cn',
    province: '湖北', city: '武汉', level: '普通本科',
    campuses: [{ name: '珞喻路校区', lat: 30.5220, lng: 114.3710 }],
  },

  // ===== 南京 =====
  {
    id: 4001, name: '南京大学', shortName: '南大', eduDomain: 'nju.edu.cn',
    province: '江苏', city: '南京', level: '985',
    campuses: [
      { name: '仙林校区', lat: 32.1170, lng: 118.9560 },
      { name: '鼓楼校区', lat: 32.0590, lng: 118.7790 },
    ],
  },
  {
    id: 4002, name: '东南大学', shortName: '东大', eduDomain: 'seu.edu.cn',
    province: '江苏', city: '南京', level: '985',
    campuses: [
      { name: '九龙湖校区', lat: 31.8900, lng: 118.8170 },
      { name: '四牌楼校区', lat: 32.0550, lng: 118.7910 },
    ],
  },
  {
    id: 4003, name: '南京航空航天大学', shortName: '南航', eduDomain: 'nuaa.edu.cn',
    province: '江苏', city: '南京', level: '211',
    campuses: [{ name: '将军路校区', lat: 31.9380, lng: 118.7970 }],
  },
  {
    id: 4004, name: '南京理工大学', shortName: '南理', eduDomain: 'njust.edu.cn',
    province: '江苏', city: '南京', level: '211',
    campuses: [{ name: '孝陵卫校区', lat: 32.0360, lng: 118.8560 }],
  },
  {
    id: 4005, name: '南京师范大学', shortName: '南师大', eduDomain: 'njnu.edu.cn',
    province: '江苏', city: '南京', level: '211',
    campuses: [{ name: '仙林校区', lat: 32.1060, lng: 118.9100 }],
  },
  {
    id: 4006, name: '河海大学', shortName: '河海', eduDomain: 'hhu.edu.cn',
    province: '江苏', city: '南京', level: '211',
    campuses: [{ name: '江宁校区', lat: 31.9250, lng: 118.7900 }],
  },
  {
    id: 4007, name: '南京工业大学', shortName: '南工大', eduDomain: 'njtech.edu.cn',
    province: '江苏', city: '南京', level: '普通本科',
    campuses: [{ name: '江浦校区', lat: 32.0760, lng: 118.6380 }],
  },
  {
    id: 4008, name: '南京邮电大学', shortName: '南邮', eduDomain: 'njupt.edu.cn',
    province: '江苏', city: '南京', level: '双一流',
    campuses: [{ name: '仙林校区', lat: 32.1140, lng: 118.9370 }],
  },
  {
    id: 4009, name: '南京审计大学', shortName: '南审', eduDomain: 'nau.edu.cn',
    province: '江苏', city: '南京', level: '普通本科',
    campuses: [{ name: '浦口校区', lat: 32.1520, lng: 118.5900 }],
  },
  {
    id: 4010, name: '南京财经大学', shortName: '南财', eduDomain: 'nufe.edu.cn',
    province: '江苏', city: '南京', level: '普通本科',
    campuses: [{ name: '仙林校区', lat: 32.1080, lng: 118.9170 }],
  },

  // ===== 杭州 =====
  {
    id: 5001, name: '浙江大学', shortName: '浙大', eduDomain: 'zju.edu.cn',
    province: '浙江', city: '杭州', level: '985',
    campuses: [
      { name: '紫金港校区', lat: 30.3024, lng: 120.0865 },
      { name: '玉泉校区', lat: 30.2639, lng: 120.1245 },
      { name: '西溪校区', lat: 30.2750, lng: 120.1430 },
    ],
    meetSpots: [
      { name: '紫金港图书馆', type: '自习', lat: 30.3030, lng: 120.0870 },
      { name: '月牙楼咖啡', type: '咖啡', lat: 30.3010, lng: 120.0850 },
      { name: '紫云球场', type: '户外', lat: 30.3040, lng: 120.0880 },
    ]
  },
  {
    id: 5002, name: '浙江工业大学', shortName: '浙工大', eduDomain: 'zjut.edu.cn',
    province: '浙江', city: '杭州', level: '普通本科',
    campuses: [{ name: '屏峰校区', lat: 30.2390, lng: 120.0410 }],
  },
  {
    id: 5003, name: '杭州电子科技大学', shortName: '杭电', eduDomain: 'hdu.edu.cn',
    province: '浙江', city: '杭州', level: '普通本科',
    campuses: [{ name: '下沙校区', lat: 30.3160, lng: 120.3500 }],
  },
  {
    id: 5004, name: '浙江工商大学', shortName: '浙工商', eduDomain: 'zjgsu.edu.cn',
    province: '浙江', city: '杭州', level: '普通本科',
    campuses: [{ name: '下沙校区', lat: 30.3100, lng: 120.3800 }],
  },
  {
    id: 5005, name: '浙江理工大学', shortName: '浙理工', eduDomain: 'zstu.edu.cn',
    province: '浙江', city: '杭州', level: '普通本科',
    campuses: [{ name: '下沙校区', lat: 30.3140, lng: 120.3560 }],
  },
  {
    id: 5006, name: '杭州师范大学', shortName: '杭师大', eduDomain: 'hznu.edu.cn',
    province: '浙江', city: '杭州', level: '普通本科',
    campuses: [{ name: '仓前校区', lat: 30.2960, lng: 120.0260 }],
  },
  {
    id: 5007, name: '中国计量大学', shortName: '中量大', eduDomain: 'cjlu.edu.cn',
    province: '浙江', city: '杭州', level: '普通本科',
    campuses: [{ name: '下沙校区', lat: 30.3200, lng: 120.3630 }],
  },
  {
    id: 5008, name: '浙江财经大学', shortName: '浙财', eduDomain: 'zufe.edu.cn',
    province: '浙江', city: '杭州', level: '普通本科',
    campuses: [{ name: '下沙校区', lat: 30.3080, lng: 120.3700 }],
  },

  // ===== 广州 =====
  {
    id: 6001, name: '中山大学', shortName: '中大', eduDomain: 'mail.sysu.edu.cn',
    province: '广东', city: '广州', level: '985',
    campuses: [
      { name: '南校园', lat: 23.1000, lng: 113.2960 },
      { name: '东校园(大学城)', lat: 23.0570, lng: 113.3910 },
    ],
  },
  {
    id: 6002, name: '华南理工大学', shortName: '华工', eduDomain: 'scut.edu.cn',
    province: '广东', city: '广州', level: '985',
    campuses: [
      { name: '五山校区', lat: 23.1540, lng: 113.3460 },
      { name: '大学城校区', lat: 23.0470, lng: 113.3980 },
    ],
  },
  {
    id: 6003, name: '暨南大学', shortName: '暨大', eduDomain: 'jnu.edu.cn',
    province: '广东', city: '广州', level: '211',
    campuses: [{ name: '石牌校区', lat: 23.1330, lng: 113.3500 }],
  },
  {
    id: 6004, name: '华南师范大学', shortName: '华师', eduDomain: 'scnu.edu.cn',
    province: '广东', city: '广州', level: '211',
    campuses: [{ name: '大学城校区', lat: 23.0500, lng: 113.4020 }],
  },
  {
    id: 6005, name: '广东工业大学', shortName: '广工', eduDomain: 'gdut.edu.cn',
    province: '广东', city: '广州', level: '普通本科',
    campuses: [{ name: '大学城校区', lat: 23.0430, lng: 113.3950 }],
  },
  {
    id: 6006, name: '广州大学', shortName: '广大', eduDomain: 'gzhu.edu.cn',
    province: '广东', city: '广州', level: '普通本科',
    campuses: [{ name: '大学城校区', lat: 23.0420, lng: 113.3790 }],
  },
  {
    id: 6007, name: '广东外语外贸大学', shortName: '广外', eduDomain: 'gdufs.edu.cn',
    province: '广东', city: '广州', level: '普通本科',
    campuses: [{ name: '白云校区', lat: 23.2000, lng: 113.2900 }],
  },
  {
    id: 6008, name: '广东财经大学', shortName: '广财', eduDomain: 'gdufe.edu.cn',
    province: '广东', city: '广州', level: '普通本科',
    campuses: [{ name: '海珠校区', lat: 23.0910, lng: 113.3160 }],
  },

  // ===== 成都 =====
  {
    id: 7001, name: '四川大学', shortName: '川大', eduDomain: 'scu.edu.cn',
    province: '四川', city: '成都', level: '985',
    campuses: [
      { name: '望江校区', lat: 30.6320, lng: 104.0810 },
      { name: '江安校区', lat: 30.5600, lng: 103.9990 },
    ],
  },
  {
    id: 7002, name: '电子科技大学', shortName: '电子科大', eduDomain: 'uestc.edu.cn',
    province: '四川', city: '成都', level: '985',
    campuses: [{ name: '清水河校区', lat: 30.7500, lng: 103.9320 }],
  },
  {
    id: 7003, name: '西南交通大学', shortName: '西南交大', eduDomain: 'swjtu.edu.cn',
    province: '四川', city: '成都', level: '211',
    campuses: [{ name: '犀浦校区', lat: 30.7670, lng: 103.9880 }],
  },
  {
    id: 7004, name: '西南财经大学', shortName: '西财', eduDomain: 'swufe.edu.cn',
    province: '四川', city: '成都', level: '211',
    campuses: [{ name: '柳林校区', lat: 30.6940, lng: 103.8380 }],
  },
  {
    id: 7005, name: '成都大学', shortName: '成大', eduDomain: 'cdu.edu.cn',
    province: '四川', city: '成都', level: '普通本科',
    campuses: [{ name: '十陵校区', lat: 30.6510, lng: 104.1960 }],
  },
  {
    id: 7006, name: '成都理工大学', shortName: '成理', eduDomain: 'cdut.edu.cn',
    province: '四川', city: '成都', level: '双一流',
    campuses: [{ name: '成华校区', lat: 30.6770, lng: 104.1390 }],
  },
  {
    id: 7007, name: '西南民族大学', shortName: '西南民大', eduDomain: 'swun.edu.cn',
    province: '四川', city: '成都', level: '普通本科',
    campuses: [{ name: '武侯校区', lat: 30.6360, lng: 104.0430 }],
  },

  // ===== 西安 =====
  {
    id: 8001, name: '西安交通大学', shortName: '西交', eduDomain: 'xjtu.edu.cn',
    province: '陕西', city: '西安', level: '985',
    campuses: [{ name: '兴庆校区', lat: 34.2460, lng: 108.9870 }],
  },
  {
    id: 8002, name: '西北工业大学', shortName: '西工大', eduDomain: 'nwpu.edu.cn',
    province: '陕西', city: '西安', level: '985',
    campuses: [{ name: '长安校区', lat: 34.1480, lng: 108.7680 }],
  },
  {
    id: 8003, name: '西安电子科技大学', shortName: '西电', eduDomain: 'xidian.edu.cn',
    province: '陕西', city: '西安', level: '211',
    campuses: [{ name: '南校区', lat: 34.1240, lng: 108.8390 }],
  },
  {
    id: 8004, name: '长安大学', shortName: '长安大学', eduDomain: 'chd.edu.cn',
    province: '陕西', city: '西安', level: '211',
    campuses: [{ name: '渭水校区', lat: 34.3760, lng: 108.9430 }],
  },
  {
    id: 8005, name: '陕西师范大学', shortName: '陕师大', eduDomain: 'snnu.edu.cn',
    province: '陕西', city: '西安', level: '211',
    campuses: [{ name: '长安校区', lat: 34.1570, lng: 108.8970 }],
  },

  // ===== 长沙 =====
  {
    id: 9001, name: '中南大学', shortName: '中南', eduDomain: 'csu.edu.cn',
    province: '湖南', city: '长沙', level: '985',
    campuses: [{ name: '岳麓校区', lat: 28.1660, lng: 112.9340 }],
  },
  {
    id: 9002, name: '湖南大学', shortName: '湖大', eduDomain: 'hnu.edu.cn',
    province: '湖南', city: '长沙', level: '985',
    campuses: [{ name: '岳麓山校区', lat: 28.1810, lng: 112.9380 }],
  },
  {
    id: 9003, name: '湖南师范大学', shortName: '湖南师大', eduDomain: 'hunnu.edu.cn',
    province: '湖南', city: '长沙', level: '211',
    campuses: [{ name: '二里半校区', lat: 28.1910, lng: 112.9450 }],
  },

  // ===== 天津 =====
  {
    id: 10001, name: '南开大学', shortName: '南开', eduDomain: 'nankai.edu.cn',
    province: '天津', city: '天津', level: '985',
    campuses: [
      { name: '八里台校区', lat: 39.1050, lng: 117.1700 },
      { name: '津南校区', lat: 38.9900, lng: 117.3570 },
    ],
  },
  {
    id: 10002, name: '天津大学', shortName: '天大', eduDomain: 'tju.edu.cn',
    province: '天津', city: '天津', level: '985',
    campuses: [
      { name: '卫津路校区', lat: 39.1080, lng: 117.1740 },
      { name: '北洋园校区', lat: 38.9950, lng: 117.3150 },
    ],
  },

  // ===== 合肥 =====
  {
    id: 11001, name: '中国科学技术大学', shortName: '中科大', eduDomain: 'ustc.edu.cn',
    province: '安徽', city: '合肥', level: '985',
    campuses: [{ name: '东校区', lat: 31.8360, lng: 117.2710 }],
  },
  {
    id: 11002, name: '合肥工业大学', shortName: '合工大', eduDomain: 'hfut.edu.cn',
    province: '安徽', city: '合肥', level: '211',
    campuses: [{ name: '屯溪路校区', lat: 31.8480, lng: 117.2910 }],
  },
  {
    id: 11003, name: '安徽大学', shortName: '安大', eduDomain: 'ahu.edu.cn',
    province: '安徽', city: '合肥', level: '211',
    campuses: [{ name: '磬苑校区', lat: 31.7620, lng: 117.1950 }],
  },

  // ===== 重庆 =====
  {
    id: 12001, name: '重庆大学', shortName: '重大', eduDomain: 'cqu.edu.cn',
    province: '重庆', city: '重庆', level: '985',
    campuses: [
      { name: 'A区', lat: 29.5680, lng: 106.4650 },
      { name: '虎溪校区', lat: 29.5990, lng: 106.3060 },
    ],
  },
  {
    id: 12002, name: '西南大学', shortName: '西大', eduDomain: 'swu.edu.cn',
    province: '重庆', city: '重庆', level: '211',
    campuses: [{ name: '北碚校区', lat: 29.8180, lng: 106.4240 }],
  },

  // ===== 深圳 =====
  {
    id: 13001, name: '深圳大学', shortName: '深大', eduDomain: 'szu.edu.cn',
    province: '广东', city: '深圳', level: '普通本科',
    campuses: [{ name: '粤海校区', lat: 22.5350, lng: 113.9370 }],
  },
  {
    id: 13002, name: '南方科技大学', shortName: '南科大', eduDomain: 'sustech.edu.cn',
    province: '广东', city: '深圳', level: '双一流',
    campuses: [{ name: '主校区', lat: 22.5980, lng: 113.9960 }],
  },

  // ===== 哈尔滨 =====
  {
    id: 14001, name: '哈尔滨工业大学', shortName: '哈工大', eduDomain: 'hit.edu.cn',
    province: '黑龙江', city: '哈尔滨', level: '985',
    campuses: [{ name: '一校区', lat: 45.7450, lng: 126.6310 }],
  },
  {
    id: 14002, name: '哈尔滨工程大学', shortName: '哈工程', eduDomain: 'hrbeu.edu.cn',
    province: '黑龙江', city: '哈尔滨', level: '211',
    campuses: [{ name: '主校区', lat: 45.7750, lng: 126.6800 }],
  },

  // ===== 厦门 =====
  {
    id: 15001, name: '厦门大学', shortName: '厦大', eduDomain: 'xmu.edu.cn',
    province: '福建', city: '厦门', level: '985',
    campuses: [{ name: '思明校区', lat: 24.4400, lng: 118.0910 }],
  },

  // ===== 济南/青岛 =====
  {
    id: 16001, name: '山东大学', shortName: '山大', eduDomain: 'sdu.edu.cn',
    province: '山东', city: '济南', level: '985',
    campuses: [
      { name: '中心校区', lat: 36.6760, lng: 117.0640 },
      { name: '青岛校区', lat: 36.3650, lng: 120.6890 },
    ],
  },
  {
    id: 16002, name: '中国海洋大学', shortName: '海大', eduDomain: 'ouc.edu.cn',
    province: '山东', city: '青岛', level: '985',
    campuses: [{ name: '崂山校区', lat: 36.1670, lng: 120.4950 }],
  },

  // ===== 大连/沈阳 =====
  {
    id: 17001, name: '大连理工大学', shortName: '大工', eduDomain: 'dlut.edu.cn',
    province: '辽宁', city: '大连', level: '985',
    campuses: [{ name: '主校区', lat: 38.8800, lng: 121.5340 }],
  },
  {
    id: 17002, name: '东北大学', shortName: '东大', eduDomain: 'neu.edu.cn',
    province: '辽宁', city: '沈阳', level: '985',
    campuses: [{ name: '南湖校区', lat: 41.7700, lng: 123.4200 }],
  },

  // ===== 长春 =====
  {
    id: 18001, name: '吉林大学', shortName: '吉大', eduDomain: 'jlu.edu.cn',
    province: '吉林', city: '长春', level: '985',
    campuses: [{ name: '前卫南区', lat: 43.8270, lng: 125.2810 }],
  },
];

// 大学城/高教园区定义（用于判断跨校近距离匹配）
export interface UniversityCluster {
  name: string;
  city: string;
  centerLat: number;
  centerLng: number;
  radiusKm: number;
  universityIds: number[];
}

export const universityClusters: UniversityCluster[] = [
  {
    name: '北京海淀高校圈', city: '北京',
    centerLat: 39.9800, centerLng: 116.3300, radiusKm: 6,
    universityIds: [1001, 1002, 1003, 1004, 1005, 1006, 1008, 1009, 1010, 1011, 1015, 1016, 1017, 1018, 1019],
  },
  {
    name: '武汉光谷高校圈', city: '武汉',
    centerLat: 30.5100, centerLng: 114.4000, radiusKm: 10,
    universityIds: [3001, 3002, 3003, 3004, 3006, 3011, 3015, 3016, 3017],
  },
  {
    name: '武汉南湖高校圈', city: '武汉',
    centerLat: 30.4800, centerLng: 114.3100, radiusKm: 8,
    universityIds: [3005, 3007, 3010, 3012, 3013],
  },
  {
    name: '武汉沌口高校圈', city: '武汉',
    centerLat: 30.5100, centerLng: 114.1700, radiusKm: 6,
    universityIds: [3008],
  },
  {
    name: '武汉青山高校圈', city: '武汉',
    centerLat: 30.6300, centerLng: 114.4200, radiusKm: 5,
    universityIds: [3009],
  },
  {
    name: '广州大学城', city: '广州',
    centerLat: 23.0500, centerLng: 113.3950, radiusKm: 5,
    universityIds: [6001, 6002, 6004, 6005],
  },
  {
    name: '南京仙林大学城', city: '南京',
    centerLat: 32.1100, centerLng: 118.9300, radiusKm: 5,
    universityIds: [4001, 4005],
  },
  {
    name: '上海松江大学城', city: '上海',
    centerLat: 31.0550, centerLng: 121.2150, radiusKm: 5,
    universityIds: [2006, 2007, 2010],
  },
  {
    name: '杭州下沙高教园区', city: '杭州',
    centerLat: 30.3130, centerLng: 120.3650, radiusKm: 5,
    universityIds: [5003, 5004],
  },
  {
    name: '天津高校圈', city: '天津',
    centerLat: 39.0500, centerLng: 117.2000, radiusKm: 15,
    universityIds: [10001, 10002],
  },
  {
    name: '合肥高校圈', city: '合肥',
    centerLat: 31.8100, centerLng: 117.2300, radiusKm: 8,
    universityIds: [11001, 11002, 11003],
  },
];

// 依据学校ID查找
export function findUniversity(id: number): University | undefined {
  return universities.find(u => u.id === id);
}

// 依据名称搜索
export function searchUniversities(query: string): University[] {
  const q = query.toLowerCase();
  return universities.filter(u =>
    u.name.includes(q) ||
    u.shortName.includes(q) ||
    u.city.includes(q) ||
    u.province.includes(q)
  ).slice(0, 10);
}

// 依据城市查找
export function findUniversitiesByCity(city: string): University[] {
  return universities.filter(u => u.city === city);
}
