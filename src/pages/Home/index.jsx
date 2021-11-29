import React, { useState, useEffect } from 'react';
import { Statistic, Card, Row, Col, message } from 'antd';
import { getStatistics } from '@/services/index';

export default () => {
  const [statisticsList, setStatisticsList] = useState([]);
  useEffect(() => {
    handleGetStatistics();
  }, []);

  // 获取统计数量
  const handleGetStatistics = async () => {
    try {
      const result = await getStatistics();
      if (result) {
        const { users_count, goods_count, order_count } = result;
        const statisticsList = [
          {
            title: '用户数',
            count: users_count,
          },
          {
            title: '商品数',
            count: goods_count,
          },
          {
            title: '订单数',
            count: order_count,
          },
        ];
        setStatisticsList(statisticsList);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <div>
      <Row gutter={16}>
        {statisticsList.map((item) => {
          return (
            <Col span={24 / statisticsList.length} key={item.title}>
              <Card>
                <Statistic
                  title={item.title}
                  value={item.count}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
