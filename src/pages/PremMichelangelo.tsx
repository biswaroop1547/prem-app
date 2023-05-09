import { useCallback, useState } from "react";
import ModelSelectionDropdown from "../components/prem-chat/ModelSelectionDropdown";
import Header from "../components/prem-chat/Header";
import Title from "../shared/components/Title";
import usePremMichelangeloStore from "../shared/store/prem-michelangelo";
import { shallow } from "zustand/shallow";
import { useMutation } from "@tanstack/react-query";
import { generateImage } from "../shared/api";
import { ImageGeneration } from "../shared/types";
import InputBox from "../components/prem-chat/InputBox";
import Spinner from "../shared/components/Spinner";

function PremMichelangelo() {
  const [rightSidebar, setRightSidebar] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { model, setModel, n, size, response_format } =
    usePremMichelangeloStore(
      (state) => ({
        model: state.model,
        setModel: state.setModel,
        n: state.n,
        size: state.size,
        response_format: state.response_format,
      }),
      shallow
    );

  const {
    data: response,
    mutate,
    isError,
    isLoading,
  } = useMutation((data: ImageGeneration) => generateImage(data));

  const onModelChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setModel(event.target.value);
    },
    [setModel]
  );

  const onSubmit = (e: any) => {
    e.preventDefault();
    mutate({ prompt, n, size, response_format });
  };

  const images = response?.data.data || [];

  return (
    <section>
      <div className="flex h-screen w-full relative">
        <div className="flex flex-1">
          <div className="bg-lines bg-darkjunglegreen relative h-full w-full">
            <div className="main-content h-full z-10 relative max-h-full overflow-x-hidden scrollbar-none">
              <Header
                setRightSidebar={setRightSidebar}
                rightSidebar={rightSidebar}
              />
              <div className="z-10 relative mt-[40px] flex flex-col prem-chat-body">
                <Title>Prem Michaelangelo</Title>
                <div className="prem-chat p-4 pb-7 md:w-[55%] w-[85%] mx-auto">
                  <p className="text-spanishgray text-base font-proximaNova-regular mb-[6px]">
                    Model
                  </p>
                  <ModelSelectionDropdown
                    model={model}
                    onModelChange={onModelChange}
                  />
                </div>
                {isError && (
                  <div className="text-center text-red-500">Error</div>
                )}
                {isLoading && (
                  <div className="flex items-center">
                    <Spinner className="h-16 w-16" />
                  </div>
                )}
                <form className="text-center" onSubmit={onSubmit}>
                  <div className="prem-chat-input flex items-center relative">
                    <input
                      type="text"
                      name="question"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isLoading}
                      placeholder={"Prompt"}
                    />
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 14l11 -11"></path>
                        <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
                      </svg>
                    </button>
                  </div>
                </form>
                <div className="mt-5">
                  {images.map((image: any, index: number) => (
                    <img key={index} src={image.url} width={300} height={300} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </section>
  );
}

export default PremMichelangelo;
