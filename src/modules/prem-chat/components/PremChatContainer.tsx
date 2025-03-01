import Send from "assets/images/send.svg";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import BotReply from "shared/components/BotReply";
import UserReply from "shared/components/UserReply";
import usePremChatStream from "shared/hooks/usePremChatStream";
import { useMediaQuery, useWindowSize } from "usehooks-ts";

import useAutosizeTextArea from "../../../shared/hooks/useAutosizeTextarea";
import type { Message, PremChatContainerProps } from "../types";

import Header from "./Header";
import PremChatSidebar from "./PremChatSidebar";
import RegenerateButton from "./RegenerateButton";
import RightSidebar from "./RightSidebar";

const PremChatContainer = ({
  chatId,
  serviceId,
  serviceType,
  serviceName,
}: PremChatContainerProps) => {
  const model = serviceId;
  const [rightSidebar, setRightSidebar] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);
  const chatMessageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { height } = useWindowSize();
  const responsiveMatches = useMediaQuery("(min-width: 768px)");

  const {
    chatMessages,
    onSubmit,
    question,
    setQuestion,
    isLoading,
    isError,
    onRegenerate,
    resetPromptTemplate,
    resetChatServiceUrl,
    abort,
  } = usePremChatStream(serviceId, serviceType, chatId || null);

  useAutosizeTextArea(textAreaRef.current, question);

  useEffect(() => {
    if (chatMessageListRef.current) {
      chatMessageListRef.current.scrollTop = chatMessageListRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!isLoading && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isLoading]);

  // abort chat request on unmount
  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort, chatId]);

  return (
    <section>
      <div className="md:flex md:h-screen w-full relative">
        <div
          className={clsx("prem-chat-sidebar md:relative", { "max-md:hidden": hamburgerMenuOpen })}
        >
          <PremChatSidebar setHamburgerMenu={setHamburgerMenu} />
        </div>
        <div className="flex flex-1 prem-chat-container">
          <div className="bg-lines bg-grey-900 relative h-full w-full">
            <div
              className="main-content h-full z-10 relative max-h-full overflow-hidden scrollbar-none"
              ref={chatMessageListRef}
            >
              <Header
                hamburgerMenuOpen={hamburgerMenuOpen}
                setHamburgerMenu={setHamburgerMenu}
                title={serviceName}
                setRightSidebar={setRightSidebar}
                rightSidebar={rightSidebar}
              />
              <div
                className="z-10 relative md:mt-[40px] mt-0 flex flex-col prem-chat-body scrollbar-none"
                style={{ height: height - (responsiveMatches ? 200 : 100) }}
              >
                <div className="md:w-[65%] w-[90%] mx-auto md:mt-8">
                  {chatMessages.map((message: Message, index: number) => (
                    <div key={index}>
                      {message.role === "user" ? (
                        <UserReply reply={message.content} />
                      ) : (
                        <BotReply reply={message.content} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="prem-chat-bottom border-transparent">
                <div className="md:w-[55%] sm:w-[85%] w-[88%] mx-auto max-md:mt-[14px]">
                  {chatMessages.length > 0 && !isLoading && !isError && (
                    <div>
                      <RegenerateButton onRgenerateClick={onRegenerate} />
                    </div>
                  )}
                  <form onSubmit={onSubmit}>
                    <div className="autosize-textarea-container">
                      <textarea
                        autoComplete="off"
                        className="autosize-textarea"
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={
                          isLoading
                            ? "Fetching response..."
                            : model
                            ? `Type a message or type "/" to select a prompt`
                            : "Please select a model to get started"
                        }
                        ref={textAreaRef}
                        rows={1}
                        value={question}
                        disabled={isLoading || !model}
                      />
                      <button>
                        <img src={Send} alt="Send" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {rightSidebar && (
            <RightSidebar
              setRightSidebar={setRightSidebar}
              resetPromptTemplate={resetPromptTemplate}
              resetChatServiceUrl={resetChatServiceUrl}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default PremChatContainer;
