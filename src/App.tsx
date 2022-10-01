import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WarningHeader from "./WarningHeader";
import Home from "./Home";
import Main from "./Main";
import ConnectionErrorPanel from "./ConnectionErrorPanel";
import Footer from "./Footer";
import { ConnectionStatus } from "./types";
import { RuntimeContext, useRuntime } from "./useRuntime";
import { ChainInfoContext, useChainInfoFromMetadataFile } from "./useChainInfo";

const Block = React.lazy(() => import("./Block"));
const BlockTransactions = React.lazy(() => import("./BlockTransactions"));
const Address = React.lazy(() => import("./Address"));
const Transaction = React.lazy(() => import("./Transaction"));
const Epoch = React.lazy(() => import("./consensus/Epoch"));
const Slot = React.lazy(() => import("./consensus/Slot"));
const Validator = React.lazy(() => import("./consensus/Validator"));
const London = React.lazy(() => import("./special/london/London"));
const Faucets = React.lazy(() => import("./Faucets"));
const PageNotFound = React.lazy(() => import("./PageNotFound"));

const App = () => {
  const runtime = useRuntime();
  const chainInfo = useChainInfoFromMetadataFile(runtime);

  return (
    <Suspense fallback={null}>
      {runtime.connStatus !== ConnectionStatus.CONNECTED ||
      chainInfo === undefined ? (
        <ConnectionErrorPanel
          connStatus={runtime.connStatus}
          config={runtime.config}
        />
      ) : (
        <RuntimeContext.Provider value={runtime}>
          <ChainInfoContext.Provider value={chainInfo}>
            <div className="h-screen flex flex-col">
              <WarningHeader />
              <Router>
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="/special/london" element={<London />} />
                  <Route path="*" element={<Main />}>
                    <Route
                      path="block/:blockNumberOrHash"
                      element={<Block />}
                    />
                    <Route
                      path="block/:blockNumber/txs"
                      element={<BlockTransactions />}
                    />
                    <Route path="tx/:txhash/*" element={<Transaction />} />
                    <Route
                      path="address/:addressOrName/*"
                      element={<Address />}
                    />
                    <Route path="epoch/:epochNumber/*" element={<Epoch />} />
                    <Route path="slot/:slotNumber/*" element={<Slot />} />
                    <Route
                      path="validator/:validatorIndex/*"
                      element={<Validator />}
                    />
                    <Route path="faucets/*" element={<Faucets />} />
                    <Route path="*" element={<PageNotFound />} />
                  </Route>
                </Routes>
              </Router>
              <Footer />
            </div>
          </ChainInfoContext.Provider>
        </RuntimeContext.Provider>
      )}
    </Suspense>
  );
};

export default App;
