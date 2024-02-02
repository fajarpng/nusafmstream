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
      <button className=" bg-orange-500 hover:bg-orange-400 text-sm px-4 py-3 rounded-lg font-bold flex items-center gap-2">
        <FaPlus /> Radio
      </button>
    </ModalFromRadio>
  </div>
}