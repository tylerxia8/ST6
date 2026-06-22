import { Provider } from "react-redux";
import { App } from "../App";
import { store } from "../store";

export function WeeklyCommitmentsRemote() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default WeeklyCommitmentsRemote;
