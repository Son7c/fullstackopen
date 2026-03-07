import { useState } from "react";

const Filter = ({ filter, handleSearchChange }) => {
  return (
    <div>
      Search: <input type="text" value={filter} onChange={handleSearchChange} />
    </div>
  );
};

const PersonForm = ({
  handleSubmit,
  handleChange,
  handleNoChange,
  newName,
  newNo,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleChange}></input>
      </div>
      <br />
      <div>
        number: <input value={newNo} onChange={handleNoChange}></input>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ filteredPersons }) => {
  return (
    <ul>
      {filteredPersons.map((person, i) => (
        <li key={i}>
          {person.name} &nbsp; {person.number}
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNo, setNewNo] = useState("");
  const [filter, setFilter] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    let isAvail = persons.some((person) => person.name === newName);
    if (isAvail) {
      alert(`${event.target[0].value} is already added to phonebook`);
      setNewName("");
      setNewNo("");
      return;
    }
    setPersons(
      persons.concat({ name: newName, number: newNo, id: persons.length + 1 }),
    );
    setNewName("");
    setNewNo("");
  };

  let filteredPersons = persons.filter((person) =>
    person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()),
  );

  const handleChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNoChange = (event) => {
    setNewNo(event.target.value);
  };
  const handleSearchChange = (event) => {
    setFilter(event.target.value);
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleSearchChange={handleSearchChange} />
      <br />
      <h2>Add a person</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleNoChange={handleNoChange}
        newName={newName}
        newNo={newNo}
      />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons}/>
    </div>
  );
};

export default App;
