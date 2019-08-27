import { FC, useContext, useEffect, useState } from "react";
import { Context } from "./index";
import LoginForm from "./components/LoginForm";
import { observer } from "mobx-react-lite";
import { IUser } from "./models/IUser";
import UserService from "./services/UserService";

const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  const getUsers = async () => {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (store.isLoading) {
    return <div>Loading...</div>;
  }

  if (!store.isAuth) {
    return (
      <div>
        <LoginForm />
        <button onClick={getUsers}>Get Users</button>
      </div>
    );
  }

  return (
    <div>
      <h1>
        {store.isAuth ? `User is authorized ${store.user.email}` : "Log in"}
      </h1>
      <h1>
        {store.user.isActivated ? "Account activated" : "Acivate your account"}
      </h1>
      <button onClick={() => store.logout()}>Log out</button>
      <div>
        <button onClick={getUsers}>Get Users</button>
      </div>
      {users.map((user) => {
        return <div key={user.email}>{user.email}</div>;
      })}
    </div>
  );
};

export default observer(App);
