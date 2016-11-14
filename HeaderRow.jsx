import React from 'react';
import HeaderFilter from './HeaderFilter.jsx';

export default class HeaderRow extends React.Component {
  static defaultProps = {
    filters: []
  };

  constructor(props) {
    super(props);

    this.state = {
      filters: {}
    };

    this.renderHeaderCell = this.renderHeaderCell.bind(this);
    this.onFilterChanged = this.onFilterChanged.bind(this);
  }

  onFilterChanged(header, values) {
    const { filters } = this.state;
    const { onFilterChanged } = this.props;

    if (!filters[header.collection]) filters[header.collection] = {};
    if (values.length) {
      filters[header.collection][header.header] = values;
    } else {
      delete filters[header.collection][header.header];
    }

    onFilterChanged(filters);

    this.setState({
      filters: filters
    })
  }

  renderHeaderCell(header, key) {
    const { styles, filterable, filters }  = this.props;
    if (filterable) {
      const headerFilter = filters.find(filter => filter.columnName === header.header);
      if (headerFilter) {
        return (<th className={styles.cell} key={key}>
          <HeaderFilter onFilterChanged={this.onFilterChanged} collection={headerFilter.collection} header={header.header} label={header.label} values={headerFilter.values}/>
        </th>)
      }
    }

    return <th className={styles.cell} key={key}>{header.label}</th>;
  }
  render() {
    const { styles, expandable, actionsColumn, columns }  = this.props;

    const expandableColumn = (expandable) ? <th className={styles.cell}/>
      : null;

    const actionsHeader = (actionsColumn) ?
      <th className={styles.cell}/> : null;

    return (
      <tbody className={styles.gridHeader}>
      <tr className={styles.row}>
        {expandableColumn}
        {columns.map((header, key) => this.renderHeaderCell(header, key))}
        {actionsHeader}
      </tr>
      </tbody>
    );
  }
}
