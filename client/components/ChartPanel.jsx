import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import dayjs from 'dayjs';

import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import CricleGraph from './CricleGraph';
import Rank from './Rank';
import BarGraph from './BarGraph';

class ChartPanel extends React.Component {
  constructor(props) {
    super();
    this.state = {
      rank: props.data,
      rankTitle: '',
      isChangeTab: false,
      isOpen: false,
    };
  }

  UNSAFE_componentWillReceiveProps() {
    if (this.props.panelIndex !== this.props.appState.activityKey) {
      this.setState({
        rank: this.props.data,
        rankTitle: '',
        isChangeTab: true,
        isOpen: false,
      });
    }
  }

  changeMonth(item) {
    if (this.state.rankTitle === item.data._origin.item && this.state.isOpen) {
      this.setState({
        rank: this.props.data,
        rankTitle: '',
        isChangeTab: false,
        isOpen: false,
      });
    } else {
      const selectMonth = item.data._origin.date;
      const selectMonthTitle = item.data._origin.item;
      const newRank = _.filter(this.props.data, item => (
        dayjs(item.beginTime) > dayjs(selectMonth)
					&& dayjs(item.beginTime) < dayjs(selectMonth).endOf('month')
      ));
      this.setState({
        rank: newRank,
        rankTitle: selectMonthTitle,
        isChangeTab: false,
        isOpen: true,
      });
    }
  }

  render() {
    return (
      <Row>
        <Col span={9}>
          <BarGraph data={this.props.data} />
        </Col>
        <Col span={9}>
          <CricleGraph
            data={this.props.data}
            changeMonth={this.changeMonth.bind(this)}
            isChangeTab={this.state.isChangeTab}
          />
        </Col>
        <Col span={6}>
          <Rank data={this.state.rank} title={this.state.rankTitle} />
        </Col>
      </Row>
    );
  }
}

ChartPanel.propTypes = {
  data: PropTypes.array,
  appState: PropTypes.object,
  panelIndex: PropTypes.number,
};

export default inject('appState')(observer(ChartPanel));
