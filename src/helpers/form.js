import React, { useState } from 'react';

const InitializeForm = ({ initialFormState, onSubmitCallback, onChangeCallback }) => {
  const [fields, setFields] = useState(initialFormState)
  const handleInputChange = event => {
    const { name, value } = event.target
    const newFields = { ...fields, [name]: value };
    setFields(newFields);
    if (onChangeCallback) {
      onChangeCallback({ event, fields: newFields });
    }
  }
  function onSubmit(event) {
    event.preventDefault();
    onSubmitCallback({ event, fields });
  }
  return { handleInputChange, fields, setFields, onSubmit };
}

const TextField = (props) => {
  return (
    <FieldWrapper wrapperClass="text-field" {...props}>
      <TextInput {...props} />
    </FieldWrapper>
  )
}

const TextInput = ({ label, name, formHandler, ...props }) => {
  return (
    <input {...props} type="text" name={name} value={formHandler.fields[name]} onChange={formHandler.handleInputChange}></input>
  );
}

const FieldWrapper = (props) => {
  return (
    <div className="field {wrapperClass}">
    {
      props.label && <label for={props.name}>{props.label}</label>
    }
      {props.children}
    </div>
  )
}


const CheckboxField = ({ label, name, formHandler }) => {
  return (
    <span class="checkbox-field">
      <input type="checkbox" name={name} value={formHandler.fields[name]} onChange={formHandler.handleInputChange} />
      {
        label && <label for={name}>{label}</label>
      }
    </span>
  );
}

const SelectField = (props) => {
  return (
    <div class="field select-field">
      {
        props.label && <label for={props.name}>{props.label}</label>
      }
      <SelectInput {...props}></SelectInput>

    </div>
  );
}

const SelectInput = ({ label, name, options, formHandler, ...props }) => {
  return (
    <select  {...props} name={name} value={formHandler.fields[name]} onChange={formHandler.handleInputChange}>
      {
        options.map((option, index) => {
          let optionObj = null;
          if (typeof (option) === 'string') {
            optionObj = { value: option, label: option };
          } else {
            optionObj = option;
          }
          return (
            <option key={index} value={optionObj.value}>{optionObj.label}</option>
          )
        })
      }
    </select>
  );
}

export {
  TextField,
  TextInput,
  CheckboxField,
  SelectField,
  InitializeForm,
  SelectInput
}