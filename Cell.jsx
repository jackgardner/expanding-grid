import React from 'react';
import Date from './CellTypes/Date.jsx';
import { injectIntl, FormattedNumber } from 'react-intl';
import { Input } from 'reactstrap';
import { ValidatingFormGroup } from 'client/lib/ValidatingForm';
class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.renderLabel = this.renderLabel.bind(this);
    this.renderEditControl = this.renderEditControl.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  // POS component doesn't handle change events in a consistent way
  onChange(value) {
    const { id, onChange } = this.props;
    const customEvent = {
      target: { 
        id,
        value
      }
    };

    onChange(customEvent);
  }
  renderEditControl(label) {
    let { controlToRender, styles, type, onChange, id } = this.props;

    if (!controlToRender) {
      if (type === 'date') {
        controlToRender = <Date onChange={this.onChange} edit value={label} />
      } else {

        controlToRender = <Input
          onChange={onChange}
          value={label} placeholder={label}/>;
      }
    }

    return (<ValidatingFormGroup
                           className={styles['formGroup']}
                           controlId={id}>
      {controlToRender}
    </ValidatingFormGroup>);
  }

  renderLabel(label) {
    const { currencyCode, type, link } = this.props;

    if (Object.prototype.toString.call(label) === '[object Date]') {
      return <Date value={label} />
    }


    switch (type) {
      case 'currency':
        return <FormattedNumber value={label} style="currency" currency={currencyCode} />
    }


    if (link) {
      return <a href="" onClick={link}>{label}</a>;
    }

    return <div>{label}</div>
  }
  render() {
    const { value, className, edit } = this.props;
    return (<td className={className}>{edit ? this.renderEditControl(value) : this.renderLabel(value)}</td>)
  }
}
export default injectIntl(Cell)
