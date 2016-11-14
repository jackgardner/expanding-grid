import React from 'react';
import Cell from './Cell.jsx';
import _ from 'lodash';
import { Button } from 'reactstrap';

export default class InsertRow extends React.Component {
  static defaultProps = {
    header: []
  };

  constructor(props) {
    super(props);
    const insertObj = {};

    props.header.forEach(header => {
      insertObj[header.header] = _.get(props.item, header.header, header.type === 'date' ? new Date() : '');
    });

    if (props.item && props.item._id) {
      insertObj._id = props.item._id;
    }

    this.originalInsertObj = Object.assign({}, insertObj);

    this.state = {
      insert: insertObj
    };

    this.onChange = this.onChange.bind(this);
    this.saveRow = this.saveRow.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { modelService } = newProps;
    modelService.init(this.state.insert); // Hack
  }
  onChange(event) {
    const { modelService } = this.props;
    const state = this.state.insert;
    state[event.target.id] = event.target.value;
    this.setState({ insert: state });
    modelService.setModelField(event.target.id, event.target.value);
  }

  onSelectChange(event, val) {
    const { modelService } = this.props;
    const state = this.state.insert;
    let values;
    if (Array.isArray(val)) {
      values = val.map(val => val.value)
    } else {
      values = val.value;
    }
    state[event.controlId] = values;
    this.setState({ insert: state });
    modelService.setModelField(event.controlId, values)
  }


  saveRow() {
    const { modelService } = this.props;
    if (modelService) {
      modelService.save();
    }

    this.props.saveRow(this.state.insert);
    this.setState({ insert: this.originalInsertObj });
  }

  render() {
    const { styles, header, currencyCode, expandable, enableEdit, saveButtonText, cancelButtonText } = this.props;
    const cancelButton = (enableEdit) ?
      <Button onClick={this.toggleEdit} bsSize="small"
              bsStyle="danger">{cancelButtonText}</Button> : null;

    return <tbody className={styles.gridBody}>
    <tr className={styles.insertRow}>
      {expandable ? <td /> : null}
      {header.filter(header => !header.empty).map((item, key) => {
        const controlToRender = (item.editFn) ? item.editFn.call(this, Object.assign({}, this.state.insert, item)) : undefined;
        return <Cell className={styles.cell}
                     edit
                     styles={styles}
                     onChange={this.onChange}
                     controlToRender={controlToRender}
                     currencyCode={currencyCode}
                     id={item.header}
                     type={item.type} key={key}
                     value={this.state.insert[item.header]}/>;
      })}
      <td>
        <Button onClick={this.saveRow} bsSize="small"
                bsStyle="primary">{saveButtonText}</Button>
        {cancelButton}
      </td>
    </tr>
    </tbody>
  }
}
