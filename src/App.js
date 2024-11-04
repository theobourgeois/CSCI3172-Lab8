import "./App.css";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

const NAME_REGEX = /[a-zA-Zé]+/;
const PASSWORD_REGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/;
const EMAIL_REGEX = /[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,4}/;

// function that returns the users from the local storage
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// function that returns the next user id
// finds the max id from the users and adds 1
function getNextUserId() {
  const users = getUsers();
  return users.length
    ? users.reduce((acc, user) => Math.max(acc, user.id), 0) + 1
    : 1;
}

function Homepage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log(data);

    // first name should be all letters
    if (!NAME_REGEX.test(data.firstName.trim())) {
      setError("First name should only contain letters");
      return;
    }

    // last name should be all letters
    if (!NAME_REGEX.test(data.lastName.trim())) {
      setError("Last name should only contain letters");
      return;
    }

    // password contains at least one number, 1 uppercase letter, 1 lowercase letter, and 1 special character
    if (!PASSWORD_REGEX.test(data.password)) {
      setError(
        "Password should contain at least one number, 1 uppercase letter, 1 lowercase letter, and 1 special character",
      );
      return;
    }

    // email should be in the correct format
    if (!EMAIL_REGEX.test(data.email.trim())) {
      setError("Email is not in the correct format");
      return;
    }

    const id = getNextUserId();
    const users = getUsers();
    users.push({ id, ...data });
    localStorage.setItem("users", JSON.stringify(users));
    navigate(`/profile/${id}`);
  };

  return (
    <main>
      <section>
        <h2>Enter your information</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="firstName"
            type="text"
            placeholder="Enter your first name"
          />
          <input
            name="lastName"
            type="text"
            placeholder="Enter your last name"
          />
          <input name="email" type="text" placeholder="Enter your email" />
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
          />

          <label>Favourite Season</label>
          <select name="season">
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="fall">Fall</option>
            <option value="winter">Winter</option>
          </select>

          <button type="submit">Submit</button>
        </form>
        <div>{Boolean(error) && <h3 style={{ color: "red" }}>{error}</h3>}</div>
      </section>
    </main>
  );
}

function Profile() {
  const userId = useParams().id;

  const user = useMemo(
    () => getUsers().find((user) => user.id === Number(userId)),
    [userId],
  );

  if (!user) {
    return (
      <main>
        <section>
          <h2>User not found</h2>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section>
        <h2>Profile</h2>
        <h3>First Name: {user.firstName}</h3>
        <h3>Last Name: {user.lastName}</h3>
        <h3>Email: {user.email}</h3>
        <h3>Favourite Season: {user.season}</h3>
        <Link to="/dashboard">Go to Dashboard</Link>
      </section>
    </main>
  );
}

function Dashboard() {
  const users = getUsers();
  return (
    <main>
      <section>
        <h2>Dashboard</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <Link to={`/profile/${user.id}`}>
                {user.firstName} {user.lastName}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function App() {
  return (
    <div className="App">
      <header>
        <h1>
          <Link to="/">Lab8</Link>
        </h1>
      </header>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <footer>
        Théo Bourgeois - All rights reserved {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
