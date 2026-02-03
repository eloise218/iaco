set -e

echo "▶ Build Next.js"
pnpm build

echo "▶ Préparation dossier deploy"
rm -rf deploy
mkdir -p deploy

# 1) Copier tout le contenu du standalone à la racine
cp -r .next/standalone/* deploy/
cp -r .next/standalone/.* deploy/ 2>/dev/null || true

# 2) Copier les assets statiques dans .next/static
mkdir -p deploy/.next
cp -r .next/static deploy/.next/static

# 3) Copier le dossier public (CRITIQUE pour les images/logo)
cp -r public deploy/public

# 4) Optionnel : copier package.json
cp package.json deploy/

echo "▶ Compression (tar.gz)"
tar -czvf deploy-next.tgz -C deploy .

echo "✅ Package prêt : deploy-next.tgz"
