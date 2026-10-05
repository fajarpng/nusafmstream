import { DataStream } from "@/utils/types"
import { create } from "zustand"

type DataPlayer = {
  dataRadio?: DataStream | null;
  dataList: DataStream[];
  // eslint-disable-next-line no-unused-vars
  onChangeRadio: (data: DataStream) => void; // Updated to take a parameter
  // eslint-disable-next-line no-unused-vars
  setDataList: (data: DataStream[]) => void;
};

export const useDataPlayer = create<DataPlayer>()((set) => {
  return {
    dataRadio: null,
    dataList: [],
    onChangeRadio: (data) => set(() => ({ dataRadio: data })),
    setDataList: (data) => set(() => ({ dataList: data })),
  }
})
