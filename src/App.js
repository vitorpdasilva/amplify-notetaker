import { useState } from 'react';
import { withAuthenticator } from 'aws-amplify-react';

function App() {
  const [notes, setNotes] = useState([{ id: 1, note: 'hello' }]);
  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-1">
        Amplify NoteTaker
      </h1>
      <form className="mb3">
        <input 
          className="pa2 f4" 
          placeholder="Write your note"
        />
        <button className="pa2 f4" type="submit">
          Add note
        </button>
      </form>
      <div>
        {notes.map(({ id, note }) => (
          <div key={id} className="flex items-center">
            <li className="list pa1 f3">
              {note}
            </li>
            <button className="bg-transparent bn f4">
              <span>&times;</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
