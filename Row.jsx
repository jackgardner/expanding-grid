import React from 'react';
import { AGC } from 'meteor/agctech:core';
import Cell from './Cell.jsx';
import InsertRow from './InsertRow.jsx';
import classnames from 'classnames';
import { ValidatingFormGroup } from 'client/lib/ValidatingForm';
import { Button } from 'reactstrap';
import _ from 'lodash';

export default class Row extends React.Component {
  constructor(props) {
    super(props);

    const insertObj = {};
    props.header.forEach(header => {
      insertObj[header.header] = _.get(props.item, header.header, header.type === 'date'?  new Date() : '');
    });

    if (props.item && props.item._id) {
      insertObj._id = props.item._id;
    }

    this.originalInsertObj = Object.assign({}, insertObj);

    this.state = {
      expanded: false,
      insert: insertObj
    };



    this.toggle = this.toggle.bind(this);
    this.renderInsertRow = this.renderInsertRow.bind(this);
    this.saveRow = this.saveRow.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
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

  onChange(event) {
    const { modelService } = this.props;

    const state = this.state.insert;
    state[event.target.id] = event.target.value;
    this.setState({ insert: state });
    modelService.setModelField(event.target.id, event.target.value);
  }

  saveRow() {
    const { modelService } = this.props;
    if (modelService) {
      if (!modelService.hasInitialised) {
        modelService.updateModel(this.state.insert);
      }

      modelService.save();
    }

    this.props.saveRow(this.state.insert);
    this.setState({ insert: this.originalInsertObj });
    this.toggleEdit();
  }

  componentWillReceiveProps(newProps) {

  }

  toggleEdit() {
    const { modelService, item } = this.props;
    if (modelService) {
      modelService.init(item);
    }

    this.setState({ editing: !this.state.editing });
  }

  renderInsertRow() {
    return <InsertRow {...this.props} />
  }

  toggle() {
    if (this.props.expandable) {
      this.setState({
        expanded: !this.state.expanded
      });
    }
  }



  render() {
    const { editButtonText, enableInsert, enableEdit, item, currencyCode, expandableComponent, expandable, styles } = this.props;

    const ExpandableComponent = expandableComponent;
    let rowContent = null;
    let expandableRow = null;
    let actionColumn = null;

    const renderEditable = enableInsert || enableEdit && this.state.editing;

    if (renderEditable) {
      rowContent = this.renderInsertRow();
    } else {
      let expandableBit = null;
      if (expandable) {
        const className = classnames(styles.cell, styles.expandGlyph);
        const glyph = (this.state.expanded) ? '-' : '+';
        expandableBit = (<td className={className}>
          {glyph}
        </td>);
      }
      const expanded = {};
      expanded[styles.expanded] = this.state.expanded;
      expanded[styles.expandable] = expandable;

      const rowClassname = classnames(styles.row, expanded);
      const howManyColumns = (enableInsert) ? this.props.header.length + 1 : this.props.header.length;
      const expandedRowStyle = classnames(styles.row, styles.expandedContent, expanded);

      expandableRow = (expandable) ?
        (<tr className={expandedRowStyle}>
          <td />
          <td colSpan={howManyColumns}>
            <div className={styles.content}>
              <ExpandableComponent item={item}/>
            </div>
          </td>
        </tr>) : null;

      if (enableEdit) {
        actionColumn = <td className={styles.cell}><Button
          bsSize="small" onClick={this.toggleEdit}>{editButtonText}</Button>
        </td>;
      }

      rowContent = (<tr onClick={this.toggle} className={rowClassname}>
        {expandableBit}
        {this.props.header.map((header, key) => {
          let value = null;
          if (header.content && typeof header.content === 'function') {
            const content = header.content.call(item);
            value = content;
          } else {
            value = (header.fn) ? item[header.fn].call(item) : AGC.walkObject(item, header.header) || '';
          }

          const link = (header.link) ? header.link.bind(item) : null;

          return <Cell link={link} className={styles.cell}
                       currencyCode={currencyCode}
                       type={header.type} key={key} value={value}/>;
        })}
        {actionColumn}
      </tr>);
    }

    return (
      <tbody className={styles.gridBody}>
      {rowContent}
      {expandableRow}
      </tbody>
    )
  }
}
