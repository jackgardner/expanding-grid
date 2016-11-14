import React from 'react';
import Row from './Row.jsx';
import HeaderRow from './HeaderRow.jsx';
import InsertRow from './InsertRow.jsx';
import { AGC } from 'meteor/agctech:core';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

export default class Grid extends React.Component {

  static defaultProps = {
    displayRow: function () { return true; },
    saveButtonText: <FontAwesome name="check"/>,
    editButtonText: <FontAwesome name="pencil"/>,
    cancelButtonText: <FontAwesome name="times"/>,
    insertRowComponent: InsertRow
  };

  static propTypes = {
    schema: React.PropTypes.object.isRequired,
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  };

  constructor(props) {
    super(props);
    this.buildGrid(props);
    this.renderHeaders = this.renderHeaders.bind(this);
    this.renderRows = this.renderRows.bind(this);
    this.renderInsertRow = this.renderInsertRow.bind(this);
    this.saveRow = this.saveRow.bind(this);
    this.generateFilters = this.generateFilters.bind(this);

  }

  componentWillReceiveProps(newProps) {
    if (newProps.data && newProps.data.length) {
      this.setState({ filters: this.generateFilters(newProps.data) })
    }
  }

  saveRow(item) {
    const { saveRow } = this.props;
    if (saveRow && typeof saveRow === 'function') {
      saveRow.call(null, item);
    }
  }

  generateFilters(data) {
    const { headers } = this.state;
    const { primaryCollection } = this.props;

    return headers.map(header => {
      const column = data
      .map(dataItem => {
        let value = null;
        if (header.content && typeof header.content === 'function') {
          value = header.content.call(dataItem);
        } else {
          value = (header.fn) ? dataItem[header.fn].call(dataItem) : AGC.walkObject(dataItem, header.header) || '';
        }

        return { value: value, internal: AGC.walkObject(dataItem, header.header) };
      });

      return { collection: header.collection || primaryCollection, columnName: header.header, values: _.uniqWith(column, (arrVal, othVal) => arrVal.value === othVal.value) };
    });
  }

  buildGrid(props) {
    const { schema, columns, styles, enableEdit, enableInsert } = props;
    const baseHeaders = columns.map(header => {
      const value = header.value || header;
      return {
        ...header,
        type: header.type,
        label: header.label || schema.label(value),
        header: value
      }
    });

    this.state = {
      headers: baseHeaders
    };
  }

  renderInsertRow() {
    const { headers } = this.state;
    const { enableInsert, styles, schema, insertRowComponent, expandable, modelService, saveButtonText } = this.props;
    if (!enableInsert) return null;
    const InsertRowComponent = insertRowComponent;

    return <InsertRowComponent
      saveRow={this.saveRow}
      styles={styles} enableInsert
      expandable={expandable}
      schema={schema} header={headers} saveButtonText={saveButtonText}/>
  }

  renderRows() {
    const { headers } = this.state;
    const { styles, enableEdit, saveButtonText, expandable, expandableComponent, data, currencyCode, loading, loadingComponent, displayRow, schema, editButtonText, cancelButtonText } = this.props;

    if (loading) {
      const LoadingComponent = loadingComponent;
      return (<tbody>
      <tr>
        <td><LoadingComponent /></td>
      </tr>
      </tbody>);
    }

    return data.filter(item => displayRow(item)).map((item, key) => {
      return ( <Row
          expandable={expandable}
          expandableComponent={expandableComponent}
          styles={styles}
          saveButtonText={saveButtonText}
          editButtonText={editButtonText}
          cancelButtonText={cancelButtonText}
          currencyCode={currencyCode}

          saveRow={this.saveRow}
          schema={schema}
          header={headers}
          item={item}
          enableEdit={enableEdit}
          key={key}/>
      )
    })
  }

  renderHeaders() {
    const { headers, filters } = this.state;
    const { styles, expandable, enableInsert, enableEdit, onFilterChanged }  = this.props;
    const renderActionsColumn = enableInsert || enableEdit;

    return <HeaderRow columns={headers} styles={styles}
                      filterable={true}
                      filters={filters}
                      onFilterChanged={onFilterChanged}
                      actionsColumn={renderActionsColumn}
                      expandable={expandable}/>;
  }

  render() {
    const { styles } = this.props;
    return (
      <table className={styles.grid}>
        {this.renderHeaders()}
        {this.renderInsertRow()}
        {this.renderRows()}
      </table>
    )
  }
}
