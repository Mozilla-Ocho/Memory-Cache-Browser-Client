PROJECT_ROOT=$(realpath $0 | xargs dirname | xargs dirname)
cd $PROJECT_ROOT
yarn install
trap "exit" INT
while :
do
    fd --exclude 'api' . $PROJECT_ROOT/src | entr -d -r $PROJECT_ROOT/scripts/dev.sh
done
