# Despliegue en AWS EC2

Esta guia despliega el proyecto como servidor Node.js con PM2, Apache y MySQL. Se recomienda Amazon RDS para la base de datos y una instancia EC2 Ubuntu 24.04 LTS para la aplicacion.

## 1. Crear los recursos en AWS

### EC2

- Sistema: Ubuntu Server 24.04 LTS.
- Instancia: `t3.small` como minimo recomendado para compilar Next.js. `t3.medium` da mas margen.
- Disco: 20 GB `gp3` o mas.
- Asigna una Elastic IP para que la IP publica no cambie.
- Conserva de forma segura el archivo `.pem` de la llave SSH.

Reglas de entrada del Security Group de EC2:

| Puerto | Origen | Uso |
| --- | --- | --- |
| 22 | Tu IP publica `/32` | SSH |
| 80 | `0.0.0.0/0` y `::/0` | HTTP |
| 443 | `0.0.0.0/0` y `::/0` | HTTPS |

No abras los puertos 3000 ni 3306 a Internet.

### RDS MySQL recomendado

1. Crea una instancia RDS MySQL 8 dentro de la misma VPC que EC2.
2. Usa el nombre de base de datos `walkinglodge`.
3. Marca `Public access: No`.
4. En el Security Group de RDS, permite TCP 3306 usando como origen el Security Group de EC2, no `0.0.0.0/0`.
5. Guarda el endpoint, usuario y password de RDS.

## 2. Conectarse por SSH

Desde PowerShell en tu computadora:

```powershell
ssh -i "C:\ruta\walkinglodge.pem" ubuntu@IP_PUBLICA_EC2
```

Los siguientes comandos se ejecutan dentro de EC2.

## 3. Instalar Node.js, Git, Apache y herramientas

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git apache2 mysql-client build-essential curl openssl

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

node --version
npm --version

sudo npm install -g pm2
pm2 --version
```

Next.js 16 requiere Node.js 20.9 o posterior; para este servidor se usa Node.js 22 LTS.

## 4. Subir el proyecto

Opcion recomendada con Git:

```bash
sudo mkdir -p /var/www/walkinglodge
sudo chown -R ubuntu:ubuntu /var/www/walkinglodge
git clone URL_DE_TU_REPOSITORIO /var/www/walkinglodge
cd /var/www/walkinglodge
```

Si el repositorio es privado, configura una llave de despliegue o usa la URL SSH del repositorio.

Las fotos administradas se guardan en `public/uploads` y esta carpeta no se versiona en Git. En la computadora local, abre otra consola PowerShell y copia las fotos existentes:

```powershell
scp -i "C:\ruta\walkinglodge.pem" -r "C:\laragon\www\walkinglodge\public\uploads" ubuntu@IP_PUBLICA_EC2:/var/www/walkinglodge/public/
```

Luego, en EC2, asegura permisos de escritura para el dashboard:

```bash
cd /var/www/walkinglodge
mkdir -p public/uploads
sudo chown -R ubuntu:ubuntu public/uploads
chmod -R u+rwX,go+rX public/uploads
```

## 5. Configurar variables de entorno

```bash
cd /var/www/walkinglodge
cp aws-ec2.env.example .env
nano .env
```

Contenido esperado:

```env
DATABASE_URL="mysql://USUARIO:PASSWORD@ENDPOINT_RDS:3306/walkinglodge"
NEXTAUTH_URL="https://walkinglodge.com"
NEXTAUTH_SECRET="SECRETO_GENERADO"
SEED_ADMIN_PASSWORD="PASSWORD_ADMIN_SEGURO"
```

Genera el secreto con:

```bash
openssl rand -base64 32
```

Si el usuario o password contiene `@`, `:`, `/`, `#`, `%` u otros caracteres especiales, deben codificarse como URL antes de colocarlos en `DATABASE_URL`.

## 6. Instalar, migrar y construir

```bash
cd /var/www/walkinglodge
npm ci
npm run db:migrate
npm run seed
npm run build
```

Ejecuta `npm run seed` solo durante la primera instalacion o cuando quieras restaurar los datos iniciales. El seed crea `admin@walkinglodge.com` usando `SEED_ADMIN_PASSWORD`. Esa variable solo se usa al crear el usuario; si el administrador ya existe, el seed no reemplaza su password.

Prueba la aplicacion antes de configurar Apache:

```bash
npm run start
```

En otra sesion SSH:

```bash
curl -I http://127.0.0.1:3000
```

Deten la prueba con `Ctrl+C`.

## 7. Mantener la aplicacion activa con PM2

PM2 es el supervisor del proceso Node.js. Mantiene la aplicacion ejecutandose despues de cerrar la conexion SSH, la reinicia si falla y la levanta despues de reiniciar EC2. No sustituye a Apache: PM2 mantiene Node activo y Apache recibe las visitas de Internet.

```bash
cd /var/www/walkinglodge
pm2 start ecosystem.config.cjs
pm2 status
pm2 logs walkinglodge --lines 100
pm2 save
pm2 startup systemd
```

El ultimo comando imprime otro comando que comienza con `sudo`. Copialo, ejecutalo y vuelve a guardar:

```bash
pm2 save
```

## 8. Configurar Apache

La plantilla ya esta configurada para `walkinglodge.com`:

```bash
cd /var/www/walkinglodge
nano deploy/apache.walkinglodge.conf
sudo cp deploy/apache.walkinglodge.conf /etc/apache2/sites-available/walkinglodge.conf

sudo a2enmod proxy proxy_http headers rewrite ssl
sudo a2ensite walkinglodge.conf
sudo a2dissite 000-default.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
sudo systemctl enable apache2
```

Configura en tu proveedor DNS un registro `A` para `walkinglodge.com` y otro para `www.walkinglodge.com`, apuntando a la Elastic IP. Cuando el DNS responda, prueba:

```bash
curl -I http://walkinglodge.com
```

## 9. Activar HTTPS gratis

```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d walkinglodge.com -d www.walkinglodge.com
sudo certbot renew --dry-run
```

Si no usaras `www`, quita `www.walkinglodge.com` tanto de Apache como del comando de Certbot.

## 10. Actualizaciones posteriores

```bash
cd /var/www/walkinglodge
git pull
npm ci
npm run db:migrate
npm run build
pm2 restart walkinglodge --update-env
pm2 status
```

No vuelvas a ejecutar el seed en cada actualizacion. `git pull` no elimina `public/uploads`, pero debes respaldar esa carpeta porque contiene las fotos subidas desde el dashboard.

## 11. Comandos de diagnostico

```bash
pm2 status
pm2 logs walkinglodge --lines 200
sudo systemctl status apache2
sudo apache2ctl configtest
sudo tail -n 100 /var/log/apache2/walkinglodge-error.log
curl -I http://127.0.0.1:3000
curl -I https://walkinglodge.com
npx prisma migrate status
df -h
free -h
```

## Alternativa: MySQL en la misma EC2

RDS es mas seguro y facilita backups, pero para ahorrar se puede instalar MySQL en la misma instancia:

```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
sudo mysql
```

Dentro de MySQL:

```sql
CREATE DATABASE walkinglodge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'walkinglodge_app'@'localhost' IDENTIFIED BY 'PASSWORD_MUY_SEGURO';
GRANT ALL PRIVILEGES ON walkinglodge.* TO 'walkinglodge_app'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

En `.env` usa:

```env
DATABASE_URL="mysql://walkinglodge_app:PASSWORD_CODIFICADO@127.0.0.1:3306/walkinglodge"
```

No abras el puerto 3306 en el Security Group de EC2.

## Backups necesarios

- Base de datos: activa backups automaticos y snapshots en RDS.
- Imagenes: respalda `/var/www/walkinglodge/public/uploads` de forma periodica.
- Variables: guarda una copia segura de `.env`; nunca la subas a Git.

Para crecer a varias instancias EC2, las imagenes deben migrarse de `public/uploads` a Amazon S3. Con una sola instancia y disco EBS persistente, el almacenamiento local funciona correctamente.
