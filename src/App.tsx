import React, { useState, useEffect } from 'react';
import Bpp from './Bpp'
// 环境检测核心工具类（保持原逻辑不变）
const EnvDetector = {
  // 基础环境判断
  isWechatMiniProgram: function () {
    return typeof wx !== 'undefined' && wx.miniProgram;
  },
  isBrowser: function () {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  },

  // 具体浏览器区分
  isWechatBrowser: function () {
    if (!this.isBrowser()) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.includes('micromessenger') && !this.isWechatMiniProgram();
  },

  isHuaweiBrowser: function () {
    if (!this.isBrowser()) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.includes('huaweibrowser') || (ua.includes('huawei') && ua.includes('browser'));
  },

  isQQBrowser: function () {
    if (!this.isBrowser()) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.includes('qqbrowser') || ua.includes('mqqbrowser');
  },

  isQuarkBrowser: function () {
    if (!this.isBrowser()) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.includes('quark');
  },
  isVivoBrowser: function () {
    if (!this.isBrowser()) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.includes('vivobrowser');
  },
  // 1. 苹果手机/电脑自带浏览器：Safari？？？？
  isSafari: function () {
    if (!this.isBrowser()) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    // 特征：含 "safari"，且不含 "chrome" "edge" "brave" 等Chromium内核标识（避免误判）
    return ua.includes('safari') && !ua.includes('chrome') && !ua.includes('edge') && !ua.includes('brave');
  },
  isBaiduBrowser: function () {
    // 先判断是否为浏览器环境（复用已有的 isBrowser 方法）
    if (!this.isBrowser()) return false;
    // 获取小写的 User-Agent 字符串（统一大小写避免匹配误差）
    const ua = window.navigator.userAgent.toLowerCase();
    // 百度浏览器的核心特征：ua 中包含 "baidubrowser"
    return ua.includes('baiduboxapp');
  },
  // ???????????????
  isbytedBrowser: function () {
    if (!this.isBrowser()) return false; // 先判断是否为浏览器环境
    const ua = window.navigator.userAgent.toLowerCase();
    // 抖音核心特征：包含 douyin（主标识）、aweme（底层框架）、tiktok（国际版）任一即可
    const douyinFeatures = ['douyin', 'aweme', 'tiktok'];
    return douyinFeatures.some(feature => ua.includes(feature));
  },



  // 获取当前环境描述
  getCurrentEnv: function () {
    if (this.isWechatMiniProgram()) return '微信小程序';
    if (this.isWechatBrowser()) return '微信浏览器';
    if (this.isHuaweiBrowser()) return '华为浏览器';
    if (this.isQQBrowser()) return 'QQ浏览器';
    if (this.isQuarkBrowser()) return '夸克浏览器';
    if (this.isVivoBrowser()) return 'Vivo浏览器';
    if (this.isBrowser()) return '其他浏览器';
    if (this.isSafari()) return '手机自带的苹果浏览器';
    if (this.isBaiduBrowser()) return window.navigator.userAgent.toLowerCase().includes('baiduboxapp') ? '百度APP' : '百度浏览器';
    if (this.isbytedBrowser()) return '今日头条APP,bytedancewebview';
    return '未知环境';
  },

  // 获取判断依据
  getJudgeReason: function () {
    if (!this.isBrowser()) {
      return '未识别到浏览器或小程序环境特征。';
    }
    const ua = window.navigator.userAgent.toLowerCase();
    const env = this.getCurrentEnv();

    switch (env) {
      case '微信小程序':
        return '1. 存在微信小程序特有全局对象 wx.miniProgram；\n2. UA 包含 "miniprogram" 字段（辅助验证）。';
      case '微信浏览器':
        return '1. 存在 window/document（浏览器环境）；\n2. UA 包含 "micromessenger"（微信标识）；\n3. 不存在 wx.miniProgram（排除小程序）。';
      case '华为浏览器':
        return '1. 存在 window/document（浏览器环境）；\n2. UA 包含 "huaweibrowser" 或 "huawei" + "browser" 特征字段。';
      case 'QQ浏览器':
        return '1. 存在 window/document（浏览器环境）；\n2. UA 包含 "qqbrowser" 或 "mqqbrowser" 特征字段。';
      case '夸克浏览器':
        return '1. 存在 window/document（浏览器环境）；\n2. UA 包含 "quark" 特征字段。';
      case '其他浏览器':
        return '1. 存在 window/document（浏览器环境）；\n2. 未匹配微信/华为/QQ/夸克浏览器的专属UA特征。';
      default:
        return '未识别到浏览器或小程序环境特征。';
    }
  },

  // 获取UA
  getUserAgent: function () {
    return this.isBrowser() ? window.navigator.userAgent : '非浏览器环境，无UA';
  }
};
// 微信生态环境判断集合
const wechatEnv = {
  // 1. 基础判断：是否为微信生态（含微信、企业微信、小程序）isWechatEcosystem
  isWechatEcosystem: function () {
    if (!this.isBrowser()) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    // 核心标识：micromessenger（微信）或 wxwork（企业微信）
    return ua.includes('micromessenger') || ua.includes('wxwork');
  },

  // 2. 是否为 微信内置浏览器（非小程序、非企业微信）
  isWechatBrowser: function () {
    if (!this.isBrowser()) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    // 条件：含 micromessenger + 不含 wxwork（排除企业微信） + 不含 miniprogram（排除小程序）
    return ua.includes('micromessenger') &&
      !ua.includes('wxwork') &&
      !this.isWechatMiniProgram();
  },

  // 3. 是否为 微信小程序（小程序内嵌 H5/网页）
  isWechatMiniProgram: function () {
    if (!this.isBrowser()) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    // 条件1：UA 含 miniprogram（微信 7.0+ 版本小程序必含）
    // 条件2：存在 wx.miniProgram API（小程序环境专属，最可靠）
    return ua.includes('miniprogram') ||
      (window.wx && typeof window.wx.miniProgram === 'object');
  },

  // 4. 是否为 企业微信（企业微信内打开 H5/小程序）
  isWxWork: function () {
    if (!this.isBrowser()) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    // 核心标识：wxwork（企业微信 UA 必含）
    return ua.includes('wxwork');
  },

  // 5. 是否为 企业微信小程序（企业微信内的小程序）
  isWxWorkMiniProgram: function () {
    if (!this.isBrowser()) return false;
    // 条件：是企业微信 + 是小程序环境
    return this.isWxWork() && this.isWechatMiniProgram();
  },

  // 6. 是否为 微信开发者工具（调试环境）
  isWechatDevTools: function () {
    if (!this.isBrowser()) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    // 微信开发者工具 UA 特征：含 micromessenger + devtools
    return ua.includes('micromessenger') && ua.includes('devtools');
  },

  // 7. 是否为 公众号图文内网页（本质是微信内置浏览器，额外标识场景）
  isWechatOfficialAccountWeb: function () {
    if (!this.isBrowser()) return false;
    // 条件：是微信内置浏览器 + （可选）UA 含 mpweixin（部分公众号场景会带）
    const ua = window.navigator.userAgent.toLowerCase();
    return this.isWechatBrowser() && ua.includes('mpweixin');
  }
}


// 主组件
const EnvDetectorApp = () => {
  console.log(window.navigator.userAgent.toLowerCase())
  const [currentEnv, setCurrentEnv] = useState('');
  const [userAgent, setUserAgent] = useState('');
  const [judgeReason, setJudgeReason] = useState('');
  const [wechatFullEnv, setWechatFullEnv] = useState('');

  /**
 * 完整识别微信生态环境：含普通微信、企业微信、小程序、小游戏、视频号H5等
 * @returns {String} 环境类型：wechatBrowser/wechatMiniProgram/wechatMiniProgramWebView/wechatWorkH5/wechatWorkMiniProgram/wechatGame/wechatVideoH5/other
 */
  function getWechatFullEnv() {
    const ua = window?.navigator?.userAgent?.toLowerCase() || '';
    const isWechatBase = ua.includes('micromessenger'); // 微信生态基础标识

    if (!isWechatBase) {
      return 'other'; // 非微信生态
    }

    // 1. 企业微信环境（H5/小程序）：UA 含 wxwork
    const isWechatWork = ua.includes('wxwork');
    if (isWechatWork) {
      // 企业微信小程序：__wxjs_environment === 'miniprogram'
      const isWorkMiniProgram = typeof window !== 'undefined' && window.__wxjs_environment === 'miniprogram';
      return isWorkMiniProgram ? 'wechatWorkMiniProgram' : 'wechatWorkH5';
    }

    // 2. 微信小游戏环境：小程序标识 + 游戏API特征
    const isMiniProgram = typeof window !== 'undefined' && window.__wxjs_environment === 'miniprogram';
    if (isMiniProgram) {
      // 小游戏特有 API：createGameContext（原生小程序无此 API）
      const isGame = typeof wx !== 'undefined' && typeof wx.createGameContext === 'function';
      return isGame ? 'wechatGame' : 'wechatMiniProgram';
    }

    // 3. 小程序内嵌 WebView：UA 含 miniProgram + 存在 wx.miniProgram
    const isMiniProgramWebView = ua.includes('miniprogram') && typeof wx !== 'undefined' && typeof wx.miniProgram !== 'undefined';
    if (isMiniProgramWebView) {
      return 'wechatMiniProgramWebView';
    }

    // 4. 微信视频号内嵌 H5：UA 含 videoapp 标识（非绝对，但实操中稳定）
    const isVideoH5 = ua.includes('videoapp');
    if (isVideoH5) {
      return 'wechatVideoH5';
    }

    // 5. 普通微信浏览器（排除以上所有细分环境后的剩余微信H5）
    return 'wechatBrowser';
  }

  // 用法示例
  const fullEnv = getWechatFullEnv();
  console.log('当前微信生态环境：', fullEnv);

  // 针对性业务逻辑
  switch (fullEnv) {
    case 'wechatBrowser':
      console.log('普通微信浏览器：初始化微信 JS-SDK（普通版）');
      break;
    case 'wechatMiniProgram':
      console.log('微信原生小程序：调用小程序基础 API');
      break;
    case 'wechatMiniProgramWebView':
      console.log('小程序WebView：与小程序通信（wx.miniProgram.postMessage）');
      break;
    case 'wechatWorkH5':
      console.log('企业微信H5：初始化企业微信 JS-SDK（wx.config 传入 corpId）');
      break;
    case 'wechatWorkMiniProgram':
      console.log('企业微信小程序：调用企业微信专属 API（如 wx.qy.login）');
      break;
    case 'wechatGame':
      console.log('微信小游戏：执行游戏引擎逻辑（如创建游戏上下文）');
      break;
    case 'wechatVideoH5':
      console.log('视频号H5：适配视频号窄屏、禁用导航栏修改等');
      break;
    case 'other':
      console.log('非微信生态：执行通用逻辑');
      break;
  }

  // 组件挂载时执行检测
  useEffect(() => {
    setWechatFullEnv(getWechatFullEnv());
    if (typeof window !== 'undefined') {
      const env = EnvDetector.getCurrentEnv();
      const ua = EnvDetector.getUserAgent();
      const reason = EnvDetector.getJudgeReason().replace(/\n/g, '<br>');


      setCurrentEnv(env);
      setUserAgent(ua);
      setJudgeReason(reason);
    }
  }, []);

  // UA复制功能
  const copyUA = () => {
    if (!userAgent) return;
    navigator.clipboard.writeText(userAgent)
      .then(() => {
        alert('UA已复制到剪贴板！');
      })
      .catch(err => {
        console.error('复制失败：', err);
        alert('复制失败，请手动复制');
      });
  };

  return (
    <div style={globalStyles.body}>
      <div style={globalStyles.container}>
        <h1 style={globalStyles.h1}>环境检测结果移动端</h1>

        wechatFullEnv:{wechatFullEnv}
        <div>判断依据</div>
        {/* {JSON.stringify(isWXenv)} */}
        {/* {isWXenv} */}

        <Bpp></Bpp>
        <div style={globalStyles.infoItem}>
          <span style={globalStyles.label}>当前运行环境：</span>
          <span style={{ ...globalStyles.value, ...globalStyles.highlight }}>
            {currentEnv}
          </span>
          <p style={globalStyles.tip}>基于 UA 特征和环境特有对象判断</p>
        </div>

        <div style={globalStyles.infoItem}>
          <span style={globalStyles.label}>User-Agent（UA）：</span>
          <div
            style={{ ...globalStyles.value, ...globalStyles.uaContainer }}
            onClick={copyUA}
            role="button"
            tabIndex={0}
          >
            {userAgent}
          </div>
          <p style={globalStyles.tip}>UA 包含浏览器/设备核心标识，点击可复制</p>
        </div>

        <div style={globalStyles.infoItem}>
          <span style={globalStyles.label}>判断依据：</span>
          <div
            style={globalStyles.value}
            dangerouslySetInnerHTML={{ __html: judgeReason }}
          />
        </div>
      </div>
    </div>
  );
};

// 样式定义（对应原CSS）
const globalStyles = {
  body: {
    padding: '20px',
    background: '#f5f7fa',
    lineHeight: '1.8',
    margin: 0,
    fontFamily: '"Arial", sans-serif'
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)'
  },
  h1: {
    color: '#2d3748',
    fontSize: '24px',
    marginBottom: '25px',
    textAlign: 'center',
    marginTop: 0
  },
  infoItem: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee'
  },
  label: {
    fontWeight: '600',
    color: '#4a5568',
    display: 'block',
    marginBottom: '8px',
    fontSize: '16px'
  },
  value: {
    color: '#2d3748',
    fontSize: '15px',
    wordBreak: 'break-all'
  },
  highlight: {
    color: '#4299e1',
    fontWeight: '600'
  },
  uaContainer: {
    background: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    overflowX: 'auto',
    cursor: 'pointer' // 增加指针样式，提示可点击
  },
  tip: {
    marginTop: '5px',
    fontSize: '13px',
    color: '#718096',
    marginBottom: 0
  }
};

export default EnvDetectorApp;