import { useContext, useMemo } from "react";
import useSWRImmutable from "swr/immutable";
import { BigNumber } from "@ethersproject/bignumber";
import { RuntimeContext } from "./useRuntime";

// TODO: get these from config
export const SLOTS_PER_EPOCH = 32;
export const SECONDS_PER_SLOT = 12;

// TODO: remove duplication with other json fetchers
const jsonFetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    }
    return null;
  } catch (err) {
    console.warn(`error while getting beacon data: url=${url} err=${err}`);
    return null;
  }
};

export const useGenesis = () => {
  const { config } = useContext(RuntimeContext);
  const url = config?.beaconAPI
    ? `${config?.beaconAPI}/eth/v1/beacon/genesis`
    : null;
  const { data, error } = useSWRImmutable(url, jsonFetcher);
  if (error) {
    return undefined;
  }
  return data;
};

export const useSlot = (slotNumber: number) => {
  const { config } = useContext(RuntimeContext);
  const url = config?.beaconAPI
    ? `${config?.beaconAPI}/eth/v2/beacon/blocks/${slotNumber}`
    : null;
  const { data, error } = useSWRImmutable(url, jsonFetcher);
  if (error) {
    return undefined;
  }
  return data;
};

export const useBlockRoot = (slotNumber: number) => {
  const { config } = useContext(RuntimeContext);
  const url = config?.beaconAPI
    ? `${config?.beaconAPI}/eth/v1/beacon/blocks/${slotNumber}/root`
    : null;
  const { data, error } = useSWRImmutable(url, jsonFetcher);
  if (error) {
    return undefined;
  }
  return data;
};

export const useValidator = (validatorIndex: number) => {
  const { config } = useContext(RuntimeContext);
  const url = config?.beaconAPI
    ? `${config?.beaconAPI}/eth/v1/beacon/states/head/validators/${validatorIndex}`
    : null;
  const { data, error } = useSWRImmutable(url, jsonFetcher);
  if (error) {
    return undefined;
  }
  return data;
};

export const useEpochTimestamp = (epoch: any) => {
  const genesis = useGenesis();

  const calcTS = useMemo(() => {
    if (!genesis || !epoch) {
      return undefined;
    }

    const genesisTS = BigNumber.from(genesis.data.genesis_time);
    const epochTS = BigNumber.from(epoch);
    return genesisTS.add(epochTS.mul(SLOTS_PER_EPOCH * SECONDS_PER_SLOT));
  }, [genesis, epoch]);

  return calcTS;
};

export const useSlotTimestamp = (slot: any) => {
  const genesis = useGenesis();

  const calcTS = useMemo(() => {
    if (!genesis || !slot) {
      return undefined;
    }

    const genesisTS = BigNumber.from(genesis.data.genesis_time);
    const slotTS = BigNumber.from(slot);
    return genesisTS.add(slotTS.mul(SECONDS_PER_SLOT));
  }, [genesis, slot]);

  return calcTS;
};

export const useCommittee = (slotNumber: number, committeeIndex: number) => {
  const epochNumber = Math.trunc(slotNumber / SLOTS_PER_EPOCH);
  const { config } = useContext(RuntimeContext);
  const url = config?.beaconAPI
    ? `${config?.beaconAPI}/eth/v1/beacon/states/head/committees?epoch=${epochNumber}&slot=${slotNumber}&index=${committeeIndex}`
    : null;
  const { data, error } = useSWRImmutable(url, jsonFetcher);
  if (error) {
    return undefined;
  }
  return data;
};
