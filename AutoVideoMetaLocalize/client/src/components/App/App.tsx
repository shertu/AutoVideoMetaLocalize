import * as React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import './style.less';
import {AppLayout} from './AppLayout/AppLayout';

/**
 * The highest-level react component.
 */
export function App(): JSX.Element {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
// <MonetisationPage/>

// Render the application to the DOM.
render(<App />, document.getElementById('app'));
