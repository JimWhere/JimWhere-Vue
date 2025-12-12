import api from "@/axios";

export async function confirmPaymentApi(token, paymentKey, orderId, amount) {
    return await api.post(
        "/user/payments/success",
        { paymentKey, orderId, amount },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}