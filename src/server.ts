import app from './app';          // <--- import default
import { env } from './config/env';

app.listen(env.port, () => {
  console.log(`✅ API escuchando en http://localhost:${env.port}`);
});
