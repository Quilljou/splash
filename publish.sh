#!/usr/bin/env sh
# only support macOS
set -e

# login
CLI="/Applications/wechatwebdevtools.app/Contents/MacOS/cli"

$CLI --login

CURRENT_VERSION=`node -p "require('./package.json').version"`
PWD=`pwd`
echo "\nCurrent version is: $CURRENT_VERSION"

echo "\nEnter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "\nWrite down the version description: "
  read desc
  echo "\nReleasing $VERSION ..."



  # commit
  git add -A
  # git commit -m "[release] $VERSION" # commit build message
  npm version $VERSION --force --message "release: $VERSION" # release new version

  echo `npm run build:weapp`

  $CLI -u "$VERSION@$PWD/dist" --upload-desc $desc

  # publish
  git push origin master
  git push origin refs/tags/v$VERSION
  # git checkout dev
  # git rebase master
  # git push eleme dev
fi
