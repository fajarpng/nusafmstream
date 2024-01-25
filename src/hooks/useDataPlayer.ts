import { DataStream } from "@/utils/types"
import { create } from "zustand"

type DataPlayer = {
  dataRadio?: DataStream | null;
  // eslint-disable-next-line no-unused-vars
  onChangeRadio: (data: DataStream) => void; // Updated to take a parameter
};

export const useDataPlayer = create<DataPlayer>()((set) => {
  return {
    dataRadio: null,
    onChangeRadio: (data) => set(() => ({ dataRadio: data })),
  }
})
