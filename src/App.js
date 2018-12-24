import React, {useState} from 'react';
import { sendAction, registerDataUpdateFunction, registerOnConnectCallback } from "./socket/socket";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { InitializeForm, TextField, CheckboxField, SelectField } from "./helpers/form";
import { tlds } from "./constants";
import './App.scss';

const Index = ({ data }) => {
  console.log('data is', data);
  return (
    <div id="page-index">
      <SearchForm></SearchForm>
      <Results></Results>
    </div>
  )
}

const SearchForm = () => {
  const fieldGroups = ['term', 'matchType', 'orderLocation', 'isRequired'];
  const fieldNumbers = [0, 1, 2]
  const initialFormState = { term: '', matchType: 'Synonym', orderLocation: 'Any Position', isRequired: 'Required' };
  const fieldGroupDefaultValues = {}
  fieldGroups.forEach(fieldGroup => {
    fieldNumbers.forEach(fieldNumber => {
      initialFormState[`${fieldGroup}${fieldNumber}`] = initialFormState[fieldGroup];
    });
  })
  initialFormState['isRequired3'] = 'Optional';
  initialFormState['tld'] = '.com';
  const onSubmitCallback = ({ event, fields }) => {
    console.log(JSON.stringify(fields, null, 5));
    sendAction('updateConstraints', fields);
  };

  const onChangeCallback = ({ event, fields, name, value }) => {
    //
    //sendAction('updateConstraints', fields);
  };
  const formHandler = InitializeForm({ initialFormState, onSubmitCallback, onChangeCallback });

  return (
    <form id="terms" onSubmit={formHandler.onSubmit}>
      <Term number={0} formHandler={formHandler}></Term>
      <Term number={1} formHandler={formHandler}></Term>
      <Term number={2} formHandler={formHandler}></Term>
      <p id="submit-container">
        <SelectField label="Top Level Domain" name="tld" formHandler={formHandler} options={tlds} />
        <input id="submit-terms" type="submit" value="Search" onClick={formHandler.onSubmit}></input>
      </p>
    </form>
  )
}

const Results = () => {
  const { domains } = useWebsocketHookData();
  return (
    <div id="results">
      {
        domains && domains.map(function (r) {
          return (
            <div class="result">
              <div className="domainWithTLD">
              <span href="{r.domainWithTLD}"><DomainColorized domainObj={r}/></span> is 
                <span className={ r.isAvailable ? 'available' : 'unavailable'}>
                  { r.isAvailable ? ' available' : ' unavailable'}
                </span>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

const DomainColorized = ({ domainObj }) => {
  return (
    <span className="colorized-domain">
      { domainObj.domainParts.map(function partProcess(part){
        return (<span class="colorized-domain-part">{part}</span>);
      })
      }
      <span className="tld">{domainObj.tld}</span>
    </span>
  );
}

const Term = ({ number, formHandler }) => {
  const termClass = formHandler.fields[`term${number}`] === '' ? 'empty' : '';
  return <div className={`term term-${number} ${termClass}`}>
    <TextField label={`Term ${number+1}`} name={`term${number}`} formHandler={formHandler} />
    <SelectField name={`matchType${number}`} formHandler={formHandler} options={['Synonym', 'Exact Match']} />
    {/* 
       <SelectField name={`orderLocation${number}`} formHandler={formHandler} options={['Beginning', 'Middle', 'End', 'Any Position']} />
      <SelectField name={`isRequired${number}`} formHandler={formHandler} options={['Optional', 'Required']} />
    */}
  </div>;
}

function useWebsocketHookData() {
  console.log('initialized')
  const [data, setData] = useState({domains:[]})
  registerDataUpdateFunction(function onUpdate(updatedData){
    console.log('we did it', updatedData)
    setData(updatedData);
  })
  return data;
}

const AppRouter = () => {
  return (
    <Router>
      <div>
        <Route path="/" exact component={Index} />
      </div>
    </Router>
  );
}

export default AppRouter;