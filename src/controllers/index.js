import { MpApiCall, orderManychatSendEbook, verify } from "../services/index.js";
export const greeting = (req, res) => {
    res.send("Hello from the server!");
};

export const generatePaymentLink = async (req, res) => {
    const { userId, email } = req.body; // userId y email se obtienen de ManyChat

    try {
        const link = await MpApiCall(userId, email);
        res.json({ link });
    } catch (error) {
        console.error("Error al crear el link de pago:", error);
        res.status(500).json({ error: "No se pudo crear el link de pago" });
    }
};

export const sendPaymentConfirmation = async (req, res) => {
    const paymentData = req.body;

    if (
        paymentData.type === "payment" &&
        paymentData.data.status === "approved"
    ) {

        try {
            const userId = paymentData.data.external_reference; // Obtiene el userId desde el `external_reference`
    
            // Lógica para enviar el ebook al usuario identificado por userId
            const confirmation = await orderManychatSendEbook(userId); // Implementa sendEbookToManyChat

            res.sendStatus(200).send(confirmation);

        } catch (error) {
            console.error("Error al enviar la confirmación de pago:", error);
            res.status(500).json({ error: "No se pudo enviar la confirmación de pago" });
        }
    }

}

export const tokenVerify = async (req, res) => {
    const { token } = req.params;

    try {
        const payload = await verify(token);
        // Envía el archivo PDF al cliente si el token es válido
        res.download(__dirname + "/public/ebooks/Dieta_Vegana.txt");
    } catch (error) {
        res.status(401).json({
            message: "Enlace de descarga expirado o no válido",
        });
    }
}
