import React, {useEffect, useState} from 'react';
import {listMyChartByPageUsingPost} from "@/services/yebi/chartController";
import {Avatar, Card, List, message, Result} from "antd";
import ReactECharts from "echarts-for-react";
import {useModel} from "@@/exports";
import Search from "antd/es/input/Search";

/**
 * 我的图表页面
 * @constructor
 */
const MyChartPage: React.FC = () => {

  const initSearchParams = {
    current: 1,
    pageSize: 2,
    sortField: 'createTime',
    sortOrder: 'desc'
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const {initialState} = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart[]>([]); // 修正此处类型
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPost(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        //隐藏图标的title
        if (res.data.records){
          res.data.records.forEach(data => {
            if(data.status === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          });
        }
      } else {
        message.error('获取数据失败');
      }
    } catch (e: any) {
      message.error('获取数据失败' + e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    // 定义自动刷新定时器
    const interval = setInterval(() => {
      loadData();
    }, 10000); // 每30秒刷新一次

    // 在组件卸载时清除定时器
    return () => clearInterval(interval);
  }, [searchParams]);

  return (
    <div className="my-chart-page">
      <div>
        <Search placeholder="请输入图表名称"  enterButton loading={loading} onSearch={(value) => {
          setSearchParams({
            ...initSearchParams,
            name: value,
          });
        }}/>
      </div>
      <div style={{marginBottom: 16}} />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize: pageSize,
            });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{width: '100%'}}>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? ('图表类型：' + item.chartType) : undefined}
              />
              <>
                {item.status === 'succeed' && (
                  <>
                    <div style={{marginBottom: 16}}/>
                    <p><strong>分析目标：</strong>{item.goal}</p>
                    <div style={{marginBottom: 16}}/>
                    <p><strong>分析结果：</strong>{item.genResult}</p>
                    <ReactECharts option={item.genChart && JSON.parse(item.genChart)}/>
                    <div style={{marginBottom: 16}}/>
                  </>
                )}
                {item.status === 'wait' && (
                  <Result
                    status='warning'
                    title="排队中"
                    subTitle={item.execMessage ?? '系统繁忙，请耐心等待'}
                  />
                )}
                {item.status === 'running' && (
                  <Result
                    status='info'
                    title="正在生成"
                    subTitle={item.execMessage}
                  />
                )}
                {item.status === 'failed' && (
                  <Result
                    status='error'
                    title="生成失败"
                    subTitle={item.execMessage}
                  />
                )}
              </>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}
export default MyChartPage;
