import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.json({ message: 'Essa é uma rota backend dentro do Next' });
}
