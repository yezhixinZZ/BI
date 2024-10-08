import React, {useState} from 'react';
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import {genChartByAiUsingPost} from "@/services/yebi/chartController";
import ReactECharts from 'echarts-for-react';

/**
 * 添加图表页面
 * @constructor
 */
const AddChart: React.FC = () => {

  const [chart,setChart] = useState<API.BiResponse>();
  const [option,setOption] = useState<any>();
  const [submitting,setSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  /**
   * 提交表单
   * @param values
   */
  const onFinish = async (values: any) => {
    //避免重复提交
    if (submitting){
      return;
    }
    setSubmitting(true);
    setLoading(true); // 开始加载

    setChart(undefined);
    setOption(undefined);
    // 对接后端 上传数据
    const params = {
      ...values,
      file:undefined,
    }
    try {
      const res = await genChartByAiUsingPost(params,{},values.file.file.originFileObj)
      if (!res?.data){
        message.error('分析失败')
      }else {
        message.success('分析成功')
        //const chartOption = JSON.parse(res.data.genChart && '')
        const chartOption = res.data.genChart ? JSON.parse(res.data.genChart) : null;

        if (!chartOption) {
          throw new Error('图表生成错误')
        }else {
          setChart(res.data);
          setOption(chartOption);
          setLoading(false); // 加载完成
        }
      }
    } catch (e: any){
      message.error('分析失败,' + e.message)
      setLoading(false); // 发生错误后停止加载
    }
    setSubmitting(false);
  };


  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title={'智能分析'}>
            <Form
              name="addChart"
              labelAlign={'left'}
              labelCol={{span: 4}}
              wrapperCol={{span: 16}}
              onFinish={onFinish}
              initialValues={{}}
            >
              <Form.Item name="goal" label="分析目标" rules={[{required: true, message: '请输入分析目标'}]}>
                <TextArea placeholder="请输入分析需求，如：分析网站用户的增长情况"/>
              </Form.Item>
              <Form.Item name="name" label="图标名称" rules={[{required: true, message: '请输入图表名称'}]}>
                <Input placeholder="请输入图表名称"/>
              </Form.Item>
              <Form.Item
                name="chartType"
                label="图表类型"
                rules={[{required: true, message: '请选择图表类型'}]}
              >
                <Select placeholder="请选择图表类型"
                        options={[
                          {value: '折线图', label: '折线图'},
                          {value: '柱状图', label: '柱状图'},
                          {value: '堆叠图', label: '堆叠图'},
                          {value: '雷达图', label: '雷达图'},
                          {value: '饼图', label: '饼图'},
                        ]}
                >

                </Select>
              </Form.Item>


              <Form.Item
                name="file"
                label="原始数据"
              >
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined/>}>上传文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{span: 16, offset: 4}}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={'分析结果'}>
            {
              submitting ? null : (
                chart?.genResult ?? <div>请先提交分析要求</div>
              )
            }
            <Spin spinning={submitting} />
          </Card>
          <Divider/>
          <Card title={'分析图表'}>
            {
              submitting ? null : (
                option ? <ReactECharts option={option} /> : <div>请先提交分析要求</div>
              )
            }
            <Spin spinning={submitting} />
          </Card>
        </Col>
      </Row>

    </div>
  );
}
export default AddChart;
