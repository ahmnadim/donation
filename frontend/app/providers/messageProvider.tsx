"use client";

import React, { createContext, useContext } from "react";
import { message } from "antd";

type MessageContextType = {
  success: (content: string, duration?: number) => void;
  error: (content: string, duration?: number) => void;
  info: (content: string, duration?: number) => void;
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const success = (content: string, duration = 3) => {
    messageApi.success(content, duration);
  };

  const error = (content: string, duration = 3) => {
    messageApi.error(content, duration);
  };

  const info = (content: string, duration = 3) => {
    messageApi.info(content, duration);
  };

  return (
    <MessageContext.Provider value={{ success, error, info }}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
