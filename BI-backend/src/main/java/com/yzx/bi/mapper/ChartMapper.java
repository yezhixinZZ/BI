package com.yzx.bi.mapper;

import com.yzx.bi.model.entity.Chart ;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;
import java.util.Map;

/**
* @author Merer
* @description 针对表【chart(图表信息表)】的数据库操作Mapper
* @createDate 2024-08-03 14:15:31
* @Entity generator.domain.Chart
*/
public interface ChartMapper extends BaseMapper<Chart> {

    List<Map<String,Object>> queryChartData(String querySql);
}




