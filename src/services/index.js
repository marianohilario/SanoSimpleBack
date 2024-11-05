import "dotenv/config";
import axios from "axios";
import sendEbookToManyChat from "../helpers/sendEbook.js";
import jwt from "jsonwebtoken";

export const MpApiCall = async (userId, email) => {
    // Llama a la API de Mercado Pago para crear un link de pago personalizado
    const response = await axios.post(
        "https://api.mercadopago.com/checkout/preferences",
        {
            payer: { email: email },
            items: [
                {
                    title: "Ebook",
                    description: "Ebook de Sano & Simple",
                    picture_url:
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe2F1Gnyf72wnmYX1xjnKfwEQIl4b-p81p0w&s",
                    quantity: 1,
                    currency_id: "USD", // Cambia a la moneda deseada
                    unit_price: 100.0, // Precio del ebook
                },
            ],
            back_urls: {
                success: `${process.env.URL_BACK}/success`, // URL de redirección al éxito
                failure: `${process.env.URL_BACK}/failure`, // URL de redirección al fallo
            },
            notification_url: `${process.env.URL_BACK}/webhook`, // URL de tu webhook
            external_reference: userId, // Identificador único para rastrear al comprador
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN_MERCADOPAGO}`,
                "Content-Type": "application/json",
            },
        }
    );
    console.log("RESPONSE", response);

    const linkDePago = response.data.init_point; // Link de pago personalizado

    // Devuelve el link de pago a ManyChat
    return linkDePago;
};

export const orderManychatSendEbook = async (userId) => {
    const shippingConfirmation = await sendEbookToManyChat(userId); // Implementa sendEbookToManyChat
    return shippingConfirmation;
};

export const verify = async (token) => {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return payload;
};
