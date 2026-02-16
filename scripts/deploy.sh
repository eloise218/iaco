set -e

echo "▶ Build Next.js"
pnpm build

echo "▶ Préparation dossier deploy"
rm -rf deploy
mkdir -p deploy

# 1) Copier tout le standalone (avec -L pour déréférencer les symlinks pnpm)
cp -rL .next/standalone/. deploy/

# 2) Aplatir les dépendances pnpm : copier tous les packages de .pnpm au top level
echo "▶ Résolution des dépendances pnpm"
find deploy/node_modules/.pnpm -path "*/node_modules/*/package.json" | while read pkg; do
  # Extraire le nom du package depuis le chemin : .../node_modules/<name>/package.json
  pkg_name=$(echo "$pkg" | sed 's|.*/node_modules/||; s|/package.json||')
  pkg_dir=$(dirname "$pkg")
  # Ignorer les sous-dossiers (ex: nanoid/non-secure) et les .pnpm internes
  if echo "$pkg_name" | grep -qE "^\.pnpm|/.*/" ; then continue; fi
  if [ ! -e "deploy/node_modules/$pkg_name" ]; then
    mkdir -p "deploy/node_modules/$(dirname "$pkg_name")"
    cp -r "$pkg_dir" "deploy/node_modules/$pkg_name"
    echo "  → $pkg_name"
  fi
done

# 3) Copier les assets statiques dans .next/static
cp -r .next/static deploy/.next/static

# 4) Copier le dossier public (CRITIQUE pour les images/logo)
cp -r public deploy/public

# 5) Copier les fichiers de traduction i18n (CRITIQUE pour next-intl)
cp -r messages deploy/messages

# 6) Copier .env.prod en tant que .env pour le serveur
cp .env.prod deploy/.env

echo "▶ Compression (tar.gz)"
tar -czvf deploy-next.tgz -C deploy .

echo "✅ Package prêt : deploy-next.tgz"
