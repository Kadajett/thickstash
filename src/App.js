import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import socketIOClient from "socket.io-client";
import {
  ALERT_CHOOSE_ROOM,
  ALERT_NEW_MESSAGE,
  ALERT_NEW_USER,
  ALERT_USERNAME_TAKEN,
  INPUT_CHOOSE_ROOM,
  INPUT_NEW_MESSAGE,
  INPUT_GAME_START,
} from "./constants";

function App() {
  const [response, setResponse] = useState({});
  const [endpoint, setEndpoint] = useState("localhost:3001");
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("TestUser");
  const [userList, setUserList] = useState([]);
  const [messageList, setMessagesList] = useState([]);
  const [roomID, setRoomId] = useState("");
  const [tempRoomID, setTempRoomId] = useState("");
  let messageInput;

  const addToMessages = (msg) =>
    setMessagesList((messageList) => [...messageList, msg]);

  useEffect(() => {
    const socket = socketIOClient(endpoint);
    setSocket(socket);
  }, []);

  const sendMessage = () => {
    // validity check @TODO:
    socket.emit(INPUT_NEW_MESSAGE, { message });
    messageInput.value = "";
  };

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const setRoom = () => {
    setRoomId(tempRoomID);
  };

  const startGame = () => {
    socket.emit(INPUT_GAME_START);
  };

  useEffect(() => {
    if (socket) {
      console.log("changeRoom");
      socket.emit(INPUT_CHOOSE_ROOM, { roomID, username });
      socket.on(ALERT_USERNAME_TAKEN, () => {
        setRoomId(null);
      });
      socket.on(ALERT_NEW_MESSAGE, (message) => {
        addToMessages(message);
      });
      socket.on(ALERT_NEW_USER, (users) => {
        setUserList(users);
      });
    }
  }, [roomID]);

  return (
    <div className="App">
      <header className="App-header">
        DickStash {roomID && <h3>Room: {roomID}</h3>}
      </header>
      <section className="sidebar">
        <ul>{userList && userList.map((user) => <li>{user}</li>)}</ul>
      </section>
      <section>
        {roomID && (
          <section>
            {messageList && (
              <aside>
                <h3>Press Start when all users are ready</h3>
                <button onClick={startGame}>Start Game</button>
              </aside>
            )}
          </section>
        )}
        {!roomID && (
          <section>
            <h1>Enter a room number & a username</h1>
            <input
              type="text"
              placeholder="Room ID"
              onChange={(e) => setTempRoomId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={setRoom}>Submit</button>
          </section>
        )}
      </section>
    </div>
  );
}

export default App;
