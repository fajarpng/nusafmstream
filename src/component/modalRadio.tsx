import { DataStream } from "@/utils/types"
import { Dialog, Transition } from "@headlessui/react"
import { FormEvent, Fragment, ReactElement, cloneElement, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { FaX } from "react-icons/fa6"
import { MdEdit } from "react-icons/md"

const INPUT_CLASS = "w-full outline-none p-3 text-black font-medium bg-white border-[3px] border-black rounded-md mb-5 shadow-[3px_3px_0_#000] focus:shadow-[3px_3px_0_#FF3E9D] transition-shadow"
const LABEL_CLASS = "self-start text-black font-archivo-black uppercase text-xs tracking-widest mb-2"

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

  const isEdit = !!defaultValue
  const accent = isEdit ? "#4DD8FF" : "#B8FF3C"

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

  return <div className="h-full">
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
          <div className="fixed inset-0 bg-black/60" />
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
              <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-[#FFD84D] border-4 border-black p-6 md:p-8 text-left align-middle shadow-[10px_10px_0_#000] transition-all">
                <button
                  type="button" aria-label="Close"
                  disabled={isLoading}
                  onClick={closeModal}
                  className="absolute top-4 right-4 grid place-items-center size-9 bg-[#FF3E9D] border-[3px] border-black rounded-md shadow-[3px_3px_0_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all duration-200 ease-in-out disabled:opacity-50"
                >
                  <FaX className="size-3.5 text-black" />
                </button>
                <Dialog.Title
                  as="h3"
                  className="text-lg md:text-xl font-archivo-black uppercase tracking-widest leading-6 text-black flex items-center gap-2 border-[3px] border-black rounded-md px-4 py-2 w-fit -rotate-2 shadow-[4px_4px_0_#000]"
                  style={{ backgroundColor: accent }}
                >
                  {isEdit
                    ? <span className="flex items-center gap-2"><MdEdit className=" size-4" /> Edit Radio</span>
                    : <span className="flex items-center gap-2"><FaPlus className=" size-4" /> Add Radio</span>
                  }
                </Dialog.Title>

                <form className="mt-8 flex flex-col" onSubmit={onSubmit}>
                  <label className={LABEL_CLASS}>Radio name</label>
                  <input
                    className={INPUT_CLASS}
                    placeholder="radio name" type="text" name="title" required
                    defaultValue={defaultValue?.title}
                  />
                  <label className={LABEL_CLASS}>Logo url</label>
                  <input
                    className={INPUT_CLASS}
                    placeholder="logo url" type="text" name="logo"
                    defaultValue={defaultValue?.logo}
                  />
                  <label className={LABEL_CLASS}>Streaming url</label>
                  <input
                    className={INPUT_CLASS}
                    placeholder="url streaming radio" type="text" required name="streamUrl"
                    defaultValue={defaultValue?.streamUrl}
                  />

                  <div className="mt-3 flex gap-4 justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex justify-center rounded-md border-[3px] border-black bg-[#FF3E9D] hover:bg-black hover:text-[#B8FF3C] px-5 py-2 text-sm font-archivo-black uppercase tracking-widest text-black shadow-[4px_4px_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 ease-in-out disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isLoading? "saving...." :"save"}
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      className="inline-flex justify-center rounded-md border-[3px] border-black bg-white px-5 py-2 text-sm font-archivo-black uppercase tracking-widest text-black shadow-[4px_4px_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 ease-in-out disabled:opacity-50 disabled:pointer-events-none"
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