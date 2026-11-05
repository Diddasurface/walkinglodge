# Walking Lodge

Sitio web y panel administrativo de Walking Lodge, un lodge amazonico ubicado en
Madre de Dios. La aplicacion administra experiencias, destinos, galeria, guias,
consultas de contacto, clientes y reservas.

## Tecnologias

- Next.js 16 y React 19
- TypeScript y Tailwind CSS 4
- Prisma ORM con MySQL
- NextAuth
- Sharp para optimizacion de imagenes
- PM2 y Apache en produccion

## Desarrollo local

Requiere Node.js 22 y una base de datos MySQL.

```bash
npm ci
npm run db:migrate
npm run dev
```

La aplicacion queda disponible en `http://localhost:3000`.

## Variables de entorno

Crea un archivo `.env` tomando como referencia `aws-ec2.env.example`. Nunca
subas el `.env` real al repositorio.

Variables requeridas:

```env
DATABASE_URL="mysql://USUARIO:PASSWORD@HOST:3306/walkinglodge"
NEXTAUTH_URL="https://walkinglodge.com"
NEXTAUTH_SECRET="SECRETO_LARGO_Y_UNICO"
SEED_ADMIN_PASSWORD="PASSWORD_INICIAL_SEGURO"
```

## Produccion

El despliegue oficial utiliza AWS EC2, MySQL, PM2 y Apache. Los pasos completos
estan en [DEPLOY_AWS_EC2.md](./DEPLOY_AWS_EC2.md).

Para actualizar una instalacion existente:

```bash
git pull --ff-only origin main
npm ci
npm run db:migrate
npm run build
pm2 restart walkinglodge --update-env
pm2 save
```

No ejecutes `npm run seed` durante actualizaciones normales. Las imagenes
subidas desde el dashboard se guardan en `public/uploads` y deben respaldarse
por separado porque no se versionan en Git.
