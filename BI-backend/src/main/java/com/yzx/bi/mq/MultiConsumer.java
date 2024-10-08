package com.yzx.bi.mq;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;

public class MultiConsumer {

  private static final String TASK_QUEUE_NAME = "multi";

  public static void main(String[] argv) throws Exception {
    ConnectionFactory factory = new ConnectionFactory();
    factory.setHost("localhost");
    final Connection connection = factory.newConnection();
      for (int i = 0; i < 2; i++) {
          final Channel channel = connection.createChannel();

          channel.queueDeclare(TASK_QUEUE_NAME, true, false, false, null);
          System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

          //控制单个消费者处理消息的速率
          channel.basicQos(1);

          //定义如何处理消息
          int finalI = i;
          DeliverCallback deliverCallback = (consumerTag, delivery) -> {
              String message = new String(delivery.getBody(), "UTF-8");


              try {
                  System.out.println(" [x] Received '" + "编号：" + finalI + "：" +message + "'");
                  //第二个参数：false：手动确认模式（只确认当前消息），true：自动确认模式（批量确认所有未确认历史消息）
                  channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
                  //处理工作,停5秒，模拟机器处理速度
                  Thread.sleep(5000);
              } catch (InterruptedException e) {
                  e.printStackTrace();
                  //拒绝消息 最后一个参数为：true：重新放回队列，false：丢弃
                  channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, false);
              } finally {
                  System.out.println(" [x] Done");
                  channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
              }
          };
          //开启消费监听
          channel.basicConsume(TASK_QUEUE_NAME, false, deliverCallback, consumerTag -> {
          });

      }


  }

}