import React, { useState } from 'react';
import { sendAction, registerDataUpdateFunction, registerOnConnectCallback } from "./socket/socket";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { InitializeForm, TextField, TextInput, SelectField, SelectInput} from "./helpers/form";
import { tlds, registerAgents, matchTypes} from "./constants";
import './App.scss';

const Index = () => {

  const quickMixerChangeHandler = ({ event, fields }) => {
    sendAction('quickmixer', fields);
  };
  const quickMixerFormHandler = InitializeForm({
    initialFormState: { domain: '', tld: '.com' },
    onSubmitCallback: quickMixerChangeHandler,
    onChangeCallback: quickMixerChangeHandler,
  });

  function domainPartClick(part){
    const update = { ...quickMixerFormHandler.fields, domain: quickMixerFormHandler.fields.domain+part }
    quickMixerFormHandler.setFields(update);
    quickMixerChangeHandler({fields:update});
  }
  return (
    <div id="page-index">
      <SearchForm domainPartClick={domainPartClick}></SearchForm>
      <QuickMixer formHandler={quickMixerFormHandler}></QuickMixer>
    </div>
  );
}

const SearchForm = ({domainPartClick}) => {
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
  initialFormState['agent'] = registerAgents[0].value;
  
  const onSubmitCallback = ({ event, fields }) => {
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
      <Results domainPartClick={domainPartClick} tld={formHandler.fields.tld} agent={formHandler.fields.agent}></Results>
    </div>
  )
}



const Results = ({tld, agent, domainPartClick}) => {
  const { domains } = useWebsocketHookData();
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
                  <span href="{r.domainWithTLD}"><DomainColorized domainPartClick={domainPartClick} domainObj={r} /></span> 
                  <IsAvailable r={r}/>
                </div>
              </div>
              <ResultSection r={r} domainLink={domainLink}/>
            </div>
          );
        })
      }
    </div>
  );
}

const IsAvailable = ({ r }) => {
  return (
    <span>
      &nbsp;is&nbsp;
      <span className={r.isAvailable ? 'available' : 'unavailable'}>
        {r.isAvailable ? 'available' : 'unavailable'}
      </span>
      .
    </span>
  );
};

const ResultSection = ({r, domainLink}) => {
  return (
    <span className="result-section">
      {
        r.isAvailable &&
        (
          <span className="register"><a href={domainLink(r.domainWithTLD)}>Go register {r.domainWithTLD}!</a></span>
        )
      }
      {
        !r.isAvailable &&
        (
          <span className="register"><a href={domainLink(r.domainWithTLD)}>Try .net, .org, .it, info, and others &rarr;</a></span>
        )
      }
    </span>
  )
}



const QuickMixer = ({formHandler}) => {
  const { quickMixResult } = useWebsocketHookData();
  const r = quickMixResult;
  function domainLink(domain) {
    return registerAgents[0].value.replace('$DOMAIN', domain);
  }
  return (
    <div id="quickmixer">
      <h4>Quick-Mixer</h4>
      <TextInput name="domain" formHandler={formHandler} size={formHandler.fields.domain.length} />
      <SelectInput name="tld" formHandler={formHandler} options={tlds} />
      {r &&
        <span className="output">
          <IsAvailable r={r} /> &nbsp;&nbsp;
          <ResultSection r={r} domainLink={domainLink} />
        </span>
      }
      <div class="description">Test the availablity of a single domain. You can click on word parts in search results to append them to the quick-mixer.</div>
    </div>
  )
}

const DomainColorized = ({ domainObj, domainPartClick}) => {
  return (
    <span className="colorized-domain">
      {domainObj.domainParts.map(function partProcess(part) {
        function partClick(){
          domainPartClick(part);
        }
        return (<span class="colorized-domain-part" onClick={partClick}>{part}</span>);
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