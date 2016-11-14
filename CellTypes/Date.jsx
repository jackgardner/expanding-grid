import React from 'react';
import moment from 'moment';
import { DateTimePicker } from 'react-widgets';

export default class Date extends React.Component {
  render() {
    const { value, edit, onChange } = this.props;
    if (edit) {
      return <DateTimePicker onChange={onChange} value={value} time={false} />;
    }
    return <div>{moment(value).format('DD/MM/YYYY')}</div>
  }
}
