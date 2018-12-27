import React, { useState } from 'react';
import { sendAction, registerDataUpdateFunction, registerOnConnectCallback } from "./socket/socket";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { InitializeForm, TextField, CheckboxField, SelectField } from "./helpers/form";
import { tlds, registerAgents, matchTypes} from "./constants";
import './App.scss';

const Index = () => {
  return (
    <div id="page-index">
      <SearchForm></SearchForm>
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
  if(Math.random() < 0.5){
    initialFormState['agent'] = registerAgents[0].value;
  }else{
    initialFormState['agent'] = registerAgents[1].value;
  }
  
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
    <div id="search">
      <form id="terms" onSubmit={formHandler.onSubmit}>
        <Term number={0} formHandler={formHandler}></Term>
        <Term number={1} formHandler={formHandler}></Term>
        <Term number={2} formHandler={formHandler}></Term>
        <p id="submit-container">
          <SelectField label="Top Level Domain" name="tld" formHandler={formHandler} options={tlds} />
          <SelectField label="Preferred Agent" name="agent" formHandler={formHandler} options={registerAgents} />

          <input tabindex="1" id="submit-terms" type="submit" value="Search" onClick={formHandler.onSubmit}></input>
        </p>
      </form>
      <Results tld={formHandler.fields.tld} agent={formHandler.fields.agent}></Results>
    </div>
  )
}

const Results = ({tld, agent}) => {
  const { domains } = useWebsocketHookData();
  console.log({tld, agent})
  if (!domains || domains.length === 0) {
    return (<div id="results">
      <p>No results. Try adjusting your query and clicking on search.</p>
    </div>);
  }
  function domainLink(domain){
    return agent.replace('$DOMAIN', domain);
  }
  return (
    <div id="results">
      {
        domains.map(function (r) {
          return (
            <div class="result">
              <div classname="result-section">
                <div className="domainWithTLD">
                  <span href="{r.domainWithTLD}"><DomainColorized domainObj={r} /></span> is
                    &nbsp;
                <span className={r.isAvailable ? 'available' : 'unavailable'}>
                    {r.isAvailable ? 'available' : 'unavailable'}
                  </span>.
                </div>
              </div>
              <div className="result-section">
                  {
                    r.isAvailable &&
                    (
                      <span className="register"><a href={domainLink(r.domainWithTLD)}>Go register it!</a></span>
                    )
                  }
                  {
                    !r.isAvailable &&
                    (
                      <span className="register"><a href={domainLink(r.domainWithTLD)}>Try .net, .org, .it, info, and others &rarr;</a></span>
                    )
                  }
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
      {domainObj.domainParts.map(function partProcess(part) {
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
    <TextField tabindex="1" label={`Term ${number + 1}`} name={`term${number}`} formHandler={formHandler} />
    <SelectField label="Match Method" tabindex="2" name={`matchType${number}`} formHandler={formHandler} options={matchTypes} />
    {/* 
       <SelectField name={`orderLocation${number}`} formHandler={formHandler} options={['Beginning', 'Middle', 'End', 'Any Position']} />
      <SelectField name={`isRequired${number}`} formHandler={formHandler} options={['Optional', 'Required']} />
    */}
  </div>;
}

function useWebsocketHookData() {
  console.log('initialized')
  const [data, setData] = useState({ domains: [] })
  registerDataUpdateFunction(function onUpdate(updatedData) {
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