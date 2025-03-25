const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

if (!token || !userId) {
  alert("You must be logged in to access the chat.");
  window.location.href = "login.html";
}

// ✅ Initialize SignalR Connection
const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://moonlitretreats-hbfnfdfabcfpb3d7.canadacentral-01.azurewebsites.net/api/chatHub", {
    accessTokenFactory: () => token, // ✅ Send token for authentication
  })
  .withAutomaticReconnect()
  .build();

connection
  .start()
  .then(() => {
    console.log("✅ Connected to SignalR ChatHub");
    loadChatHistory();
  })
  .catch((err) => console.error(" Connection failed:", err));

document.addEventListener("DOMContentLoaded", async function () {
  const sendButton = document.getElementById("sendMessage");
  const messageInput = document.getElementById("message");
  const discussionList = document.getElementById("discussion");

  if (!sendButton || !messageInput || !discussionList) {
    console.error("❌ One or more required elements are missing.");
    return;
  }

  // ✅ Fetch the user's profile to get their name
  let userName = "User";
  try {
    const userResponse = await fetch(
      `https://moonlitretreats-hbfnfdfabcfpb3d7.canadacentral-01.azurewebsites.net/api/UserProfile/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (userResponse.ok) {
      const userData = await userResponse.json();
      userName = userData.userName || "User";
    }
  } catch (error) {
    console.warn("⚠️ Failed to fetch user profile:", error);
  }

  sendButton.addEventListener("click", async function () {
    const text = messageInput.value.trim();
    if (!text) {
      console.warn("⚠️ Message cannot be empty.");
      return;
    }

    const messageData = {
      user: userName,
      text,
      userId,
      receiverId: "hotel_staff",
    }; // ✅ Send message to hotel staff

    try {
      console.log("📤 Sending message:", JSON.stringify(messageData));

      const response = await fetch("https://moonlitretreats-hbfnfdfabcfpb3d7.canadacentral-01.azurewebsites.net/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error sending message:", errorText);
      } else {
        messageInput.value = ""; // ✅ Clear input after sending
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  });

  connection.on("ReceiveMessage", function (user, message) {
    addMessageToList(user, message);
  });

  function addMessageToList(user, message) {
    const li = document.createElement("li");
    li.textContent = `${user}: ${message}`;
    discussionList.appendChild(li);
  }

  async function loadChatHistory() {
    try {
      const response = await fetch("https://moonlitretreats-hbfnfdfabcfpb3d7.canadacentral-01.azurewebsites.net/api/chat/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch messages");

      const messages = await response.json();
      messages.forEach((msg) => addMessageToList(msg.user, msg.text));
    } catch (error) {
      console.error("❌ Error loading chat history:", error);
    }
  }
});

// // const connection = new signalR.HubConnectionBuilder()
// //   .withUrl("https://localhost:7261/chatHub")
// //   .withAutomaticReconnect()
// //   .build();

// // connection
// //   .start()
// //   .then(() => {
// //     console.log("✅ Connected to SignalR ChatHub");
// //     loadChatHistory(); // ✅ Load chat history from the database
// //   })
// //   .catch((err) => console.error("❌ Connection failed:", err));

// // document.addEventListener("DOMContentLoaded", function () {
// //   const sendButton = document.getElementById("sendMessage");
// //   const displayNameInput = document.getElementById("displayName");
// //   const messageInput = document.getElementById("message");
// //   const discussionList = document.getElementById("discussion");

// //   if (!sendButton || !displayNameInput || !messageInput || !discussionList) {
// //     console.error("❌ One or more required elements are missing.");
// //     return;
// //   }

// //   sendButton.addEventListener("click", async function () {
// //     const user = displayNameInput.value.trim();
// //     const text = messageInput.value.trim(); // ✅ Ensure `text` matches C# model
// //     const userId = "123"; // Replace with actual logged-in user ID
// //     const receiverId = "456"; // Replace with the intended receiver's ID

// //     if (!user || !text || !userId || !receiverId) {
// //       console.warn("⚠️ User or message cannot be empty.");
// //       return;
// //     }

// //     try {
// //       const messageData = { user, text, userId, receiverId }; // ✅ Corrected object
// //       console.log("📤 Sending message:", JSON.stringify(messageData));

// //       const response = await fetch("https://localhost:7261/api/chat/send", {
// //         // ✅ Route case sensitivity fixed
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(messageData),
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error("❌ Error sending message via API:", errorText);
// //       }
// //     } catch (error) {
// //       console.error("❌ Error sending message:", error);
// //     }
// //   });

// //   connection.on("ReceiveMessage", function (user, message) {
// //     addMessageToList(user, message);
// //   });

// //   function addMessageToList(user, message) {
// //     const li = document.createElement("li");
// //     li.textContent = `${user}: ${message}`;
// //     discussionList.appendChild(li);
// //   }

// //   async function loadChatHistory() {
// //     try {
// //       const response = await fetch("https://localhost:7261/api/chat/messages"); // ✅ Route case sensitivity fixed
// //       if (!response.ok) throw new Error("Failed to fetch messages");

// //       const messages = await response.json();
// //       messages.forEach((msg) => addMessageToList(msg.user, msg.text));
// //     } catch (error) {
// //       console.error("❌ Error loading chat history:", error);
// //     }
// //   }
// // });
