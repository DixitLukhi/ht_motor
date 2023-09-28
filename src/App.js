import React from 'react';
import AllRoutes from './routes/AllRoutes';
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from 'react-helmet';

function App() {
  return (
    <div className="App">
      <Helmet>
        {/* <!-- Meta Tag --> */}
        <title>HT Motor</title>
      </Helmet>
      <React.Fragment>
        <AllRoutes />
      </React.Fragment>
    </div>
  );
}

export default App;
