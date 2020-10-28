import { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { createNote, deleteNote, updateNote } from './graphql/mutations';
import { listNotes } from './graphql/queries';

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, selectNote] = useState({});

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await API.graphql(graphqlOperation(listNotes));
      console.log({ data })
      setNotes(data.listNotes.items)
    }
    fetchNotes();
  }, []);

  const submitNote = async event => {
    event.preventDefault();
    if(notes.some(note => note.id === selectedNote.id)) {
      console.log(`should update the note ${selectedNote.id}`)
      const { data } = await API.graphql(graphqlOperation(updateNote, { input: { id: selectedNote.id, note: note || selectedNote.note }}))
      const updatedNote = data.updateNote;
      const newNotes = [...notes, notes[notes.findIndex(note => note.id === updatedNote.id)] = updatedNote];
      console.log(updatedNote, newNotes);
      selectNote({})
      setNote("");
      console.log({ selectedNote, note })
    } else {
      const { data } = await API.graphql(graphqlOperation(createNote, { input: { note }}))
      setNotes([data.createNote, ...notes]);
      setNote("");
      console.log({ selectedNote, note })
    }
  }

  const removeNote = async noteId => {
    const { data } = await API.graphql(graphqlOperation(deleteNote, { input: { id: noteId }}));
    const deletedNoteId = data.deleteNote.id;
    setNotes(notes.filter(({ id }) => id !== deletedNoteId));
  }
  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-1">
        Amplify NoteTaker
      </h1>
      <form onSubmit={event => submitNote(event)} className="mb3">
        <input 
          className="pa2 f4" 
          placeholder="Write your note"
          defaultValue={selectedNote.note || note}
          onChange={({ target: { value }}) => setNote(value)}
        />
        <button className="pa2 f4" type="submit">
          Add note
        </button>
      </form>
      <div>
        {notes.map(({ id, note }) => (
          <div key={id} className="flex items-center">
            <li onClick={() => selectNote({ id, note })} className="list pa1 f3">
              {note}
            </li>
            <button onClick={() => removeNote(id)} className="bg-transparent bn f4">
              <span>&times;</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
