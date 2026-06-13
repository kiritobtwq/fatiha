import { config } from '@/config';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export async function createPayment({
  amount,
  description,
  donationId,
  returnUrl,
}: {
  amount: number;
  description: string;
  donationId: number;
  returnUrl: string;
}) {
  const idempotenceKey = uuidv4();
  const auth = Buffer.from(
    `${config.yookassa.shopId}:${config.yookassa.secretKey}`
  ).toString('base64');

  const response = await axios.post(
    'https://api.yookassa.ru/v3/payments',
    {
      amount: {
        value: amount.toFixed(2),
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        return_url: returnUrl,
      },
      description,
      metadata: {
        donationId: donationId.toString(),
      },
      capture: true,
    },
    {
      headers: {
        'Idempotence-Key': idempotenceKey,
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}
