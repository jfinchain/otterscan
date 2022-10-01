import { FC, Suspense, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import StandardFrame from "../StandardFrame";
import StandardSubtitle from "../StandardSubtitle";
import ContentFrame from "../ContentFrame";
import InfoRow from "../components/InfoRow";
import Timestamp from "../components/Timestamp";
import SlotItem from "./epoch/SlotItem";
import { SelectionContext, useSelection } from "../useSelection";
import { SLOTS_PER_EPOCH, useEpochTimestamp, useSlot } from "../useConsensus";

const Epoch: FC = () => {
  const { epochNumber } = useParams();
  if (epochNumber === undefined) {
    throw new Error("epochNumber couldn't be undefined here");
  }
  const epoch = useSlot(parseInt(epochNumber));
  useEffect(() => {
    if (epoch !== undefined) {
      document.title = `Epoch #${epochNumber} | Otterscan`;
    }
  }, [epochNumber, epoch]);
  const epochTimestamp = useEpochTimestamp(epochNumber);

  const selectionCtx = useSelection();
  const slots = useMemo(() => {
    const s: number[] = [];
    const epochAsNumber = parseInt(epochNumber);
    const startSlot = epochAsNumber * SLOTS_PER_EPOCH;
    const endSlot = (epochAsNumber + 1) * SLOTS_PER_EPOCH;
    for (let i = startSlot; i < endSlot; i++) {
      s.push(i);
    }
    return s.reverse();
  }, [epochNumber]);

  return (
    <StandardFrame>
      <StandardSubtitle>
        <div className="flex space-x-1 items-baseline">
          <span>Epoch</span>
          <span className="text-base text-gray-500">#{epochNumber}</span>
        </div>
      </StandardSubtitle>
      {!epoch && (
        <SelectionContext.Provider value={selectionCtx}>
          <Suspense fallback={null}>
            <ContentFrame>
              <InfoRow title="Finalized"></InfoRow>
              <InfoRow title="Timestamp">
                {epochTimestamp && (
                  <Timestamp value={epochTimestamp.toNumber()} />
                )}
              </InfoRow>
              <InfoRow title="Attestations"></InfoRow>
              <InfoRow title="Deposits"></InfoRow>
              <InfoRow title="Slashings P/A"></InfoRow>
              <InfoRow title="Voting Participation"></InfoRow>
              <InfoRow title="Sync Participation"></InfoRow>
              <InfoRow title="Validators"></InfoRow>
              <div className="grid grid-cols-12 gap-x-1 bg-gray-100 border-t border-b border-gray-200 px-2 py-2 font-bold text-gray-500 text-sm">
                <div>Slot</div>
                <div>Status</div>
                <div>Age</div>
                <div>Proposer</div>
                <div>Root Hash</div>
                <div>Attestations</div>
                <div className="col-span-2">Sync Participation</div>
                <div>Deposits</div>
                <div>Slashings P/A</div>
                <div>Exits</div>
                <div></div>
                <div></div>
              </div>
              {slots.map((s) => (
                <SlotItem key={s} slotNumber={s} />
              ))}
            </ContentFrame>
          </Suspense>
        </SelectionContext.Provider>
      )}
    </StandardFrame>
  );
};

export default Epoch;
