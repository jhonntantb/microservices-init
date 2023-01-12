import { Router } from 'express';

const routes = Router();

routes.get('/user/created', async (req, res) => {
  const user = {
    name: 'daniel',
    email: 'contact@jhonntantb.com',
  };
  await req.producer.send({
    topic: 'user',
    messages: [{ value: JSON.stringify(user) }],
  });

  console.log('Sent');

  return res.json({ status: 200 });
});
export default routes;
