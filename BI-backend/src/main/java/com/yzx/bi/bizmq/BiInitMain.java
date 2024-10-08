package com.yzx.bi.bizmq;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

/**
 * 用于创建测试程序用到的交换机和队列（只用执行一次）
 */

public class BiInitMain {
    public static void main(String[] args) {

        try {
            ConnectionFactory factory = new ConnectionFactory();
            factory.setHost("1.14.13.42");
            factory.setPort(5672);
            factory.setUsername("root");
            factory.setPassword("root");
            Connection connection = factory.newConnection();
            Channel channel = connection.createChannel();
            String  EXCHANGE_NAME = BiMqConstant.BI_EXCHANGE_NAME;
            channel.exchangeDeclare(EXCHANGE_NAME, "direct");

            //创建队列1
            String queueName1 = BiMqConstant.BI_QUEUE_NAME;
            //第二个参数 是否持久化 表示重启服务 队列数据不会丢失
            channel.queueDeclare(queueName1, true, false, false, null);
            channel.queueBind(queueName1, EXCHANGE_NAME, BiMqConstant.BI_ROUTING_KEY);
        }catch (Exception e){

        }

    }
}
