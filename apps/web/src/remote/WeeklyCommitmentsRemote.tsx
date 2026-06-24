import { Provider } from "react-redux";
import { App } from "../App";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { store } from "../store";

export function WeeklyCommitmentsRemote() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  );
}

export default WeeklyCommitmentsRemote;
