// import { Inngest } from "inngest";
// import { connectDB } from "./db.js";
// import User from "../models/User.js";
// import { deleteStreamUser, upsertStreamUser } from "./stream.js";

// export const inngest = new Inngest({ id: "talent-iq" });

// const syncUser = inngest.createFunction(
//   { id: "sync-user" },
//   { event: "clerk/user.created" },
//   async ({ event }) => {
//     await connectDB();

//     const { id, email_addresses, first_name, last_name, image_url } = event.data;

//     const newUser = {
//       clerkId: id,
//       email: email_addresses[0]?.email_address,
//       name: `${first_name || ""} ${last_name || ""}`,
//       profileImage: image_url,
//     };

//     await User.create(newUser);

//     await upsertStreamUser({
//       id: newUser.clerkId.toString(),
//       name: newUser.name,
//       image: newUser.profileImage,
//     });
//   }
// );

// const deleteUserFromDB = inngest.createFunction(
//   { id: "delete-user-from-db" },
//   { event: "clerk/user.deleted" },
//   async ({ event }) => {
//     await connectDB();

//     const { id } = event.data;
//     await User.deleteOne({ clerkId: id });

//     await deleteStreamUser(id.toString());
//   }
// );

// export const functions = [syncUser, deleteUserFromDB];


// import { Inngest } from "inngest";
// import { connectDB } from "./db.js";
// import User from "../models/User.js";
// import { deleteStreamUser, upsertStreamUser } from "./stream.js";

// export const inngest = new Inngest({ id: "talent-iq" });

// const syncUser = inngest.createFunction(
//   { 
//     id: "sync-user",
//     triggers: [{ event: "clerk/user.created" }]
//   },
//   async ({ event }) => {
//     await connectDB();

//     const { id, email_addresses, first_name, last_name, image_url } = event.data;

//     const newUser = {
//       clerkId: id,
//       email: email_addresses[0]?.email_address,
//       name: `${first_name || ""} ${last_name || ""}`,
//       profileImage: image_url,
//     };

//     await User.create(newUser);

//     await upsertStreamUser({
//       id: newUser.clerkId.toString(),
//       name: newUser.name,
//       image: newUser.profileImage,
//     });
//   }
// );

// const deleteUserFromDB = inngest.createFunction(
//   { 
//     id: "delete-user-from-db",
//     triggers: [{ event: "clerk/user.deleted" }]
//   },
//   async ({ event }) => {
//     await connectDB();

//     const { id } = event.data;
//     await User.deleteOne({ clerkId: id });

//     await deleteStreamUser(id.toString());
//   }
// );

// export const functions = [syncUser, deleteUserFromDB];

import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "talent-iq" });

const syncUser = inngest.createFunction(
  { 
    id: "sync-user",
    triggers: [{ event: "clerk/user.created" }]
  },
  async ({ event }) => {
    try {
      console.log("1. Inngest syncUser triggered");
      await connectDB();
      console.log("2. Connected to MongoDB");

      // Safely extract user object whether event.data is an array or object
      const rawData = Array.isArray(event.data) ? event.data[0] : event.data;
      const userData = rawData?.data || rawData;

      const { id, email_addresses, first_name, last_name, image_url } = userData;

      const newUser = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        profileImage: image_url,
      };

      console.log("3. Creating user in MongoDB:", newUser);
      const createdUser = await User.create(newUser);
      console.log("4. User created successfully in MongoDB:", createdUser._id);

      await upsertStreamUser({
        id: newUser.clerkId.toString(),
        name: newUser.name,
        image: newUser.profileImage,
      });
      console.log("5. Stream user updated");

    } catch (error) {
      console.error("❌ ERROR IN SYNC_USER:", error.message);
    }
  }
);

const deleteUserFromDB = inngest.createFunction(
  { 
    id: "delete-user-from-db",
    triggers: [{ event: "clerk/user.deleted" }]
  },
  async ({ event }) => {
    try {
      await connectDB();
      const rawData = Array.isArray(event.data) ? event.data[0] : event.data;
      const { id } = rawData?.data || rawData;

      await User.deleteOne({ clerkId: id });
      await deleteStreamUser(id.toString());
    } catch (error) {
      console.error("❌ ERROR IN DELETE_USER:", error.message);
    }
  }
);

export const functions = [syncUser, deleteUserFromDB];