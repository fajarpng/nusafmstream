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
      <button className="inline-flex gap-2 tracking-widest font-semibold hover:text-white hover:bg-orange-500 items-center justify-center rounded-md p-2 bg-white border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 ease-in-out">
        <FaPlus /> RADIO
      </button>
    </ModalFromRadio>
  </div>
}