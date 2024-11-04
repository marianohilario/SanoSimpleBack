import express from "express";
import cors from "cors";
import "dotenv/config";
import axios from "axios";

const PORT = process.env.PORT | 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from the server!");
});

app.post("/crear-link-pago", async (req, res) => {
    const { userId, email } = req.body; // userId y email se obtienen de ManyChat

    try {
        // Llama a la API de Mercado Pago para crear un link de pago personalizado
        const response = await axios.post(
            "https://api.mercadopago.com/checkout/preferences",
            {
                payer: { email: email },
                items: [
                    {
                        title: "Ebook",
                        quantity: 1,
                        currency_id: "ARS", // Cambia a la moneda deseada
                        unit_price: 10000.0, // Precio del ebook
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

        console.log("Link de pago:", linkDePago);

        // Devuelve el link de pago a ManyChat
        res.json({ linkDePago });
    } catch (error) {
        console.error("Error al crear el link de pago:", error);
        res.status(500).json({ error: "No se pudo crear el link de pago" });
    }
});

app.post('/webhook', async (req, res) => {
    const paymentData = req.body;

    if (paymentData.type === 'payment' && paymentData.data.status === 'approved') {
        const userId = paymentData.data.external_reference; // Obtiene el userId desde el `external_reference`

        // Lógica para enviar el ebook al usuario identificado por userId
        await sendEbookToManyChat(userId); // Implementa sendEbookToManyChat
    }

    res.sendStatus(200);
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
