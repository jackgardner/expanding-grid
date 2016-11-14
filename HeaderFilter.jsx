import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-translate';
import styles from './HeaderFilter.css';
import FontAwesome from 'react-fontawesome';
import { Checkbox } from 'reactstrap';

@translate('HeaderFilter')
@CSSModules(styles)
export default class HeaderFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filtersEnabled: [],
      showFilterSelect: false
    };

    this.selectFilter = this.selectFilter.bind(this);
    this.toggleFilterSelect = this.toggleFilterSelect.bind(this);
  }

  toggleFilterSelect() {
    this.setState({
      showFilterSelect: !this.state.showFilterSelect
    });
  }

  selectFilter(value) {
    const { filtersEnabled } = this.state;
    const { onFilterChanged, header, collection } = this.props;

    let newFilters = [];

    if (filtersEnabled.indexOf(value.internal) === -1) {
      newFilters = Array.prototype.concat(filtersEnabled, [value.internal]);
    } else {
      newFilters = filtersEnabled.filter(item => item !== value.internal);
    }

    if (onFilterChanged) {
      onFilterChanged({ header: header, collection: collection }, newFilters);
    }

    this.setState({
      filtersEnabled: newFilters
    });
  }

  render() {
    const { values, label } = this.props;
    const { filtersEnabled, showFilterSelect } = this.state;

    let filterSelect = null;
    if (showFilterSelect) {
      filterSelect = (<div className={styles.filterBox}>
        <form>
          {values.map((val, key) => {

              return <Checkbox
                onChange={() => this.selectFilter(val) }
                checked={filtersEnabled.indexOf(val.internal) > -1}
                key={key}>{(val && val.value) ? val.value.toString() : ''}</Checkbox>
            }
          )}
        </form>
      </div>);
    }
    return <div>

      <div className={styles.headerFilter}>
        <div className={styles.title}>{label}</div>
        <div className={styles.icons}>
          <FontAwesome
            border
            onClick={this.toggleFilterSelect}
            name="angle-down"/>
          <FontAwesome
            border
            onClick={this.toggleFilterSelect}
            name="filter"/>
        </div>


      </div>
      {filterSelect}
    </div>
  }
}
