// CSS
import "../node_modules/bulmaswatch/superhero/bulmaswatch.min.css";
import "./App.scss";

// components
import CodePane from "./components/code-pane/CodePane";

const App = () => {
    return (
        <>
            <CodePane />
            <CodePane />
        </>
    );
};

export default App;
