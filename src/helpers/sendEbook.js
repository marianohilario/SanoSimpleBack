import "dotenv/config";
import axios from "axios";
import generarLinkDeDescarga from "./signPurchase.js";

export default async function sendEbookToManyChat(userId) {
    const url = "https://api.manychat.com/ig/sending/sendContent";
    const body = {
        subscriber_id: userId, // ID del comprador en ManyChat para Instagram
        data: {
            version: "v2",
            content: {
                messages: [
                    {
                        text: "Gracias por tu compra. Aquí tienes el enlace para descargar el ebook.",
                        buttons: [
                            {
                                title: "Descargar Ebook",
                                type: "web_url",
                                url: generarLinkDeDescarga(userId), // URL del ebook
                            },
                        ],
                    },
                ],
            },
        },
    };

    try {
        const response = await axios.post(url, body, {
            headers: {
                Authorization: "Bearer TU_TOKEN_DE_MANYCHAT", // Reemplaza con tu token de ManyChat
                "Content-Type": "application/json",
            },
        });

        return "Ebook enviado a ManyChat (Instagram):", response.data;
    } catch (error) {
        console.error(
            "Error al enviar el ebook a ManyChat (Instagram):",
            error.response ? error.response.data : error.message
        );
    }
}
