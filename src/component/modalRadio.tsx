import { DataStream } from "@/utils/types"
import { Dialog, Transition } from "@headlessui/react"
import { FormEvent, Fragment, ReactElement, cloneElement, useState } from "react"
import { FaPlus } from "react-icons/fa"

interface ModalProps {
  isLoading?: boolean
  visible?: boolean
  onChange?: () => void
  // eslint-disable-next-line no-unused-vars
  onSave?: (obj: object, cb?: any) => void
  children?: ReactElement
  defaultValue?: DataStream
}

export const ModalFromRadio = ({ visible = false, isLoading = false, onSave, children, defaultValue }: ModalProps) => {
  let [ isOpen, setIsOpen ] = useState<boolean>(visible)

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = new FormData(event.currentTarget)
    let data = {}

    Array.from(body.entries()).forEach(([ key, value ]) => {
      data = { ...data, [key]: value }
    })
    
    onSave && onSave(data, closeModal)
  }

  return <div>
    {children && cloneElement(children, { onClick: openModal })}

    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2"
                >
                  <FaPlus className=" size-4" /> Add Radio
                </Dialog.Title>

                <form className="mt-8" onSubmit={onSubmit}>
                  <p className=" text-black mb-2">Radio name</p>
                  <input
                    className="w-full outline-none p-2 text-black border border-orange-400 rounded-md mb-4"
                    placeholder="radio name" type="text" name="title" required
                    defaultValue={defaultValue?.title}
                  />
                  <p className=" text-black mb-2">Logo url</p>
                  <input
                    className="w-full outline-none p-2 text-black border border-orange-400 rounded-md mb-4"
                    placeholder="logo url" type="text" name="logo"
                    defaultValue={defaultValue?.logo}
                  />
                  <p className=" text-black mb-2">Streaming url</p>
                  <input
                    className="w-full outline-none p-2 text-black border border-orange-400 rounded-md mb-4"
                    placeholder="url streaming radio" type="text" required name="streamUrl"
                    defaultValue={defaultValue?.streamUrl}
                  />

                  <div className="mt-4 flex gap-4 justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className=" inline-flex justify-center rounded-md border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      {isLoading? "saving...." :"save"}
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      cancel
                    </button>
                  </div>
                </form>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  </div>
}