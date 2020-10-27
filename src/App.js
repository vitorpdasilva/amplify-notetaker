import { withAuthenticator } from 'aws-amplify-react';

function App() {
  return (
    <div>
      app
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
