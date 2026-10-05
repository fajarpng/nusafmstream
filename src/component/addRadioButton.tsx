import { addRadio } from "@/action"
import { FaPlus } from "react-icons/fa"
import { useMutation, useQueryClient } from "react-query"
import { ModalFromRadio } from "./modalRadio"

export const AddRadioButton = () => {
  const queryClient = useQueryClient()
  const mutateAdd = useMutation(addRadio, { onSuccess: () => queryClient.invalidateQueries({ queryKey: [ "radio/list" ] }) })

  const onSubmit = (body: object, cb?: any) => {
    mutateAdd.mutate(body, { onSuccess: () => cb() })
  }
  return <div>
    <ModalFromRadio onSave={onSubmit} isLoading={mutateAdd.isLoading}>
      <button className="inline-flex gap-2 tracking-widest font-archivo-black hover:text-[#B8FF3C] hover:bg-black items-center justify-center rounded-md px-3 py-2 bg-[#B8FF3C] text-black border-[3px] border-black shadow-[4px_4px_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 ease-in-out">
        <FaPlus /> RADIO
      </button>
    </ModalFromRadio>
  </div>
}