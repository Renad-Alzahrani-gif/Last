document.getElementById("send-button").addEventListener("click", async () => {
    const publicKey = `-----BEGIN PUBLIC KEY-----
51df4ec71e72faac90dbd5d85a4ec20f5a19559e74baaacc55ea300679115bab
-----END PUBLIC KEY-----`;

    const message = document.getElementById("message").value;

    if (!message) {
        alert("Please enter a message.");
        return;
    }

    // إنشاء كائن JSEncrypt وتشفير الرسالة
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encryptedMessage = encrypt.encrypt(message);

    if (!encryptedMessage) {
        alert("Encryption failed. Please check the public key.");
        return;
    }

    console.log("Encrypted Message:", encryptedMessage);

    try {
        const result = await fetch("http://127.0.0.1:5500/DecryptController/DecryptMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ encryptedMessage: encryptedMessage })
        });

        if (!result.ok) {
            console.error("Request failed:", result.statusText);
            alert("Error: " + result.statusText);
            return;
        }

        const resultData = await result.json();
        console.log("Decrypted Message:", resultData.decryptedMessage);

        alert("Decrypted Message: " + resultData.decryptedMessage);
    } catch (error) {
        console.error("Error occurred:", error);
        alert("An error occurred. Check the console for details.");
    }
});
