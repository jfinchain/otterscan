import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import { commify } from "@ethersproject/units";
import { ChartData, ChartOptions } from "chart.js";
import { ExtendedBlock } from "../../useErigonHooks";

export enum ChartMode {
  CUMULATIVE_ISSUANCE,
  GAS_USAGE,
  BURNT_FEES,
}

export type CumulativeIssuanceChartBlock = {
  totalIssued: BigNumber;
  totalBurnt: BigNumber;
} & Pick<ExtendedBlock, "number">;

export type GasChartBlock = Pick<
  ExtendedBlock,
  "number" | "gasUsed" | "gasLimit" | "baseFeePerGas"
>;

export type BurntFeesChartBlock = Pick<
  ExtendedBlock,
  "number" | "gasUsed" | "baseFeePerGas"
>;

export type ChartBlock = CumulativeIssuanceChartBlock &
  GasChartBlock &
  BurntFeesChartBlock &
  Pick<
    ExtendedBlock,
    "timestamp" | "hash" | "blockReward" | "uncleReward" | "feeReward"
  >;

export const cumulativeIssuanceChartOptions: ChartOptions = {
  animation: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        callback: function (v) {
          // @ts-ignore
          return this.getLabelForValue(v);
        },
      },
    },
    y: {
      title: {
        display: true,
        text: "ETH in circulation",
      },
      ticks: {
        callback: (v) => `${commify(v)} ETH`,
      },
    },
    yBurntTotal: {
      position: "right",
      title: {
        display: true,
        text: "Total burnt ETH",
      },
      ticks: {
        callback: (v) => `${commify(v)} ETH`,
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

export const cumulativeIssuanceChartData = (
  blocks: CumulativeIssuanceChartBlock[]
): ChartData => ({
  labels: blocks.map((b) => commify(b.number)).reverse(),
  datasets: [
    {
      label: "ETH in circulation",
      data: blocks
        .map((b) =>
          FixedNumber.fromValue(b.totalIssued.sub(b.totalBurnt), 18)
            .round(2)
            .toUnsafeFloat()
        )
        .reverse(),
      fill: true,
      segment: {
        backgroundColor: (ctx, x) =>
          ctx.p1.parsed.y > ctx.p0.parsed.y ? "#D9F99D70" : "#9CA3AF70",
        borderColor: (ctx) =>
          ctx.p1.parsed.y > ctx.p0.parsed.y ? "#84CC16" : "#4B5563",
      },
      tension: 0.2,
    },
    {
      label: "Total burnt ETH",
      data: blocks
        .map((b) =>
          FixedNumber.fromValue(b.totalBurnt, 18).round(2).toUnsafeFloat()
        )
        .reverse(),
      yAxisID: "yBurntTotal",
      borderColor: "#FB923C",
      tension: 0.2,
      pointStyle: "crossRot",
      radius: 7,
    },
  ],
});

export const burntFeesChartOptions: ChartOptions = {
  animation: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        callback: function (v) {
          // @ts-ignore
          return this.getLabelForValue(v);
        },
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Burnt fees",
      },
      ticks: {
        callback: (v) => `${(v as number) / 1e9} ETH`,
      },
    },
    yBaseFee: {
      position: "right",
      beginAtZero: true,
      title: {
        display: true,
        text: "Base fee",
      },
      ticks: {
        callback: (v) => `${(v as number) / 1e9} Gwei`,
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

export const burntFeesChartData = (
  blocks: BurntFeesChartBlock[]
): ChartData => ({
  labels: blocks.map((b) => commify(b.number)).reverse(),
  datasets: [
    {
      label: "Burnt fees (Gwei)",
      data: blocks
        .map((b) =>
          b.gasUsed
            .mul(b.baseFeePerGas ?? 0)
            .div(1e9)
            .toNumber()
        )
        .reverse(),
      fill: true,
      backgroundColor: "#FDBA7470",
      borderColor: "#FB923C",
      tension: 0.2,
      pointStyle: "crossRot",
      radius: 7,
    },
    {
      label: "Base fee (wei)",
      data: blocks.map((b) => b.baseFeePerGas?.toNumber() ?? 0).reverse(),
      yAxisID: "yBaseFee",
      borderColor: "#38BDF8",
      tension: 0.2,
    },
  ],
});

export const gasChartOptions: ChartOptions = {
  animation: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        callback: function (v) {
          // @ts-ignore
          return this.getLabelForValue(v);
        },
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Gas",
      },
    },
    yBaseFee: {
      position: "right",
      beginAtZero: true,
      title: {
        display: true,
        text: "Base fee",
      },
      ticks: {
        callback: (v) => `${(v as number) / 1e9} Gwei`,
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

export const gasChartData = (blocks: GasChartBlock[]): ChartData => ({
  labels: blocks.map((b) => commify(b.number)).reverse(),
  datasets: [
    {
      label: "Gas used",
      data: blocks.map((b) => b.gasUsed.toNumber()).reverse(),
      fill: true,
      segment: {
        backgroundColor: (ctx, x) =>
          ctx.p1.parsed.y >
          Math.round(blocks[ctx.p1DataIndex].gasLimit.toNumber() / 2)
            ? "#22C55E70"
            : "#EF444470",
        borderColor: (ctx) =>
          ctx.p1.parsed.y >
          Math.round(blocks[ctx.p1DataIndex].gasLimit.toNumber() / 2)
            ? "#22C55E"
            : "#EF4444",
      },
      tension: 0.2,
    },
    {
      label: "Gas target",
      data: blocks.map((b) => Math.round(b.gasLimit.toNumber() / 2)).reverse(),
      borderColor: "#FCA5A5",
      borderDash: [5, 5],
      borderWidth: 2,
      tension: 0.2,
      pointStyle: "dash",
    },
    {
      label: "Gas limit",
      data: blocks.map((b) => b.gasLimit.toNumber()).reverse(),
      borderColor: "#B91C1CF0",
      tension: 0.2,
      pointStyle: "crossRot",
      radius: 5,
    },
    {
      label: "Base fee (wei)",
      data: blocks.map((b) => b.baseFeePerGas?.toNumber() ?? 0).reverse(),
      yAxisID: "yBaseFee",
      borderColor: "#38BDF8",
      tension: 0.2,
    },
  ],
});
