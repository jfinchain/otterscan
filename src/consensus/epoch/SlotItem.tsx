import { commify } from "@ethersproject/units";
import SlotLink from "../components/SlotLink";
import TimestampAge from "../../components/TimestampAge";
import ValidatorLink from "../components/ValidatorLink";
import HexValue from "../../components/HexValue";
import AggregationParticipation from "../slot/AggregationParticipation";
import { useBlockRoot, useSlot, useSlotTimestamp } from "../../useConsensus";

type SlotItemProps = {
  slotNumber: number;
};

const SlotItem: React.FC<SlotItemProps> = ({ slotNumber }) => {
  const slot = useSlot(slotNumber);
  const blockRoot = useBlockRoot(slotNumber);
  const slotTimestamp = useSlotTimestamp(slotNumber);

  return (
    <div className="grid grid-cols-12 gap-x-1 items-baseline text-sm border-t border-gray-200 hover:bg-skin-table-hover px-2 py-3">
      {slot && (
        <>
          <SlotLink slotNumber={slotNumber} />
          <div></div>
          <div>
            {slotTimestamp && (
              <TimestampAge timestamp={slotTimestamp.toNumber()} />
            )}
          </div>
          <ValidatorLink validatorIndex={slot.data.message.proposer_index} />
          <div className="truncate">
            <HexValue value={blockRoot.data.root} />
          </div>
          <div>
            {commify(slot.data.message.body.attestations.length.toString())}
          </div>
          <div className="col-span-2">
            <AggregationParticipation
              hex={slot.data.message.body.sync_aggregate.sync_committee_bits}
            />
          </div>
          <div>
            {commify(slot.data.message.body.deposits.length.toString())}
          </div>
          <div></div>
          <div>
            {commify(slot.data.message.body.voluntary_exits.length.toString())}
          </div>
        </>
      )}
    </div>
  );
};

export default SlotItem;
