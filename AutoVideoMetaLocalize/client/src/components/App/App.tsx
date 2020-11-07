import * as React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {AppLayout} from './AppLayout/AppLayout';

/**
 * The highest level react component.
 *
 * @return {JSX.Element}
 */
export function App(): JSX.Element {
  return (
    <Router>
      <AppLayout/>
    </Router>
  );
}

// The following LOC renders the app component to the DOM.
render(<App />, document.getElementById('app'));
