package com.yzx.bi.mq;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;

public class FanOutConsumer {
    private static final String EXCHANGE_NAME = "fanout-exchange";
 
    public static void main(String[] argv) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel1 = connection.createChannel();
        Channel channel2 = connection.createChannel();
        //声明交换机
        channel1.exchangeDeclare(EXCHANGE_NAME, "fanout");
        //创建一个临时队列，随机分配队列名称
        String queueName1 = "队列1";
        channel1.queueDeclare(queueName1, true, false, false, null);
        //将队列1绑定到交换机
        channel1.queueBind(queueName1, EXCHANGE_NAME, "");

        String queueName2 = "队列2";
        channel2.queueDeclare(queueName2, true, false, false, null);
        //将队列2绑定到交换机
        channel2.queueBind(queueName2, EXCHANGE_NAME, "");

        System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

        DeliverCallback deliverCallback1 = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            System.out.println(" [队列1] Received '" + message + "'");
        };

        DeliverCallback deliverCallback2 = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            System.out.println(" [队列2] Received '" + message + "'");
        };

        channel1.basicConsume(queueName1, true, deliverCallback1, consumerTag -> { });
        channel2.basicConsume(queueName2, true, deliverCallback2, consumerTag -> { });
    }
}