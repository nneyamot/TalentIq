// import { StreamChat } from "stream-chat";
// import { StreamClient } from "@stream-io/node-sdk";
// import { ENV } from "./env.js";

// const apiKey = ENV.STREAM_API_KEY;
// const apiSecret = ENV.STREAM_API_SECRET;

// if (!apiKey || !apiSecret) {
//   console.error("STREAM_API_KEY or STREAM_API_SECRET is missing");
// }

// export const chatClient = StreamChat.getInstance(apiKey, apiSecret); // will be used chat features
// export const streamClient = new StreamClient(apiKey, apiSecret); // will be used for video calls

// export const upsertStreamUser = async (userData) => {
//   try {
//     await chatClient.upsertUser(userData);
//     console.log("Stream user upserted successfully:", userData);
//   } catch (error) {
//     console.error("Error upserting Stream user:", error);
//   }
// };

// export const deleteStreamUser = async (userId) => {
//   try {
//     await chatClient.deleteUser(userId);
//     console.log("Stream user deleted successfully:", userId);
//   } catch (error) {
//     console.error("Error deleting the Stream user:", error);
//   }
// };

import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);
export const streamClient = new StreamClient(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    // 1. Sync to Stream Chat
    await chatClient.upsertUser(userData);

    // 2. Sync to Stream Video (Required for video room creation!)
    await streamClient.upsertUsers([
      {
        id: userData.id,
        name: userData.name,
        image: userData.image,
        role: "user",
      },
    ]);

    console.log("Stream user upserted successfully to Chat & Video:", userData);
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    await streamClient.deleteUser(userId);
    console.log("Stream user deleted successfully from Chat & Video:", userId);
  } catch (error) {
    console.error("Error deleting the Stream user:", error);
  }
};