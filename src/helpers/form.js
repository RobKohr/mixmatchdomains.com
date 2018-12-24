import React, {useState} from 'react';

const InitializeForm = ({ initialFormState, onSubmitCallback, onChangeCallback }) => {
  const [fields, setFields] = useState(initialFormState)
  const handleInputChange = event => {
    const { name, value } = event.target
    const newFields = {...fields, [name]: value};
    setFields(newFields);
    if(onChangeCallback){
      onChangeCallback({ event, fields:newFields});
    }
  }
  function onSubmit(event) {
    event.preventDefault();
    console.log('here');
    onSubmitCallback({ event, fields });
  }
  return { handleInputChange, fields, setFields, onSubmit };
}

const TextField = ({ label, name, formHandler }) => {
  return (
    <div class="field text-field">
      {
        label && <label for={name}>{label}</label>
      }
      <input type="text" name={name} value={formHandler.fields[name]} onChange={formHandler.handleInputChange}></input>
    </div>
  );
}
const CheckboxField = ({ label, name, formHandler }) => {
  return (
    <span class="checkbox-field">
      <input type="checkbox" name={name} value={formHandler.fields[name]} onChange={formHandler.handleInputChange}/>
      {
        label && <label for={name}>{label}</label>
      }
    </span>
  );
}

const SelectField = ({ label, name, options, formHandler }) => {
  return (
    <div class="field select-field">
      {
        label && <label for={name}>{label}</label>
      }
      <select name={name} value={formHandler.fields[name]} onChange={formHandler.handleInputChange}>
        {
          options.map((option, index)=>{
            let optionObj = null;
            if(typeof(option)==='string'){
              optionObj = { value: option, label:option };
            }else{
              optionObj = option;
            }
            return (
              <option key={index} value={optionObj.value}>{optionObj.label}</option>
            )
          })
        }
      </select>
    </div>
  );
}

export {
  TextField,
  CheckboxField,
  SelectField,
  InitializeForm
}