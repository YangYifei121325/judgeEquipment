import React from 'react';
import {
  WechatOutlined,
  RetweetOutlined,
  CodeOutlined,
  FileImageOutlined,
  VerticalAlignMiddleOutlined,
  LayoutOutlined,
  MonitorOutlined
} from '@ant-design/icons'; // 引入 AntD 图标（需安装 antd 或替换为自定义图标）

// 若未使用 AntD，可替换为简单文本图标（如 [微信]、[企业微信]），下文有备选方案

const Bpp = () => {
  // 工具函数：安全获取 UA（避免 window 未定义）
  const getUA = () => {
    if (!isBrowser()) return '非浏览器环境';
    return window.navigator.userAgent.toLowerCase() || '未知 UA';
  };

  // 1. 是否为浏览器环境（基础判断）
  const isBrowser = () => {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  };

  // 2. 微信生态（含微信、企业微信、小程序）
  const isWechatEcosystem = () => {
    const ua = getUA();
    return ua.includes('micromessenger') || ua.includes('wxwork');
  };

  // 3. 微信内置浏览器（非小程序、非企业微信）
  const isWechatBrowser = () => {
    const ua = getUA();
    return (
      ua.includes('micromessenger') &&
      !ua.includes('wxwork') &&
      !isWechatMiniProgram()
    );
  };

  // 4. 微信小程序（内嵌 H5）
  const isWechatMiniProgram = () => {
    const ua = getUA();
    return ua.includes('miniprogram') ||
      (window?.wx && typeof window.wx.miniProgram === 'object');
  };

  // 5. 企业微信（H5/小程序）
  const isWxWork = () => {
    const ua = getUA();
    return ua.includes('wxwork');
  };

  // 6. 企业微信小程序
  const isWxWorkMiniProgram = () => {
    return isWxWork() && isWechatMiniProgram();
  };

  // 7. 微信开发者工具
  const isWechatDevTools = () => {
    const ua = getUA();
    return ua.includes('micromessenger') && ua.includes('devtools');
  };

  // 8. 公众号图文内网页（优化：兼容更多场景）
  const isWechatOfficialAccountWeb = () => {
    const ua = getUA();
    return isWechatBrowser() && (ua.includes('mpweixin') || /micromessenger\/\d+/.test(ua));
  };

  // 优化：结果格式化（带颜色标识）
  const formatResult = (result) => {
    return (
      <span style={{
        padding: '2px 8px',
        borderRadius: '4px',
        fontWeight: '500',
        backgroundColor: result ? '#e6f7ef' : '#fff1f0',
        color: result ? '#00a86b' : '#d32f2f',
        margin: '0 4px'
      }}>
        {result ? '是' : '否'}
      </span>
    );
  };

  // 定义每个检测项的配置（图标、标题、描述）
  const checkItems = [
    {
      icon: <WechatOutlined style={{ color: '#07C160', marginRight: '8px' }} />,
      key: 'wechatEcosystem',
      title: '基础判断：是否为微信生态',
      description: '含微信、企业微信、小程序',
      checkFn: isWechatEcosystem
    },
    {
      icon: <VerticalAlignMiddleOutlined style={{ color: '#1890FF', marginRight: '8px' }} />,
      key: 'wechatBrowser',
      title: '是否为微信内置浏览器',
      description: '非小程序、非企业微信',
      checkFn: isWechatBrowser
    },
    {
      icon: <LayoutOutlined style={{ color: '#722ED1', marginRight: '8px' }} />,
      key: 'wechatMiniProgram',
      title: '是否为微信小程序',
      description: '小程序内嵌 H5/网页',
      checkFn: isWechatMiniProgram
    },
    {
      icon: <RetweetOutlined style={{ color: '#FF7D00', marginRight: '8px' }} />,
      key: 'wxWork',
      title: '是否为企业微信',
      description: '企业微信内打开 H5/小程序',
      checkFn: isWxWork
    },
    {
      icon: <CodeOutlined style={{ color: '#F5222D', marginRight: '8px' }} />,
      key: 'wxWorkMiniProgram',
      title: '是否为企业微信小程序',
      description: '企业微信内的小程序',
      checkFn: isWxWorkMiniProgram
    },
    {
      icon: <MonitorOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />,
      key: 'wechatDevTools',
      title: '是否为微信开发者工具',
      description: '调试环境',
      checkFn: isWechatDevTools
    },
    {
      icon: <FileImageOutlined style={{ color: '#FAAD14', marginRight: '8px' }} />,
      key: 'wechatOfficialAccountWeb',
      title: '是否为公众号图文内网页',
      description: '本质是微信内置浏览器，额外标识场景',
      checkFn: isWechatOfficialAccountWeb
    }
  ];

  // 获取当前环境概览（最匹配的环境）
  const getEnvOverview = () => {
    if (isWechatDevTools()) return '微信开发者工具';
    if (isWxWorkMiniProgram()) return '企业微信小程序';
    if (isWechatMiniProgram()) return '微信小程序';
    if (isWechatOfficialAccountWeb()) return '公众号图文内网页';
    if (isWechatBrowser()) return '微信内置浏览器';
    if (isWxWork()) return '企业微信';
    if (isWechatEcosystem()) return '微信生态未知场景';
    return '非微信生态环境';
  };
  function isDouyinEnv() {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.includes('aweme') || ua.includes('bytedancewebview');
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '16px',
      boxSizing: 'border-box'
    }}>

      是否为字节{isDouyinEnv() ? '是' : '否'}
      {/* 顶部标题栏 */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px',
        padding: '16px 0',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{
          fontSize: '20px',
          color: '#1890FF',
          margin: '0 0 8px 0',
          fontWeight: '600'
        }}>
          微信环境检测工具
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#666',
          margin: '0'
        }}>
          当前环境：<span style={{ color: '#1890FF', fontWeight: '500' }}>{getEnvOverview()}</span>
        </p>
      </div>

      {/* 检测结果列表（卡片布局） */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {checkItems.map((item, index) => (
          <div
            key={item.key}
            style={{
              backgroundColor: '#fff',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
            }}
          >
            {/* 序号 */}
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#e8f4ff',
              color: '#1890FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '600',
              marginRight: '12px'
            }}>
              {index + 1}
            </div>

            {/* 图标 + 标题 + 描述 */}
            <div style={{
              flex: 1,
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                {item.icon}
                <span style={{
                  fontSize: '15px',
                  color: '#1f2937',
                  fontWeight: '500'
                }}>
                  {item.title}
                </span>
              </div>
              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                margin: '0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {item.description}
              </p>
            </div>

            {/* 检测结果 */}
            <div style={{
              marginLeft: '16px',
              flexShrink: '0'
            }}>
              {formatResult(item.checkFn())}
            </div>
          </div>
        ))}
      </div>

      {/* UA 信息（展开/收起）- 调试用 */}
      <div style={{
        marginTop: '24px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
      }}>
        <details style={{ margin: '0' }}>
          <summary style={{
            padding: '16px',
            fontSize: '14px',
            color: '#4b5563',
            cursor: 'pointer',
            listStyle: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>User Agent 信息（点击展开）</span>
            <span style={{
              fontSize: '12px',
              color: '#9ca3af'
            }}>
              调试用
            </span>
          </summary>
          <div style={{
            padding: '0 16px 16px',
            fontSize: '12px',
            color: '#6b7280',
            backgroundColor: '#f9fafb',
            borderRadius: '0 0 8px 8px',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {getUA()}
          </div>
        </details>
      </div>

      {/* 底部说明 */}
      <div style={{
        marginTop: '16px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#9ca3af'
      }}>
        检测基于 User Agent 及微信 API 特征，仅供参考
      </div>
    </div>
  );
};

export default Bpp;