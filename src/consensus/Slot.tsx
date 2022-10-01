import { FC, Suspense } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import { Tab } from "@headlessui/react";
import StandardFrame from "../StandardFrame";
import StandardSubtitle from "../StandardSubtitle";
import NavTab from "../components/NavTab";
import Overview from "./slot/Overview";
import Attestations from "./slot/Attestations";
import { useSlot } from "../useConsensus";
import { SelectionContext, useSelection } from "../useSelection";

const Slot: FC = () => {
  const { slotNumber } = useParams();
  if (slotNumber === undefined) {
    throw new Error("slotNumber couldn't be undefined here");
  }
  const slot = useSlot(parseInt(slotNumber));
  const selectionCtx = useSelection();

  return (
    <StandardFrame>
      <StandardSubtitle>
        <div className="flex space-x-1 items-baseline">
          <span>Slot</span>
          <span className="text-base text-gray-500">#{slotNumber}</span>
        </div>
      </StandardSubtitle>
      {slot && (
        <SelectionContext.Provider value={selectionCtx}>
          <Tab.Group>
            <Tab.List className="flex space-x-2 border-l border-r border-t rounded-t-lg bg-white">
              <NavTab href=".">Overview</NavTab>
              {slot.data.message.body.attestations !== undefined && (
                <NavTab href="attestations">
                  Attestations
                  {` (${slot.data.message.body.attestations.length ?? 0})`}
                </NavTab>
              )}
            </Tab.List>
          </Tab.Group>
          <Suspense fallback={null}>
            <Routes>
              <Route index element={<Overview />} />
              <Route path="attestations" element={<Attestations />} />
            </Routes>
          </Suspense>
        </SelectionContext.Provider>
      )}
    </StandardFrame>
  );
};

export default Slot;
