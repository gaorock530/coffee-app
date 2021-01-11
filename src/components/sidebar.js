import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';

const Accordion = withStyles({
  root: {
    width: '100%',
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    backgroundColor: '#333',
    color: '#fff',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: '#666',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    display: 'flex',
    padding: '0',
    flexDirection: 'column',
  },
}))(MuiAccordionDetails);

export default function CustomizedAccordions({menu = [], onClickMenu, active, expanded, handleExpend}) {
  
  // const [active, setActive] = React.useState(1)

  // const handleChange = (panel) => (event, newExpanded) => {
  //   setExpanded(newExpanded ? panel : false);
  // };

  const onClick = (id, level) => {
    onClickMenu(level, id)
    // setActive(id)
  }

  return (
    <>
      {menu.map((option, optionIdx) => (
        <Accordion square expanded={expanded === option.id} onChange={handleExpend.bind(this, option.id)} key={option.id}>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>{option.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {option.list.map((item, itemIdx) => <li className={active === item.id?'active': null} key={item.id} onClick={onClick.bind(this, item.id, [optionIdx, itemIdx])}>{item.title}</li>)}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}