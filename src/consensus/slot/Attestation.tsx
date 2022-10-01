import { FC } from "react";
import { commify } from "@ethersproject/units";
import { useInView } from "react-intersection-observer";
import InfoRow from "../../components/InfoRow";
import HexValue from "../../components/HexValue";
import AggregationBits from "./AggregationBits";
import ValidatorList from "./ValidatorList";

type AttestationProps = {
  idx: number;
  att: any;
};

const Attestation: FC<AttestationProps> = ({ idx, att }) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <div className="flex space-x-10 py-5" ref={ref}>
      <div>
        <span className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-50 text-emerald-500">
          {idx}
        </span>
      </div>
      <div className="divide-y px-3 bg-white w-full">
        <InfoRow title="Slot">{commify(att.data.slot.toString())}</InfoRow>
        <InfoRow title="Committee Index">
          {commify(att.data.index.toString())}
        </InfoRow>
        {inView && (
          <>
            <InfoRow title="Aggregation Bits">
              <AggregationBits hex={att.aggregation_bits} />
            </InfoRow>
            <InfoRow title="Validators">
              <ValidatorList
                slotNumber={att.data.slot}
                committeeIndex={att.data.index}
              />
            </InfoRow>
          </>
        )}
        <InfoRow title="Beacon Block Root">
          <HexValue value={att.data.beacon_block_root} />
        </InfoRow>
        <InfoRow title="Source">
          {commify(att.data.source.epoch.toString())} /{" "}
          <HexValue value={att.data.source.root} />
        </InfoRow>
        <InfoRow title="Target">
          {commify(att.data.target.epoch.toString())} /{" "}
          <HexValue value={att.data.target.root} />
        </InfoRow>
        <InfoRow title="Signature">
          <HexValue value={att.signature} />
        </InfoRow>
      </div>
    </div>
  );
};

export default Attestation;
