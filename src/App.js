import PageRouter from "./components/PageRouter.js";
import React from "react";
import WebsocketContainer from "./components/WebsocketContainer.js";

export default function App() {

  return (
    <WebsocketContainer>
      <PageRouter></PageRouter>
    </WebsocketContainer>
  );
}

