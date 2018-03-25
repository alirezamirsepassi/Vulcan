import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:core';
import Button from 'react-bootstrap/lib/Button';

const FormNestedItem = (
  { isDeleted, nestedFields, name, path, subDocument, removeItem, itemIndex, ...props },
  { errors }
) => {
  return (
    <div className={`form-nested-item ${isDeleted ? 'form-nested-item-deleted' : ''}`}>
      <div className="form-nested-item-inner">
        {nestedFields.map((field, i) => {
          // note: default value to '' to avoid uncontrolled component error
          let value = (subDocument && subDocument[field.name]) || '';
          if (props.control === 'number') value = Number(value);
          return (
            <Components.FormComponent
              key={i}
              {...props}
              {...field}
              path={`${path}.${field.name}`}
              value={value}
              itemIndex={itemIndex}
            />
          );
        })}
      </div>
      <div className="form-nested-item-remove">
        <Button
          bsStyle="danger"
          onClick={() => {
            removeItem(name);
          }}
        >
          ✖️
        </Button>
      </div>
      <div className="form-nested-item-deleted-overlay" />
    </div>
  );
};

FormNestedItem.contextTypes = {
  errors: PropTypes.array,
};

registerComponent('FormNestedItem', FormNestedItem);

class FormNested extends PureComponent {
  addItem = () => {
    this.props.updateCurrentValues({ [`${this.props.path}.${this.props.value.length}`]: {} });
  };

  removeItem = index => {
    this.props.updateCurrentValues({ [`${this.props.path}.${index}`]: null });
  };

  /*

  Go through this.context.deletedValues and see if any value matches both the current field
  and the given index (ex: if we want to know if the second address is deleted, we
  look for the presence of 'addresses.1')
  */
  isDeleted = index => {
    return this.context.deletedValues.includes(`${this.props.path}.${index}`);
  };

  render() {
    return (
      <div className="form-group row form-nested">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          {this.props.value &&
            this.props.value.map(
              (subDocument, i) =>
                !this.isDeleted(i) && (
                  <FormNestedItem
                    {...this.props}
                    key={i}
                    itemIndex={i}
                    subDocument={subDocument}
                    path={`${this.props.path}.${i}`}
                    removeItem={() => {
                      this.removeItem(i);
                    }}
                  />
                )
            )}
          <Button bsStyle="success" onClick={this.addItem}>
            ➕
          </Button>
        </div>
      </div>
    );
  }
}

FormNested.contextTypes = {
  deletedValues: PropTypes.array,
};

registerComponent('FormNested', FormNested);
