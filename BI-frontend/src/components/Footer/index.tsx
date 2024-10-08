import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={'2024 智汇 BI  Created by yezhixinZZ'}
      links={[
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/yezhixinZZ',
          blankTarget: true,
        },
        {
          key: '智汇 BI',
          title: '智汇 BI',
          href: 'https://github.com/yezhixinZZ',
          blankTarget: false,
        },
      ]}
    />
  );
};

export default Footer;
